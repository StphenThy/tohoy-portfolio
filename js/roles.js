// ROLES: the words that change on the about page. The list is in js/sections/about.js.

(() => {
  const text = document.getElementById("roleText");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let index = 0;
  setInterval(() => {
    text.classList.add("leaving");
    setTimeout(() => {
      index = (index + 1) % about.roles.length;
      text.textContent = about.roles[index];
      text.classList.remove("leaving");
    }, 280);
  }, 2800);
})();
