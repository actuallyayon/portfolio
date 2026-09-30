const User = require('../models/User');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const Profile = require('../models/Profile');

const defaultProjects = [
  {
    slug: 'cartora',
    num: '01 / Featured ★ Flagship Project',
    title: 'Cartora',
    tagline: 'Full-Featured Modern E-Commerce Platform',
    image: 'sites/Cartora.png',
    live: 'https://cartora-client.vercel.app',
    serverApi: 'https://cartora-server.vercel.app',
    githubClient: 'https://github.com/actuallyayon/cartora-client',
    githubServer: 'https://github.com/actuallyayon/cartora-server',
    tech: ['Next.js 16 (App Router)', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'TanStack React Query 5', 'Stripe Elements', 'Framer Motion', 'Recharts', 'Google OAuth', 'Vercel'],
    desc: 'A full-featured, modern e-commerce platform built for a premium shopping experience — complete with Stripe-powered checkout, real-time notifications, and a full admin dashboard with analytics. Cartora seamlessly connects customer shopping workflows with robust merchant controls.',
    features: [
      '<b>Product Catalog & Details:</b> Browse, search, and filter products with category navigation, image galleries, size charts, and variant selection.',
      '<b>Shopping Cart & Wishlist:</b> Real-time cart totals plus a wishlist to save favorite products for later.',
      '<b>Secure Checkout:</b> Stripe Elements-powered card payments with address management and order tracking.',
      '<b>User Dashboard:</b> Profile management, saved addresses, and full order history.',
      '<b>Admin Analytics Dashboard:</b> Revenue charts, order frequency graphs, and category breakdowns powered by Recharts.',
      '<b>Product & Order Management:</b> Full CRUD for products with image uploads, plus order status updates from processing to delivered.',
      '<b>Real-Time Notifications:</b> Instant alerts when customers complete purchases.',
      '<b>Premium Responsive Design:</b> Dark/light theme toggle, Framer Motion micro-animations, and a mobile-first, fully responsive UI.'
    ],
    challenges: [
      '<b>Stripe Webhook Synchronization:</b> Handled Stripe webhook idempotency and state synchronization across Next.js 16 App Router and server routes to prevent double-charging or missed order updates.',
      '<b>Low-Overhead Notifications:</b> Implemented low-latency purchase notifications without heavy WebSocket server memory overhead by tuning polling intervals and server events.',
      '<b>Complex Data Visualization:</b> Formatted revenue and order frequency charts with Recharts to remain fluid and responsive on mobile viewports.'
    ],
    future: [
      '<b>Multi-Currency & Tax Engine:</b> Integrate automated international currency conversion with location-based tax calculation.',
      '<b>AI-Driven Recommendations:</b> Implement collaborative filtering to surface personalized product recommendations.',
      '<b>Sub-Millisecond Search:</b> Integrate Algolia or ElasticSearch for ultra-fast fuzzy product search.'
    ],
    isTeamProject: false,
    isFeatured: true,
    order: 1,
  },
  {
    slug: 'startupforge',
    num: '02',
    title: 'StartupForge',
    tagline: 'Founder & Collaborator Ecosystem Platform',
    image: 'sites/StartupForge.png',
    live: 'https://startupforge-client-nine.vercel.app',
    serverApi: '',
    githubClient: 'https://github.com/actuallyayon/startupforge-client',
    githubServer: 'https://github.com/actuallyayon/startupforge-server',
    tech: ['Next.js 15 (App Router)', 'React 18', 'Tailwind CSS', 'TanStack Query', 'Better Auth', 'Stripe', 'Axios', 'Framer Motion', 'Recharts', 'Vercel'],
    desc: 'A full-stack platform where startup founders can publish their startups, post collaboration opportunities, and build early teams — while collaborators browse opportunities, apply to roles, and track their applications every step of the way.',
    features: [
      '<b>Role-Based Dashboards:</b> Dedicated experiences for founders, collaborators, and admins — each tailored to their specific workflow.',
      '<b>Secure Authentication:</b> Email/password and Google sign-in powered by Better Auth.',
      '<b>Smart Opportunity Discovery:</b> Server-side search, filters, and pagination for browsing startups and open roles.',
      '<b>Founder Toolkit:</b> Create startups, post opportunities, review applications, and upgrade to premium — all in one place.',
      '<b>Stripe-Powered Premium:</b> Seamless checkout flow for founders upgrading their account.',
      '<b>Admin Control Center:</b> Manage users, startup approvals, transactions, and revenue insights with Recharts-powered analytics.',
      '<b>Premium Responsive Design:</b> Dark/light theme toggle, Framer Motion animations, and a fully responsive UI across all devices.'
    ],
    challenges: [
      '<b>Role-Based Access Control (RBAC):</b> Structured granular permissions using Better Auth middleware across Founders, Collaborators, and Admins.',
      '<b>Multi-Stage Application State:</b> Managed nested state updates when founders accept, reject, or interview applicants.',
      '<b>Performant Filtering:</b> Optimized server-side search and category filtering for open startup opportunities.'
    ],
    future: [
      '<b>In-App Real-Time Messaging:</b> Direct chat and video interview scheduling between founders and applicants.',
      '<b>AI Talent Matching:</b> Automated skill matching algorithms to highlight top candidate fits for open roles.',
      '<b>Co-Founder Vesting Tools:</b> Equity calculator and vesting schedule templates for early teams.'
    ],
    isTeamProject: false,
    isFeatured: false,
    order: 2,
  },
  {
    slug: 'habitpilot',
    num: '03',
    title: 'HabitPilot',
    tagline: 'AI-Driven Adaptive Habit Tracking System',
    image: 'sites/HabitPilot.png',
    live: 'https://habitpilot-client.vercel.app/',
    serverApi: '',
    githubClient: 'https://github.com/actuallyayon/habitpilot-client',
    githubServer: 'https://github.com/actuallyayon/habitpilot-server',
    tech: ['Next.js 16 (App Router)', 'React 19', 'TypeScript', 'Tailwind CSS 4.0', 'TanStack React Query v5', 'Express.js', 'MongoDB', 'Groq Cloud (Llama 3)', 'Stripe', 'Framer Motion', 'Recharts', 'Vercel'],
    desc: 'An AI-driven, adaptable habit tracking platform where agentic AI models design, analyze, and constantly recalibrate user habit routines based on real-world feedback.',
    features: [
      '<b>AI Onboarding & Plan Generator:</b> Step-by-step questionnaire generates tailor-made habit plans suited to each user\'s lifestyle.',
      '<b>AI Routine Analyzer:</b> Groq-powered Llama 3 integration designs habit schedules, customizes checklists, and analyzes daily check-ins.',
      '<b>Interactive Dashboard:</b> Log habits, track check-ins, view stats, and get AI-driven suggestions in real time.',
      '<b>Public Habit Explore Feed:</b> A public catalog of pre-generated AI plans users can explore, clone, and customize.',
      '<b>Admin Control Panel:</b> MRR revenue analytics, signup growth graphs (Recharts), and user management with lock/unlock controls.',
      '<b>Subscription Billing:</b> Stripe Sandbox integration for subscription payments and webhook handling.',
      '<b>Secure Authentication:</b> JWT sessions with refresh tokens, Google OAuth, and demo login flows.',
      '<b>Premium Responsive Design:</b> Dark-themed UI with glassmorphic navigation and Framer Motion micro-animations.'
    ],
    challenges: [
      '<b>Strict AI JSON Validation:</b> Engineered robust prompt engineering and JSON response validation with Groq Llama 3 to prevent API output syntax errors.',
      '<b>Token Lifecycle Security:</b> Maintained HTTP-only cookie JWT access and refresh token rotation between Next.js client and Express backend.',
      '<b>Timezone Habit Recalibration:</b> Designed resilient streak calculations that accommodate user timezone changes gracefully.'
    ],
    future: [
      '<b>Telegram & WhatsApp Bots:</b> Instant daily habit check-ins via instant messaging bots.',
      '<b>Social Accountability Leagues:</b> Community habit challenges with peer support leaderboards.',
      '<b>Voice Reflections:</b> Voice-to-text journaling with sentiment analysis for tracking mental well-being.'
    ],
    isTeamProject: false,
    isFeatured: false,
    order: 3,
  },
  {
    slug: 'athenaeum',
    num: '04',
    title: 'Athenaeum',
    tagline: 'Modern Digital Library & Management System',
    image: 'sites/Athenaeum.png',
    live: 'https://actuallyayon-athenaeum.vercel.app/',
    serverApi: '',
    githubClient: 'https://github.com/actuallyayon/athenaeum',
    githubServer: '',
    tech: ['Next.js', 'React', 'Tailwind CSS', 'DaisyUI', 'BetterAuth', 'MongoDB', 'SwiperJS', 'Vercel'],
    desc: 'A modern digital library where users explore books, filter by category, search by title or author, borrow titles digitally, and manage secure profiles — powered by BetterAuth and MongoDB.',
    features: [
      '<b>Digital Library Catalog:</b> Category filtering, dynamic title/author search, and book previews.',
      '<b>Digital Borrowing System:</b> Manage borrowed books with due date tracking and instant returns.',
      '<b>Secure Authentication:</b> User profile management and session protection via BetterAuth.',
      '<b>Interactive Showcase:</b> Smooth SwiperJS carousels and DaisyUI dark/light theme integration.'
    ],
    challenges: [
      '<b>Search Query Aggregations:</b> Optimized MongoDB indexes for sub-50ms title and category search responses.',
      '<b>BetterAuth Custom Schema:</b> Extended BetterAuth session handlers to store custom digital borrowing histories.'
    ],
    future: [
      '<b>In-Browser Reader:</b> Integrated PDF & EPUB online reader for direct borrowing experience.',
      '<b>Community Reviews:</b> Rating system and personal reading list bookmarking.'
    ],
    isTeamProject: false,
    isFeatured: false,
    order: 4,
  },
  {
    slug: 'edumanage',
    num: 'Team Project / AI School Management',
    title: 'EduManage',
    tagline: 'School & Academic Management System',
    image: 'sites/EduManage.png',
    live: 'https://edu-manage-umber-two.vercel.app/',
    serverApi: '',
    githubClient: 'https://github.com/Shifath0570/EduManage',
    githubServer: 'https://github.com/Shifath0570/EduManage_Server',
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'HeroUI', 'Express.js', 'MongoDB', 'Framer Motion', 'Recharts', 'Google Gemini', 'Groq', 'JWT'],
    desc: 'EduManage is an AI-powered school and academic management system built from scratch by a four-person team. It brings everyday school operations into one platform with dedicated dashboards for admins, teachers, and students.',
    features: [
      '<b>Role-Based Dashboards:</b> Admin, teacher, and student dashboards with JWT authentication and role-based access control.',
      '<b>AI Academic Tools:</b> AI question paper and notice generation using Google Gemini and Groq, plus an AI study assistant with LaTeX math support.',
      '<b>Attendance & Alerts:</b> Teacher and admin attendance workflows with analytics, leave approval, and student attendance alerts with AI-analyzed warnings.',
      '<b>Academic Operations:</b> Exam management, marks entry, result cards, fee collection, payroll, and PDF/Excel receipts.',
      '<b>My Contribution:</b> Built attendance features, AI-analyzed student warnings, the AI-generated blog section, dynamic Contact Us flow, and responsive dashboard UI.',
      '<b>Team:</b> Kazi Mohammad Shariful Amin, Md Maksumul Haque Emon, Md. Osman Goni, and Obaydur Rahman Ayon.'
    ],
    challenges: [
      '<b>Team Delivery:</b> Coordinated across frontend and backend responsibilities while keeping reviews focused on consistent user flows and data contracts.',
      '<b>Attendance Logic:</b> Designed attendance workflows that support teacher/admin usage, analytics, leave approval, and student-facing warning states.',
      '<b>AI Feature Reliability:</b> Integrated AI-generated content in academic workflows while shaping outputs for notices, blogs, and student-facing guidance.'
    ],
    future: [
      '<b>Deeper Analytics:</b> Expand attendance, exam, and fee dashboards with richer trend reports for school admins.',
      '<b>Notification Channels:</b> Add email/SMS alerts for attendance risk, notices, fee reminders, and result publication.',
      '<b>School Onboarding:</b> Build guided onboarding for multi-school setup, roles, academic sessions, and permission templates.'
    ],
    isTeamProject: true,
    isFeatured: false,
    order: 5,
  }
];

