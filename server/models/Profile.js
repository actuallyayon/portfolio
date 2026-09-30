const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Obaydur Rahman Ayon',
  },
  roleTitle: {
    type: String,
    default: 'Full Stack Developer',
  },
  heroDesc: {
    type: String,
    default: 'I build scalable, end-to-end web applications — from pixel-perfect interfaces to robust APIs. CS student & Full Stack Developer based in Khulna, Bangladesh.',
  },
  aboutParagraphs: {
    type: [String],
    default: [
      "I'm a Full Stack Web Developer and Computer Science student at North Western University, Khulna.",
      "I build modern web applications with React, Next.js, Node.js, Express, MongoDB, and TypeScript. I enjoy turning ideas into clean, usable products with strong frontend experiences and reliable backend systems.",
      "My foundation started with C/C++, algorithms, and problem solving. Now I focus on full-stack projects with authentication, dashboards, payments, APIs, and AI-powered features.",
      "Outside coding, I enjoy football, PC games, UI/UX inspiration, and sharing my learning journey publicly."
    ],
  },
  avatarUrl: {
    type: String,
    default: 'profile/ayon.png',
  },
  resumeUrl: {
    type: String,
    default: 'resume/Resume.pdf?v=20260921',
  },
  location: {
    type: String,
    default: 'Khulna, BD · GMT+6',
  },
  availableStatus: {
    type: String,
    default: 'Available · Open to Work',
  },
  email: {
    type: String,
    default: 'actuallyayon@gmail.com',
  },
  phone: {
    type: String,
    default: '+880 1327-000697',
  },
  whatsapp: {
    type: String,
    default: 'https://wa.me/8801327000697',
  },
  github: {
    type: String,
    default: 'https://github.com/actuallyayon',
  },
  linkedin: {
    type: String,
    default: 'https://linkedin.com/in/ayon-webdev',
  },
  aboutFacts: {
    education: { type: String, default: 'BSc CSE · NWU Khulna' },
    focus: { type: String, default: 'Full Stack Web' },
    certified: { type: String, default: 'Programming Hero & HackerRank' },
    basedIn: { type: String, default: 'Khulna, Bangladesh' },
  },
  contactHeading: {
    type: String,
    default: "Let's build\nsomething great.",
  },
  contactSub: {
    type: String,
    default: "Open to internships and remote roles worldwide. Whether it's a quick question or a full project — I reply within 24 hours.",
  },
  marqueeSkills: {
    type: [String],
    default: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Next.js', 'Tailwind', 'Express', 'Full Stack', 'REST API', 'Redux Toolkit'],
  },
  journeyMilestones: {
    type: [{
      year: String,
      title: String,
      org: String,
      desc: String,
    }],
    default: [
      {
        year: '2026',
        title: 'Complete Web Development Course With Programming Hero',
        org: 'Programming Hero · Certificate of Completion With Excellence',
        desc: 'Completed the Batch 13 program from January 1, 2026 to July 17, 2026, building proficiency across HTML, CSS, JavaScript, React.js, Next.js, Node.js, Express.js, MongoDB, and professional AI-powered development practices.',
      },
      {
        year: '2026',
        title: 'Frontend Developer (React) Certification',
        org: 'HackerRank · Verified Skill',
        desc: 'Earned a React-focused certification demonstrating component architecture, hooks, state management, API integration, and async data handling.',
      },
      {
        year: '2024 — Now',
        title: 'BSc in Computer Science & Engineering',
        org: 'North Western University, Khulna',
        desc: 'Studying algorithms, data structures, software engineering, and systems fundamentals while shipping production-minded full-stack web applications.',
      }
    ],
  },
  stats: {
    yearsCoding: { type: Number, default: 5 },
    projectsShipped: { type: Number, default: 11 },
    coreStacks: { type: Number, default: 6 },
    curiosity: { type: String, default: '∞' },
  },
  footerText: {
    type: String,
    default: 'Designed & built from scratch in Khulna, BD',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Profile', profileSchema);
