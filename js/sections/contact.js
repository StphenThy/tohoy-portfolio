// CONTACT: every way to reach you, with your resume at the end.

const contact = {
  id: "contact",
  tourMessage: "Want to work together? Here's how to reach me.",

  items: [
    { label: "Gmail", text: "stephentohoy@gmail.com", url: "mailto:stephentohoy@gmail.com" },
    { label: "LinkedIn", text: "Stephen Tohoy ↗", url: "https://www.linkedin.com/in/stephen-tohoy-310654366/", newTab: true },
    { label: "Instagram", text: "@thy.stephen ↗", url: "https://www.instagram.com/thy.stephen/", newTab: true },
    { label: "GitHub", text: "StphenThy ↗", url: "https://github.com/StphenThy", newTab: true },
    { label: "Resume", text: "View my resume ↗", url: "resume/Stephen-Tohoy-Resume.pdf", newTab: true },
  ],

  render() {
    return `<ul class="contact-list">${this.items.map((item) => `
      <li>
        <span class="stack-label">${esc(item.label)}</span>
        <a href="${esc(item.url)}"${item.newTab ? ' target="_blank" rel="noopener"' : ""}>${esc(item.text)}</a>
      </li>`).join("")}</ul>`;
  },
};
