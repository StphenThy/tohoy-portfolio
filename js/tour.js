// TOUR: the guide cursor tours the page on its own and talks at each stop.
// Any scroll, click or key press from the visitor ends it.

(() => {
  // Each section's own message is in its file in js/sections/.
  const MESSAGES = {
    nav: "Press any of these to see more.",
    theme: "Pick white, dark or your device's mode here.",
    bye: "That's the tour. Press any section to look around! ✌️",
  };

  const guide = document.getElementById("guide");
  const tag = document.getElementById("guideTag");
  const typed = document.getElementById("guideTyped");
  const rest = document.getElementById("guideRest");
  const pill = document.getElementById("tourPill");
  const toggle = document.getElementById("tourToggle");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STOPPED = Symbol("stopped");

  document.getElementById("guideName").textContent = about.nickname;

  const store = {
    get(key) {
      try { return sessionStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { sessionStorage.setItem(key, value); } catch { /* private mode: replays each visit */ }
    },
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

  let runId = 0;
  let running = false;
  let width = innerWidth;
  const at = { x: 0, y: 0 };

  // Runs on animation frames with capped steps, so a hidden tab pauses the tour.
  const tween = (ms, onFrame) => new Promise((resolve, reject) => {
    const id = runId;
    let elapsed = 0;
    let last = performance.now();
    const frame = (now) => {
      if (id !== runId) return reject(STOPPED);
      elapsed += Math.min(now - last, 50);
      last = now;
      const t = ms > 0 ? Math.min(elapsed / ms, 1) : 1;
      onFrame?.(t);
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
  const wait = (ms) => tween(ms);

  const place = (x, y) => {
    at.x = x;
    at.y = y;
    guide.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  // Keeps the tag on screen when the cursor is at (x, y), above the cursor if asked or if needed.
  const fitTag = (x, y, above) => {
    const w = tag.offsetWidth;
    const h = tag.offsetHeight;
    const left = clamp(x + 14, 8, innerWidth - w - 8);
    const up = (above && y - h - 10 > 8) || y + 26 + h > innerHeight - 8;
    tag.style.transform = `translate(${left - x}px, ${up ? -h - 8 : 26}px)`;
    tag.classList.toggle("up", up);
    tag.classList.toggle("left", left < x);
  };

  const glide = (x, y) => {
    const fromX = at.x;
    const fromY = at.y;
    const dist = Math.hypot(x - fromX, y - fromY);
    // A slight bend so it moves like a hand rather than a ruler.
    const bend = dist * 0.14;
    const midX = (fromX + x) / 2 + ((y - fromY) / (dist || 1)) * bend;
    const midY = (fromY + y) / 2 - ((x - fromX) / (dist || 1)) * bend;
    return tween(reduced ? 0 : clamp(dist * 1.3, 450, 1100), (t) => {
      const p = ease(t);
      const q = 1 - p;
      place(
        q * q * fromX + 2 * q * p * midX + p * p * x,
        q * q * fromY + 2 * q * p * midY + p * p * y,
      );
    });
  };

  const scrollPage = (top) => {
    const from = scrollY;
    if (Math.abs(top - from) < 1) return Promise.resolve();
    return tween(reduced ? 0 : 900, (t) => {
      window.scrollTo({ top: from + (top - from) * ease(t), behavior: "instant" });
    });
  };

  const scrollFor = (el) => {
    const { top } = el.getBoundingClientRect();
    if (el.closest(".sidebar, .topbar") || (top > innerHeight * 0.18 && top < innerHeight * 0.68)) return scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    return clamp(scrollY + top - innerHeight * 0.32, 0, max);
  };

  const hush = () => {
    tag.classList.remove("talking");
    typed.textContent = "";
    rest.textContent = "";
  };

  const say = async (text, above) => {
    const chars = Array.from(text);
    typed.textContent = "";
    rest.textContent = text;
    tag.classList.add("talking");
    fitTag(at.x, at.y, above);
    if (!reduced) {
      let shown = 0;
      await tween(chars.length * 24, (t) => {
        const next = Math.round(t * chars.length);
        if (next === shown) return;
        shown = next;
        typed.textContent = chars.slice(0, shown).join("");
        rest.textContent = chars.slice(shown).join("");
      });
    } else {
      typed.textContent = text;
      rest.textContent = "";
    }
    await wait(clamp(900 + chars.length * 30, 1500, 3000));
  };

  const visit = async ({ el, text, above, spot }) => {
    const top = scrollFor(el);
    const rect = el.getBoundingClientRect();
    const shift = scrollY - top;
    const x = spot ? rect.left + rect.width * spot[0] : above ? rect.right + 8 : rect.left + Math.min(rect.width / 2, 90);
    const y = (spot ? rect.top + rect.height * spot[1] : above ? rect.top + rect.height / 2 : rect.bottom - 6) + shift;

    hush();
    fitTag(x, y, above);
    await Promise.all([scrollPage(top), glide(x, y)]);
    el.classList.add("tour-on");
    try {
      await say(text, above);
    } finally {
      el.classList.remove("tour-on");
    }
  };

  // Moves to the section's menu link and presses it. Phones hide the menu, so the section just opens.
  const openView = async (id) => {
    const link = nav.querySelector(`a[href="#${id}"]`);
    if (link.getClientRects().length) {
      const rect = link.getBoundingClientRect();
      const x = rect.left + 30;
      const y = rect.top + rect.height / 2;
      hush();
      fitTag(x, y);
      await glide(x, y);
      guide.classList.add("pressing");
      await wait(reduced ? 0 : 160);
      guide.classList.remove("pressing");
    }
    showView(id);
    await wait(reduced ? 0 : 250);
  };

  const homeStops = () => {
    const t = about.tourMessages;
    const list = [
      { text: t.hello, el: document.querySelector("h1"), above: true },
      // The model's box fills the page, so aim at its face, not the box.
      { text: t.avatar, el: document.getElementById("avatar"), spot: [0.56, 0.3], above: true },
      { text: t.about, el: document.querySelector(".about") },
      { text: t.clock, el: document.getElementById("clockTime") },
      { text: t.socials, el: document.querySelector(".home .links a") },
      { text: MESSAGES.nav, el: document.getElementById("nav") },
      { text: MESSAGES.nav, el: document.querySelector(".home-nav") },
      { text: MESSAGES.theme, el: document.querySelector(".theme-switch") },
    ];
    // Hidden targets drop out, such as the side menu on phones.
    return list.filter((stop) => stop.text && stop.el?.getClientRects().length);
  };

  const showPill = (label) => {
    toggle.textContent = label;
    pill.hidden = store.get("tourPill") === "off" && !running;
  };

  const finish = () => {
    running = false;
    guide.classList.remove("on");
    hush();
    showPill("take the tour again");
  };

  const run = async () => {
    await loaderDone;
    await wait(reduced ? 0 : 900);
    guide.classList.add("on");
    for (const stop of homeStops()) await visit(stop);
    for (const section of sections) {
      await openView(section.id);
      await visit({ text: section.tourMessage, el: document.querySelector(`#${section.id} h2`), above: true });
    }
    await openView(about.id);
    await visit({ text: MESSAGES.bye, el: document.querySelector("h1"), above: true });
    hush();
    await glide(innerWidth + 60, innerHeight * 0.35);
    finish();
  };

  const start = () => {
    if (running) return;
    running = true;
    runId += 1;
    store.set("tourSeen", "1");
    hush();
    showView(about.id);
    place(innerWidth + 40, innerHeight * 0.6);
    showPill("skip tour");
    run().catch((reason) => {
      if (reason !== STOPPED) throw reason;
    });
  };

  const stop = () => {
    if (!running || document.documentElement.classList.contains("loading")) return;
    runId += 1;
    finish();
  };

  toggle.addEventListener("click", () => (running ? stop() : start()));
  document.getElementById("tourDismiss").addEventListener("click", () => {
    stop();
    store.set("tourPill", "off");
    pill.hidden = true;
  });

  addEventListener("wheel", stop, { passive: true });
  addEventListener("touchmove", stop, { passive: true });
  addEventListener("keydown", stop);
  addEventListener("pointerdown", (event) => {
    if (!event.target.closest("#tourPill")) stop();
  });
  addEventListener("resize", () => {
    if (innerWidth !== width) stop();
    width = innerWidth;
  });

  const forced = new URLSearchParams(location.search).has("tour");
  const onHome = document.documentElement.classList.contains("is-home");
  if (forced || (!reduced && onHome && !store.get("tourSeen"))) start();
  else showPill("take the tour again");
})();
