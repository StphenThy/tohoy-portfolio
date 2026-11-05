// CERTIFICATIONS: copy a { ... } block to add a new certificate.

const certifications = {
  id: "certifications",
  tourMessage: "And the certificates I've earned.",

  items: [
    {
      name: "Create Your First Python Program From UST",
      issuer: "UST · Coursera",
      year: "2025",
      url: "https://coursera.org/verify/PTLHZSJ94UAI",
    },
    {
      name: "Build a free website with WordPress",
      issuer: "Coursera",
      year: "2025",
      url: "https://coursera.org/verify/GCI42Q4C6MDO",
    },
  ],

  render() {
    return `<ul class="rows">${this.items.map((cert) => `
      <li class="row">
        <div class="row-head">
          <h3>${esc(cert.name)}</h3>
          <span class="meta">${esc(cert.year)}</span>
        </div>
        <p class="org">${esc(cert.issuer)}</p>
        ${cert.url ? `<div class="links">${extLink({ label: "Verify", url: cert.url })}</div>` : ""}
      </li>`).join("")}</ul>`;
  },
};
