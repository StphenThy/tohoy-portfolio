// PREVIEWS: the project pictures. Pressing one lets the visitor scroll through it.
// Projects with a live site can also switch to the real site inside the frame.
// Mobile apps open inside an iPhone, at true phone size.

const PHONE = { width: 417, height: 876 }; // the screen plus its bezel

const fitPhone = (preview) => {
  const phone = preview.querySelector(".iphone");
  if (!phone) return;
  const scale = Math.min((preview.clientHeight - 28) / PHONE.height, (preview.clientWidth - 24) / PHONE.width, 1);
  phone.style.setProperty("--scale", scale);
};

const closePreview = (preview) => {
  preview.classList.remove("open");
  preview.querySelector(".preview-scroll").scrollTop = 0;
  setPreviewMode(preview, "screenshot");
};

const setPreviewMode = (preview, mode) => {
  const button = preview.querySelector(".preview-mode");
  if (!button) return;
  const live = mode === "live";
  button.innerHTML = live ? `${icon("camera")}Screenshot` : `${icon("monitor")}Live preview`;
  button.dataset.mode = mode;
  preview.classList.toggle("live", live);
  preview.querySelector(".live-view")?.remove();
  if (!live) return;

  const frame = document.createElement("iframe");
  frame.src = preview.dataset.live;
  frame.title = `${preview.dataset.project} live preview`;

  if (preview.classList.contains("preview-phone")) {
    const phone = document.createElement("div");
    phone.className = "iphone live-view";
    phone.innerHTML = '<div class="iphone-screen"><span class="iphone-island"></span></div>';
    phone.firstChild.prepend(frame);
    preview.append(phone);
    fitPhone(preview);
  } else {
    frame.className = "live-view";
    preview.append(frame);
  }
};

const openPreview = (preview) => {
  document.querySelectorAll(".preview.open").forEach((other) => {
    if (other !== preview) closePreview(other);
  });
  preview.classList.add("open");
};

document.querySelectorAll(".preview").forEach((preview) => {
  setPreviewMode(preview, "screenshot");
  preview.querySelector(".preview-press").addEventListener("click", () => openPreview(preview));
  preview.querySelector(".preview-close").addEventListener("click", () => closePreview(preview));
  preview.querySelector(".preview-mode")?.addEventListener("click", (event) => {
    openPreview(preview);
    setPreviewMode(preview, event.currentTarget.dataset.mode === "live" ? "screenshot" : "live");
  });
});

addEventListener("resize", () => document.querySelectorAll(".preview").forEach(fitPhone));

// Pressing outside a preview, or pressing Escape, closes it.
addEventListener("pointerdown", (event) => {
  document.querySelectorAll(".preview.open").forEach((preview) => {
    if (!preview.contains(event.target)) closePreview(preview);
  });
});
addEventListener("keydown", (event) => {
  if (event.key === "Escape") document.querySelectorAll(".preview.open").forEach(closePreview);
});
