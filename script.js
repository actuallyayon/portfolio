"use strict";
document.documentElement.classList.add('js-ready');
/* custom cursor */
const finePointer = matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches;
const cur = document.getElementById('cur');
const curR = document.getElementById('curR');
if (finePointer && cur && curR) {
    let mx = innerWidth / 2;
    let my = innerHeight / 2;
    let rx = mx;
    let ry = my;
    let cursorFrame = 0;
    function moveCursorRing() {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        curR.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
        if (Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1) {
            cursorFrame = requestAnimationFrame(moveCursorRing);
        }
        else {
            cursorFrame = 0;
        }
    }
    addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        cur.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
        if (!cursorFrame)
            cursorFrame = requestAnimationFrame(moveCursorRing);
    }, { passive: true });
    document.querySelectorAll('a,button,[role="link"],[role="button"],[data-magnetic]').forEach(el => {
        el.addEventListener('mouseenter', () => curR.classList.add('grow'));
        el.addEventListener('mouseleave', () => curR.classList.remove('grow'));
    });
}
/* nav scrolled + scroll progress */
const nav = document.getElementById('nav');
const progress = document.getElementById('progress');
let scrollFrame = 0;
function updateScrollUi() {
    scrollFrame = 0;
    if (nav)
        nav.classList.toggle('scrolled', scrollY > 50);
    const h = document.documentElement;
    if (progress) {
        const maxScroll = h.scrollHeight - h.clientHeight;
        progress.style.transform = 'scaleX(' + (maxScroll > 0 ? h.scrollTop / maxScroll : 0) + ')';
    }
}
addEventListener('scroll', () => {
    if (!scrollFrame)
        scrollFrame = requestAnimationFrame(updateScrollUi);
}, { passive: true });
updateScrollUi();
/* reveal */
if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('on');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(el => io.observe(el));
}
else {
    document.querySelectorAll('.rv').forEach(el => el.classList.add('on'));
}
/* count up */
const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting)
            return;
        const el = entry.target;
        const to = +(el.dataset.count || '0');
        let n = 0;
        const step = Math.max(1, Math.round(to / 30));
        const timer = window.setInterval(() => {
            n += step;
            if (n >= to) {
                n = to;
                clearInterval(timer);
            }
            el.textContent = n + (to >= 10 ? '+' : '');
        }, 35);
        countObs.unobserve(el);
    });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));
