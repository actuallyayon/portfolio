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
  stats: {
    yearsCoding: { type: Number, default: 5 },
    projectsShipped: { type: Number, default: 11 },
    coreStacks: { type: Number, default: 6 },
    curiosity: { type: String, default: '∞' },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Profile', profileSchema);
