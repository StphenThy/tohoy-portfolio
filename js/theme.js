// COLOUR MODE: the three-way switch in the menu. "system" follows the visitor's device,
// and the choice is remembered for their next visit.
// Changing mode spreads the new colours out in a circle from the button that was pressed.

(() => {
  const root = document.documentElement;
  const device = matchMedia("(prefers-color-scheme: dark)");

  const OPTIONS = [
    { choice: "system", icon: "monitor", label: "Use device mode" },
    { choice: "light", icon: "sun", label: "White mode" },
    { choice: "dark", icon: "moon", label: "Dark mode" },
  ];

  const savedChoice = () => {
    try { return localStorage.getItem("theme") || "system"; } catch { return "system"; }
  };
  const saveChoice = (choice) => {
    try { localStorage.setItem("theme", choice); } catch { /* private mode: lasts for this visit */ }
  };

  let choice = savedChoice();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const apply = () => {
    root.dataset.theme = choice === "system" ? (device.matches ? "dark" : "light") : choice;
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.themeChoice === choice);
    });
  };

  const reveal = (button) => {
    const box = button.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  apply();
  device.addEventListener("change", apply);

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".theme-switch").forEach((box) => {
      box.innerHTML = OPTIONS.map((option) => `
        <button type="button" data-theme-choice="${option.choice}" aria-label="${option.label}" title="${option.label}">${icon(option.icon)}</button>`).join("");
    });
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const before = root.dataset.theme;
        choice = button.dataset.themeChoice;
        saveChoice(choice);
        const after = choice === "system" ? (device.matches ? "dark" : "light") : choice;
        if (after !== before && document.startViewTransition && !reduced) reveal(button);
        else apply();
      });
    });
    apply();
  });
})();
