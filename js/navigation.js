// NAVIGATION: shows one section at a time, plus the side menu and the phone menu.

const views = [about, ...sections].map((view) => view.id);

const nav = document.getElementById("nav");
nav.innerHTML = views.map((id) => `<a href="#${id}">${id}</a>`).join("");

// The buttons on the about page, for phones.
document.querySelector(".home-nav").innerHTML =
  sections.map((section) => `<a href="#${section.id}">${section.id}</a>`).join("");

document.getElementById("status").textContent = about.status;

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const setMenu = (open) => {
  sidebar.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.textContent = open ? "close" : "menu";
};
menuBtn.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));
nav.addEventListener("click", () => setMenu(false));

const showView = (id) => {
  const current = views.includes(id) ? id : about.id;
  document.querySelectorAll(".view").forEach((view) => { view.hidden = view.id !== current; });
  document.documentElement.classList.toggle("is-home", current === about.id);
  document.documentElement.dataset.view = current;
  nav.querySelectorAll("a").forEach((a) => {
    a.classList.toggle("active", a.hash === `#${current}`);
  });
  history.replaceState(null, "", `#${current}`);
  window.scrollTo({ top: 0, behavior: "instant" });
};

addEventListener("hashchange", () => showView(location.hash.slice(1)));
showView(location.hash.slice(1));
