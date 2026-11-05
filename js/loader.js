// LOADER: the loading screen. The percentage follows what has really finished loading,
// and it stays up for at least MIN_TIME so it doesn't just flash on fast connections.
// loaderDone lets other files wait for it. The tour uses this.

const loaderDone = new Promise((finish) => {
  const MIN_TIME = 1800;
  const MAX_TIME = 7000; // never trap a visitor if something is slow

  const root = document.documentElement;
  const loader = document.getElementById("loader");
  const pill = document.getElementById("loaderPill");
  const percent = document.getElementById("loaderPercent");
  const track = document.getElementById("loaderTrack");

  document.getElementById("loaderName").textContent = about.name;

  // Two identical halves, so the words can loop with no jump.
  const words = about.roles.map((role) => `<span>${esc(role)}</span>`).join("");
  track.innerHTML = words + words + words + words;

  const started = performance.now();
  let pageReady = false;
  let shown = 0;

  const ready = Promise.all([
    new Promise((resolve) => {
      if (document.readyState === "complete") resolve();
      else addEventListener("load", resolve, { once: true });
    }),
    document.fonts.ready,
  ]);
  ready.then(() => { pageReady = true; });

  const timer = setInterval(() => {
    const elapsed = performance.now() - started;
    const finished = (pageReady && elapsed >= MIN_TIME) || elapsed >= MAX_TIME;
    const goal = finished ? 100 : Math.min(90, (elapsed / MIN_TIME) * 90);
    shown += (goal - shown) * (finished ? 0.2 : 0.12);

    const value = shown > 99.4 ? 100 : Math.round(shown);
    percent.textContent = `${value}%`;
    pill.style.setProperty("--progress", shown > 99.4 ? 100 : shown);

    if (value === 100) {
      clearInterval(timer);
      setTimeout(() => {
        loader.classList.add("done");
        root.classList.remove("loading");
        finish();
        setTimeout(() => loader.remove(), 800);
      }, 250);
    }
  }, 30);
});
