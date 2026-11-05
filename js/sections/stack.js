// STACK: the tools you use, in groups. The icon names are listed in js/stack-icons.js.
// A tool with no icon listed there gets a plain dot.

const stack = {
  id: "stack",
  tourMessage: "These are the tools I use.",

  items: [
    {
      group: "Languages",
      tools: [
        { name: "TypeScript", icon: "typescript" },
        { name: "JavaScript", icon: "javascript" },
        { name: "Python", icon: "python" },
        { name: "PHP", icon: "php" },
        { name: "Dart", icon: "dart" },
        { name: "HTML", icon: "html" },
        { name: "CSS", icon: "css" },
        { name: "SQL" },
      ],
    },
    {
      group: "Frontend",
      tools: [
        { name: "React", icon: "react" },
        { name: "Next.js", icon: "next" },
        { name: "Vite", icon: "vite" },
        { name: "Tailwind CSS", icon: "tailwind" },
        { name: "React Router", icon: "reactrouter" },
        { name: "GSAP", icon: "gsap" },
        { name: "Anime.js", icon: "anime" },
        { name: "Recharts" },
        { name: "PostCSS", icon: "postcss" },
      ],
    },
    {
      group: "Mobile",
      tools: [
        { name: "React Native", icon: "react" },
        { name: "Expo", icon: "expo" },
        { name: "Flutter", icon: "flutter" },
      ],
    },
    {
      group: "Backend",
      tools: [
        { name: "Node.js", icon: "node" },
        { name: "Express", icon: "express" },
        { name: "Mongoose", icon: "mongoose" },
        { name: "JWT", icon: "jwt" },
        { name: "Zod", icon: "zod" },
        { name: "Nodemailer", icon: "nodemailer" },
        { name: "Multer" },
        { name: "Helmet" },
      ],
    },
    {
      group: "Databases & Cloud",
      tools: [
        { name: "MongoDB", icon: "mongodb" },
        { name: "MySQL", icon: "mysql" },
        { name: "Supabase", icon: "supabase" },
        { name: "Firebase", icon: "firebase" },
        { name: "Vercel", icon: "vercel" },
        { name: "Render", icon: "render" },
      ],
    },
    {
      group: "AI & Computer Vision",
      tools: [
        { name: "Gemini API", icon: "gemini" },
        { name: "TensorFlow.js", icon: "tensorflow" },
        { name: "OpenCV", icon: "opencv" },
        { name: "MediaPipe", icon: "mediapipe" },
        { name: "NumPy", icon: "numpy" },
        { name: "Tesseract.js" },
      ],
    },
    {
      group: "Tools",
      tools: [
        { name: "Git", icon: "git" },
        { name: "GitHub", icon: "github" },
        { name: "npm", icon: "npm" },
        { name: "ESLint", icon: "eslint" },
      ],
    },
  ],

  render() {
    return `<div class="stack-groups">${this.items.map((item) => `
      <div>
        <h3 class="stack-label">${esc(item.group)}</h3>
        <ul class="tools">${item.tools.map((tool) => `
          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${STACK_ICONS[tool.icon] ?? STACK_ICONS.dot}"/></svg>${esc(tool.name)}</li>`).join("")}
        </ul>
      </div>`).join("")}</div>`;
  },
};
