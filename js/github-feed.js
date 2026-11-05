// GITHUB FEED: fills the GitHub page with live data once the loading screen is done.
// Results are kept for the visit, because GitHub limits how often a visitor can ask.

(() => {
  const feed = document.getElementById("githubFeed");

  // If the animation can't load, leave it out rather than show a broken image.
  document.querySelectorAll(".github-graph img").forEach((image) => {
    image.addEventListener("error", () => { document.getElementById("githubActivity").hidden = true; });
  });

  const KEY = "githubRepos";

  const timeAgo = (date) => {
    const words = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const days = Math.round((new Date(date) - Date.now()) / 86400000);
    if (Math.abs(days) < 30) return words.format(days, "day");
    if (Math.abs(days) < 365) return words.format(Math.round(days / 30), "month");
    return words.format(Math.round(days / 365), "year");
  };

  const fetchRepos = async () => {
    try {
      const saved = sessionStorage.getItem(KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* private mode: just ask GitHub */ }

    const response = await fetch(`https://api.github.com/users/${github.username}/repos?sort=pushed&per_page=100`);
    if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
    const repos = (await response.json())
      .filter((repo) => !repo.fork && !github.hidden.includes(repo.name))
      .map(({ name, description, language, html_url, pushed_at, stargazers_count }) =>
        ({ name, description, language, html_url, pushed_at, stargazers_count }));

    try { sessionStorage.setItem(KEY, JSON.stringify(repos)); } catch { /* fine without it */ }
    return repos;
  };

  const show = (repos) => {
    const languages = [...new Set(repos.map((repo) => repo.language).filter(Boolean))];
    feed.innerHTML = `
      <ul class="github-stats">
        <li><strong>${repos.length}</strong>public projects</li>
        <li><strong>${languages.length}</strong>languages</li>
        <li><strong>${esc(timeAgo(repos[0].pushed_at))}</strong>last update</li>
      </ul>
      <ul class="repos">${repos.slice(0, github.count).map((repo) => `
        <li>
          <a href="${esc(repo.html_url)}" target="_blank" rel="noopener">
            <h3>${esc(repo.name)} <span aria-hidden="true">↗</span></h3>
            ${repo.description ? `<p>${esc(repo.description)}</p>` : ""}
            <span class="meta">${repo.language ? `${esc(repo.language)} · ` : ""}updated ${esc(timeAgo(repo.pushed_at))}</span>
          </a>
        </li>`).join("")}</ul>`;
  };

  loaderDone
    .then(fetchRepos)
    .then(show)
    .catch(() => {
      feed.innerHTML = '<p class="github-note">GitHub can\'t be reached right now. You can still see everything on my profile below.</p>';
    });
})();
