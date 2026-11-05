// PAGE: puts the sections together. Change the order of this list to reorder the menu.
// A section with an empty items list is hidden, and the numbering adjusts itself.

const sections = [projects, stack, experience, certifications, github, contact]
  .filter((section) => section.items.length);

document.getElementById("top").innerHTML = `
  ${about.render()}
  ${sections.map((section, i) => `
    <section class="view block" id="${section.id}" hidden>
      <h2><span>${pad(i + 1)}</span> — ${section.id}</h2>
      ${section.render()}
    </section>`).join("")}
  <footer>© ${new Date().getFullYear()} ${esc(about.name)}</footer>`;

document.title = `${about.name} — Portfolio`;
document.querySelector('meta[name="description"]').content = about.description;
document.querySelectorAll("[data-name]").forEach((el) => { el.textContent = about.name; });
