// EXPERIENCE: project-based experience, newest first. Each entry is real work from a project.

const experience = {
  id: "experience",
  tourMessage: "Here's what I've learned by building.",

  items: [
    {
      role: "Full-Stack Platform Development",
      tools: "React · TypeScript · Node.js · Express · MongoDB",
      year: "2026",
      summary: "Built Findry end to end, with separate job seeker and employer portals that only meet at the point of application.",
    },
    {
      role: "Explainable Matching Engine",
      tools: "TypeScript · Node.js",
      year: "2026",
      summary: "Designed Findry's match score from skills, experience and education, with a full breakdown of matched and missing skills on every result.",
    },
    {
      role: "AI Resume Parsing",
      tools: "Gemini API · pdf-parse · Mammoth",
      year: "2026",
      summary: "Added resume parsing and skill suggestions behind a swappable AI provider, falling back to a local engine whenever an AI call fails.",
    },
    {
      role: "Employer Portal Development",
      tools: "React · TypeScript · Tailwind CSS",
      year: "2026",
      summary: "Built Findry's job posting wizard, candidate management and analytics screens, plus in-app messaging between employers and applicants.",
    },
    {
      role: "API Security & Authentication",
      tools: "JWT · bcrypt · Zod · Helmet · Nodemailer",
      year: "2026",
      summary: "Secured Findry's API with token sign-in, password hashing, request validation, rate limiting and email verification codes.",
    },
    {
      role: "Full-Stack Web App Development",
      tools: "Next.js · TypeScript · Supabase",
      year: "2026",
      summary: "Built Lablet, a study app covering the six major Medical Technology subjects, with accounts, review material and progress tracking.",
    },
    {
      role: "In-Browser Document Processing",
      tools: "PDF.js · JSZip · Tesseract.js",
      year: "2026",
      summary: "Made Lablet read PDFs and PowerPoint files directly in the browser and turn a student's own pages into flashcards, with nothing uploaded.",
    },
    {
      role: "Learning & Assessment Features",
      tools: "TypeScript · React",
      year: "2026",
      summary: "Built spaced-repetition flashcard scheduling, quizzes and timed mock exams for Lablet.",
    },
    {
      role: "Interactive Landing Page Development",
      tools: "GSAP · React · Tailwind CSS",
      year: "2026",
      summary: "Created Lablet's landing page with a flip card, a playable quiz, a file drop demo and scroll animations that run with no backend.",
    },
    {
      role: "Mobile App Development",
      tools: "React Native · Expo",
      year: "2026",
      summary: "Built Pinay Stars, where members browse, search, favorite, review and submit profiles, and admins approve and manage records.",
    },
    {
      role: "REST API Development",
      tools: "PHP · MySQL",
      year: "2026",
      summary: "Wrote Pinay Stars' custom API with full CRUD, token-based accounts, reviews, notifications and rate limiting.",
    },
    {
      role: "Third-Party API Integration",
      tools: "TMDB API · JavaScript",
      year: "2026",
      summary: "Connected Pinay Stars to TMDB, matching each actress's film and TV titles to their posters.",
    },
    {
      role: "Portfolio Website Development",
      tools: "HTML · CSS · JavaScript",
      year: "2026",
      summary: "Built this site without a framework, including the self-running tour cursor, white and dark modes, and scrollable project previews.",
    },
    {
      role: "React Portfolio Development",
      tools: "React · TypeScript · Vite · GSAP",
      year: "2026",
      summary: "Built an earlier animated portfolio with reusable TypeScript components and Tailwind CSS.",
    },
    {
      role: "Generative AI Development",
      tools: "Generative AI · Tailwind CSS · Firebase",
      year: "2025",
      summary: "Built and deployed PipAI, a conversational assistant for writing, coding help and learning.",
    },
    {
      role: "Machine Learning in the Browser",
      tools: "TensorFlow.js · React · Recharts",
      year: "2025",
      summary: "Worked on InsightAI, a team project using a neural network for demand forecasting and customer churn prediction, with results shown in charts.",
    },
    {
      role: "Computer Vision Development",
      tools: "Python · OpenCV · MediaPipe",
      year: "2025",
      summary: "Built GestureMe, with Air Canvas for drawing in the air and a music controller that works by hand gesture through a webcam.",
    },
    {
      role: "Cross-Platform Mobile Development",
      tools: "Flutter · Dart · Supabase",
      year: "2024",
      summary: "Built SolarBuddy with user accounts, analytics charts, hourly forecasts and a smart usage planner.",
    },
    {
      role: "Front-End Web Development",
      tools: "HTML · CSS · JavaScript",
      year: "2024",
      summary: "Built my first personal portfolio and themed practice sites, published on GitHub Pages.",
    },
    {
      role: "Hardware Capstone Project",
      tools: "Hardware · Sensors",
      year: "2023",
      summary: "Developed an air quality monitoring system with my team to detect, display and help filter air pollutants, winning the Best Capstone Award.",
    },
  ],

  render() {
    return `<ul class="rows">${this.items.map((entry) => `
      <li class="row">
        <div class="row-head">
          <h3>${esc(entry.role)}</h3>
          <span class="meta">${esc(entry.year)}</span>
        </div>
        <p class="org">${esc(entry.tools)}</p>
        <p>${esc(entry.summary)}</p>
      </li>`).join("")}</ul>`;
  },
};
