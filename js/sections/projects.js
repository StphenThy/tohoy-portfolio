// PROJECTS: the things you've built. Copy a { ... } block to add one.
// preview is a long screenshot in assets/projects/ that visitors can scroll.
// live is optional: a site to open inside the frame. phone: true shows it at phone width.

const projects = {
  id: "projects",
  tourMessage: "These are the things I've built. Press a picture to explore it.",

  items: [
    {
      name: "Findry",
      preview: "assets/projects/findry.jpg",
      live: "https://findry-ph.vercel.app",
      year: "2026",
      description: "AI job matching for the Philippine tech market, with separate portals for job seekers and employers. It parses resumes with Gemini and explains every match score.",
      tags: ["React", "TypeScript", "Node.js", "MongoDB", "Gemini"],
      links: [
        { label: "Live", url: "https://findry-ph.vercel.app" },
        { label: "Code", url: "https://github.com/StphenThy/findry" },
      ],
    },
    {
      name: "PipAI",
      preview: "assets/projects/pipai.jpg",
      live: "https://pipaipoy.web.app/",
      year: "2025",
      description: "An AI assistant for natural conversation, creative writing, coding help and learning new topics.",
      tags: ["Generative AI", "Tailwind CSS", "Firebase"],
      links: [{ label: "Live", url: "https://pipaipoy.web.app/" }],
    },
    {
      name: "SolarBuddy",
      preview: "assets/projects/solarbuddy.jpg",
      live: "https://solarbuddy-16093.web.app/",
      phone: true,
      year: "2024",
      description: "A mobile app for solar owners. It monitors solar output, forecasts production, plans energy use around it and shows the carbon saved.",
      tags: ["Flutter", "Dart", "Supabase"],
      links: [
        { label: "Live", url: "https://solarbuddy-16093.web.app/" },
        { label: "Code", url: "https://github.com/StphenThy/Solarbuddy" },
      ],
    },
    {
      name: "Lablet",
      preview: "assets/projects/lablet.jpg",
      year: "2026",
      description: "A study app for Filipino Medical Technology students, covering the six major subjects with review material, quizzes, spaced-repetition flashcards and timed mock exams.",
      tags: ["Next.js", "TypeScript", "Supabase"],
      links: [],
    },
    {
      name: "Pinay Stars",
      preview: "assets/projects/pinay-stars.jpg",
      year: "2026",
      description: "A mobile app for discovering Pinay actresses. Members browse, review and submit profiles, backed by a custom PHP API, with film posters from TMDB.",
      tags: ["React Native", "Expo", "PHP", "MySQL"],
      links: [{ label: "Code", url: "https://github.com/StphenThy/pinay-stars" }],
    },
  ],

  render() {
    return `<ul class="cards">${this.items.map((project, i) => `
      <li class="card">
        <div class="preview${project.phone ? " preview-phone" : ""}" data-project="${esc(project.name)}" ${project.live ? `data-live="${esc(project.live)}"` : ""}>
          <div class="preview-scroll"><img src="${esc(project.preview)}" alt="${esc(project.name)} screenshot" loading="lazy"></div>
          <button class="preview-press" type="button" aria-label="Explore ${esc(project.name)}"><span>press to explore</span></button>
          <div class="preview-actions">
            ${project.live ? '<button class="preview-mode" type="button"></button>' : ""}
            <button class="preview-close" type="button">close</button>
          </div>
        </div>
        <div class="card-body">
          <p class="card-number">Project ${pad(i + 1)} · ${esc(project.year)}</p>
          <h3>${esc(project.name)}</h3>
          <p>${esc(project.description)}</p>
          <ul class="tags">${project.tags.map((tag) => `<li>${esc(tag)}</li>`).join("")}</ul>
          ${project.links.length ? `
            <div class="card-foot">
              <span>Explore the project</span>
              <div class="card-links">${project.links.map(extLink).join("")}</div>
            </div>` : ""}
        </div>
      </li>`).join("")}</ul>`;
  },
};