const defaultCertificates = [
  {
    num: '01 / Batch 13',
    title: 'Complete Web Development Course With Programming Hero',
    organization: 'Programming Hero',
    dateRange: 'Jan 2026 - Jul 2026',
    desc: 'Certificate of completion with excellence for mastering HTML, CSS, JavaScript, React.js, Next.js, Node.js, Express.js, MongoDB, and AI-powered development practices.',
    coverImage: 'Certificates/programming-hero-certificate-cover.png',
    driveLink: 'https://drive.google.com/file/d/19daIIWxL7xoh2oL5SMrJVbqwztaQxLE2/view?usp=sharing',
    pdfUrl: 'Certificates/certificate_student.pdf',
    order: 1,
  },
  {
    num: '02 / Verified Skill',
    title: 'Frontend Developer (React) Certification',
    organization: 'HackerRank',
    dateRange: '2026',
    desc: 'Verified React credential covering component architecture, hooks, state management, API integration, and modern frontend problem solving.',
    coverImage: 'Certificates/hackerrank-react-certificate-cover.png',
    driveLink: 'https://www.hackerrank.com/certificates/a51326893c85',
    pdfUrl: 'Certificates/frontend_developer_react certificate.pdf',
    order: 2,
  }
];

const seedInitialData = async () => {
  try {
    // 1. Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'actuallyayon@gmail.com';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'ayonadmin12345';

    let admin = await User.findOne({ email: adminEmail.toLowerCase().trim() });
    if (!admin) {
      admin = await User.create({
        email: adminEmail.toLowerCase().trim(),
        password: adminPassword,
        name: 'Obaydur Rahman Ayon',
        role: 'admin',
      });
      console.log(`[Seed] Created initial Admin user: ${adminEmail} (password: ${adminPassword})`);
    }

    // 2. Seed Projects if none exist
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(defaultProjects);
      console.log(`[Seed] Seeded ${defaultProjects.length} initial projects.`);
    }

    // 3. Seed Certificates if none exist
    const certCount = await Certificate.countDocuments();
    if (certCount === 0) {
      await Certificate.insertMany(defaultCertificates);
      console.log(`[Seed] Seeded ${defaultCertificates.length} initial certificates.`);
    }

    // 4. Seed Profile if none exists
    const profile = await Profile.findOne();
    if (!profile) {
      await Profile.create({});
      console.log(`[Seed] Seeded initial profile data.`);
    }
  } catch (error) {
    console.error('[Seed Error]:', error.message);
  }
};

module.exports = { seedInitialData };