/* magnetic buttons */
if (finePointer) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}
/* mobile menu */
const navToggle = document.getElementById('navToggle');
const navlinks = document.getElementById('navlinks');
if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('lock', isOpen);
    });
}
/* scroll-spy */
if (navlinks) {
    const anchors = Array.from(navlinks.querySelectorAll('a'));
    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                anchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'skills', 'work', 'certificates', 'journey', 'contact'].forEach(id => {
        const s = document.getElementById(id);
        if (s)
            spy.observe(s);
    });
}
/* smooth scroll + close menu */
function smoothScrollTo(targetPosition, duration = 700) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeProgress = easeOutCubic(progress);

    window.scrollTo(0, startPosition + distance * easeProgress);

    if (timeElapsed < duration) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (nav) nav.classList.remove('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('lock');

    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - (target.id === 'home' ? 0 : 64);
    smoothScrollTo(targetTop, 700);
  });
});
/* PROJECT DATA DICTIONARY FOR MODAL */
const PROJECTS = {
    cartora: {
        num: "01 / Pinned Project",
        title: "Cartora",
        tagline: "Full-Featured Modern E-Commerce Platform",
        image: "sites/Cartora.png",
        live: "https://cartora-client.vercel.app",
        serverApi: "https://cartora-server.vercel.app",
        githubClient: "https://github.com/actuallyayon/cartora-client",
        githubServer: "https://github.com/actuallyayon/cartora-server",
        tech: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS 4", "TanStack React Query 5", "Stripe Elements", "Framer Motion", "Recharts", "Google OAuth", "Vercel"],
        desc: "A full-featured, modern e-commerce platform built for a premium shopping experience — complete with Stripe-powered checkout, real-time notifications, and a full admin dashboard with analytics. Cartora seamlessly connects customer shopping workflows with robust merchant controls.",
        features: [
            "<b>Product Catalog & Details:</b> Browse, search, and filter products with category navigation, image galleries, size charts, and variant selection.",
            "<b>Shopping Cart & Wishlist:</b> Real-time cart totals plus a wishlist to save favorite products for later.",
            "<b>Secure Checkout:</b> Stripe Elements-powered card payments with address management and order tracking.",
            "<b>User Dashboard:</b> Profile management, saved addresses, and full order history.",
            "<b>Admin Analytics Dashboard:</b> Revenue charts, order frequency graphs, and category breakdowns powered by Recharts.",
            "<b>Product & Order Management:</b> Full CRUD for products with image uploads, plus order status updates from processing to delivered.",
            "<b>Real-Time Notifications:</b> Instant alerts when customers complete purchases.",
            "<b>Premium Responsive Design:</b> Dark/light theme toggle, Framer Motion micro-animations, and a mobile-first, fully responsive UI."
        ],
        challenges: [
            "<b>Stripe Webhook Synchronization:</b> Handled Stripe webhook idempotency and state synchronization across Next.js 16 App Router and server routes to prevent double-charging or missed order updates.",
            "<b>Low-Overhead Notifications:</b> Implemented low-latency purchase notifications without heavy WebSocket server memory overhead by tuning polling intervals and server events.",
            "<b>Complex Data Visualization:</b> Formatted revenue and order frequency charts with Recharts to remain fluid and responsive on mobile viewports."
        ],
        future: [
            "<b>Multi-Currency & Tax Engine:</b> Integrate automated international currency conversion with location-based tax calculation.",
            "<b>AI-Driven Recommendations:</b> Implement collaborative filtering to surface personalized product recommendations.",
            "<b>Sub-Millisecond Search:</b> Integrate Algolia or ElasticSearch for ultra-fast fuzzy product search."
        ]
    },
    startupforge: {
        num: "02 / Pinned Project",
        title: "StartupForge",
        tagline: "Founder & Collaborator Ecosystem Platform",
        image: "sites/StartupForge.png",
        live: "https://startupforge-client-nine.vercel.app",
        githubClient: "https://github.com/actuallyayon/startupforge-client",
        githubServer: "https://github.com/actuallyayon/startupforge-server",
        tech: ["Next.js 15 (App Router)", "React 18", "Tailwind CSS", "TanStack Query", "Better Auth", "Stripe", "Axios", "Framer Motion", "Recharts", "Vercel"],
        desc: "A full-stack platform where startup founders can publish their startups, post collaboration opportunities, and build early teams — while collaborators browse opportunities, apply to roles, and track their applications every step of the way.",
        features: [
            "<b>Role-Based Dashboards:</b> Dedicated experiences for founders, collaborators, and admins — each tailored to their specific workflow.",
            "<b>Secure Authentication:</b> Email/password and Google sign-in powered by Better Auth.",
            "<b>Smart Opportunity Discovery:</b> Server-side search, filters, and pagination for browsing startups and open roles.",
            "<b>Founder Toolkit:</b> Create startups, post opportunities, review applications, and upgrade to premium — all in one place.",
            "<b>Stripe-Powered Premium:</b> Seamless checkout flow for founders upgrading their account.",
            "<b>Admin Control Center:</b> Manage users, startup approvals, transactions, and revenue insights with Recharts-powered analytics.",
            "<b>Premium Responsive Design:</b> Dark/light theme toggle, Framer Motion animations, and a fully responsive UI across all devices."
        ],
        challenges: [
            "<b>Role-Based Access Control (RBAC):</b> Structured granular permissions using Better Auth middleware across Founders, Collaborators, and Admins.",
            "<b>Multi-Stage Application State:</b> Managed nested state updates when founders accept, reject, or interview applicants.",
            "<b>Performant Filtering:</b> Optimized server-side search and category filtering for open startup opportunities."
        ],
        future: [
            "<b>In-App Real-Time Messaging:</b> Direct chat and video interview scheduling between founders and applicants.",
            "<b>AI Talent Matching:</b> Automated skill matching algorithms to highlight top candidate fits for open roles.",
            "<b>Co-Founder Vesting Tools:</b> Equity calculator and vesting schedule templates for early teams."
        ]
    },
    habitpilot: {
        num: "03 / Pinned Project",
        title: "HabitPilot",
        tagline: "AI-Driven Adaptive Habit Tracking System",
        image: "sites/HabitPilot.png",
        live: "https://habitpilot-client.vercel.app/",
        githubClient: "https://github.com/actuallyayon/habitpilot-client",
        githubServer: "https://github.com/actuallyayon/habitpilot-server",
        tech: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS 4.0", "TanStack React Query v5", "Express.js", "MongoDB", "Groq Cloud (Llama 3)", "Stripe", "Framer Motion", "Recharts", "Vercel"],
        desc: "An AI-driven, adaptable habit tracking platform where agentic AI models design, analyze, and constantly recalibrate user habit routines based on real-world feedback.",
        features: [
            "<b>AI Onboarding & Plan Generator:</b> Step-by-step questionnaire generates tailor-made habit plans suited to each user's lifestyle.",
            "<b>AI Routine Analyzer:</b> Groq-powered Llama 3 integration designs habit schedules, customizes checklists, and analyzes daily check-ins.",
            "<b>Interactive Dashboard:</b> Log habits, track check-ins, view stats, and get AI-driven suggestions in real time.",
            "<b>Public Habit Explore Feed:</b> A public catalog of pre-generated AI plans users can explore, clone, and customize.",
            "<b>Admin Control Panel:</b> MRR revenue analytics, signup growth graphs (Recharts), and user management with lock/unlock controls.",
            "<b>Subscription Billing:</b> Stripe Sandbox integration for subscription payments and webhook handling.",
            "<b>Secure Authentication:</b> JWT sessions with refresh tokens, Google OAuth, and demo login flows.",
            "<b>Premium Responsive Design:</b> Dark-themed UI with glassmorphic navigation and Framer Motion micro-animations."
        ],
        challenges: [
            "<b>Strict AI JSON Validation:</b> Engineered robust prompt engineering and JSON response validation with Groq Llama 3 to prevent API output syntax errors.",
            "<b>Token Lifecycle Security:</b> Maintained HTTP-only cookie JWT access and refresh token rotation between Next.js client and Express backend.",
            "<b>Timezone Habit Recalibration:</b> Designed resilient streak calculations that accommodate user timezone changes gracefully."
        ],
        future: [
            "<b>Telegram & WhatsApp Bots:</b> Instant daily habit check-ins via instant messaging bots.",
            "<b>Social Accountability Leagues:</b> Community habit challenges with peer support leaderboards.",
            "<b>Voice Reflections:</b> Voice-to-text journaling with sentiment analysis for tracking mental well-being."
        ]
    },
    athenaeum: {
        num: "04 / Project",
        title: "Athenaeum",
        tagline: "Modern Digital Library & Management System",
        image: "sites/Athenaeum.png",
        live: "https://actuallyayon-athenaeum.vercel.app/",
        githubClient: "https://github.com/actuallyayon/athenaeum",
        tech: ["Next.js", "React", "Tailwind CSS", "DaisyUI", "BetterAuth", "MongoDB", "SwiperJS", "Vercel"],
        desc: "A modern digital library where users explore books, filter by category, search by title or author, borrow titles digitally, and manage secure profiles — powered by BetterAuth and MongoDB.",
        features: [
            "<b>Digital Library Catalog:</b> Category filtering, dynamic title/author search, and book previews.",
            "<b>Digital Borrowing System:</b> Manage borrowed books with due date tracking and instant returns.",
            "<b>Secure Authentication:</b> User profile management and session protection via BetterAuth.",
            "<b>Interactive Showcase:</b> Smooth SwiperJS carousels and DaisyUI dark/light theme integration."
        ],
        challenges: [
            "<b>Search Query Aggregations:</b> Optimized MongoDB indexes for sub-50ms title and category search responses.",
            "<b>BetterAuth Custom Schema:</b> Extended BetterAuth session handlers to store custom digital borrowing histories."
        ],
        future: [
            "<b>In-Browser Reader:</b> Integrated PDF & EPUB online reader for direct borrowing experience.",
            "<b>Community Reviews:</b> Rating system and personal reading list bookmarking."
        ]
    }
};
/* MODAL CONTROL */
const modal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
function openModal(key) {
    const p = PROJECTS[key];
    if (!p || !modal)
        return;
    const mImg = document.getElementById('mImg');
    const mBanner = mImg ? mImg.closest('.modal-banner') : null;
    if (mImg && mBanner) {
        mBanner.classList.remove('is-loaded');
        mImg.src = p.image;
        mImg.alt = p.title + ' screenshot';
        if (mImg.complete && mImg.naturalHeight !== 0) {
            mBanner.classList.add('is-loaded');
        }
        else {
            mImg.onload = () => mBanner.classList.add('is-loaded');
            mImg.onerror = () => mBanner.classList.add('is-loaded');
        }
    }
    const mNum = document.getElementById('mNum');
    const mTitle = document.getElementById('mTitle');
    const mTagline = document.getElementById('mTagline');
    const mDesc = document.getElementById('mDesc');
    if (mNum)
        mNum.textContent = p.num;
    if (mTitle)
        mTitle.textContent = p.title;
    if (mTagline)
        mTagline.textContent = p.tagline;
    if (mDesc)
        mDesc.textContent = p.desc;
    // Tech badges
    const mTech = document.getElementById('mTech');
    if (mTech) {
        mTech.innerHTML = p.tech.map(t => `<span class="modal-tech-badge">${t}</span>`).join('');
    }
    // Action buttons
    let actionsHtml = `<a href="${p.live}" target="_blank" rel="noopener" class="btn-p"><span>Visit Live Site</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>`;
    if (p.githubClient) {
        actionsHtml += `<a href="${p.githubClient}" target="_blank" rel="noopener" class="btn-g"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>GitHub (Client)</a>`;
    }
    if (p.githubServer) {
        actionsHtml += `<a href="${p.githubServer}" target="_blank" rel="noopener" class="btn-g"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>GitHub (Server)</a>`;
    }
    const mActions = document.getElementById('mActions');
    if (mActions)
        mActions.innerHTML = actionsHtml;
    // Features list
    const mFeatures = document.getElementById('mFeatures');
    if (mFeatures)
        mFeatures.innerHTML = p.features.map(f => `<li>${f}</li>`).join('');
    // Challenges list
    const mChallenges = document.getElementById('mChallenges');
    if (mChallenges)
        mChallenges.innerHTML = p.challenges.map(c => `<li>${c}</li>`).join('');
    // Future plans list
    const mFuture = document.getElementById('mFuture');
    if (mFuture)
        mFuture.innerHTML = p.future.map(ft => `<li>${ft}</li>`).join('');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
}
function closeModal() {
    if (!modal)
        return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
}
if (modalClose)
    modalClose.addEventListener('click', closeModal);
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal)
            closeModal();
    });
}
addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active'))
        closeModal();
});
// Card click handlers
document.querySelectorAll('.proj[data-proj]').forEach(card => {
    const key = card.dataset.proj;
    if (!key)
        return;
    card.addEventListener('click', (e) => {
        const target = e.target;
        if (!target.closest('a')) {
            openModal(key);
        }
    });
    card.addEventListener('keydown', (e) => {
        const target = e.target;
        if ((e.key === 'Enter' || e.key === ' ') && !target.closest('a')) {
            e.preventDefault();
            openModal(key);
        }
    });
});
/* SKELETON LOADER HANDLER FOR PROJECT CARDS */
document.querySelectorAll('.proj-media img').forEach(img => {
    const container = img.closest('.proj-media');
    if (!container)
        return;
    if (img.complete && img.naturalHeight !== 0) {
        container.classList.add('is-loaded');
    }
    else {
        img.addEventListener('load', () => container.classList.add('is-loaded'));
        img.addEventListener('error', () => container.classList.add('is-loaded'));
    }
});
const yearEl = document.getElementById('year');
if (yearEl)
    yearEl.textContent = String(new Date().getFullYear());
