// GITHUB: your latest repos, loaded live from GitHub. The loading code is in js/github-feed.js.

const github = {
  id: "github",
  tourMessage: "This page updates by itself from my GitHub.",
  username: "StphenThy",
  count: 8, // how many repos to show

  // Repos to leave out, such as empty ones.
  hidden: ["StphenThy", "pic"],

  // Your contribution animation, made by the workflow in your GitHub profile repo.
  activity: {
    dark: "https://raw.githubusercontent.com/StphenThy/StphenThy/output/pacman-contribution-graph-dark.svg",
    light: "https://raw.githubusercontent.com/StphenThy/StphenThy/output/pacman-contribution-graph.svg",
  },

  items: ["live"],

  render() {
    return `
      <div class="github-activity" id="githubActivity">
        <h3 class="stack-label">Contribution activity</h3>
        <div class="github-graph">
          <img class="for-dark" src="${esc(this.activity.dark)}" alt="My GitHub contribution activity">
          <img class="for-light" src="${esc(this.activity.light)}" alt="My GitHub contribution activity">
        </div>
      </div>
      <div class="github-feed" id="githubFeed"><p class="github-note">Loading from GitHub…</p></div>
      <div class="links">${extLink({ label: "See my full GitHub", url: `https://github.com/${this.username}` })}</div>`;
  },
};
