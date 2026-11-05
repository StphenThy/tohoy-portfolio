// ABOUT: the first page visitors see, with your 3D character, text, clock and social links.
// It never scrolls, so keep the text about this length.
// The character itself is built in js/avatar.js.

const about = {
  id: "about",
  name: "Stephen Tohoy",
  nickname: "Stephen", // shown on the tour cursor's name tag
  photo: "assets/stephen.png", // shown instead of the character if a browser can't do 3D

  status: "Open to work", // shown with a green dot in the menu

  // The words that change on the right. Keep them short.
  roles: ["Full-Stack Developer", "Mobile Developer", "Generative AI Builder"],

  // Plain version of your about text, for search engines and link previews.
  description: "I'm a full-stack developer who builds web and mobile applications, with a current focus on generative AI.",

  // One string per paragraph. Wrap words in <strong> to make them stand out.
  paragraphs: [
    "I build web and mobile applications, with a current focus on <strong>generative AI</strong>.",
    "I'm constantly working on new projects, and I enjoy taking <strong>early-stage ideas</strong> and shaping them into products people genuinely use.",
  ],

  // The three tiles on the right. The icons are listed in js/helpers.js.
  focus: [
    { icon: "monitor", label: "Web apps" },
    { icon: "phone", label: "Mobile apps" },
    { icon: "sparkle", label: "Generative AI" },
  ],

  socials: [
    { label: "GitHub", url: "https://github.com/StphenThy" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/stephen-tohoy-310654366/" },
    { label: "Instagram", url: "https://www.instagram.com/thy.stephen/" },
  ],

  // What the tour cursor says here.
  tourMessages: {
    hello: "Hi! I'm Stephen, welcome to my portfolio 👋",
    avatar: "This 3D model watches you while you visit. Move your cursor and see!",
    about: "Here's a little about me.",
    clock: "This is my time right now in Davao City.",
    socials: "You can find me here.",
  },

  render() {
    return `
      <section class="view home" id="about">
        <div class="home-main">
          <div class="avatar" id="avatar">
            <img class="portrait" src="${esc(this.photo)}" alt="Portrait of ${esc(this.name)}">
          </div>
          <div class="home-text">
            <p class="hello">Hello! I'm</p>
            <h1>${this.name.split(" ").map(esc).join(" <br>")}</h1>
            <div class="about">${this.paragraphs.map((text) => `<p>${text}</p>`).join("")}</div>
          </div>
          <div class="home-side">
            <p class="role"><span class="hello">A</span><span class="role-text" id="roleText">${esc(this.roles[0])}</span></p>
            <ul class="focus">${this.focus.map((item) => `<li>${icon(item.icon)}${esc(item.label)}</li>`).join("")}</ul>
          </div>
        </div>
        <div class="home-bottom">
          <div class="clock">
            <p class="clock-time" id="clockTime"></p>
            <div>
              <p class="clock-place" id="clockPlace"></p>
              <p class="clock-place" id="clockOffset"></p>
            </div>
          </div>
          <div class="links">${this.socials.map(extLink).join("")}</div>
          <nav class="home-nav" aria-label="Sections"></nav>
        </div>
      </section>`;
  },
};
