"use strict";

// API Base URL config
const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? ''
  : '';

let authToken = localStorage.getItem('ayon_admin_token') || '';
let currentUser = null;
let portfolioData = {
  profile: {},
  projects: [],
  certificates: [],
};

// DOM Elements
const authSection = document.getElementById('authSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const toastContainer = document.getElementById('toastContainer');
const togglePwdBtn = document.getElementById('togglePwdBtn');
const loginPasswordInput = document.getElementById('loginPassword');

// Nav & Mobile Sidebar
const navItems = document.querySelectorAll('.dash-nav .nav-item');
const tabPanes = document.querySelectorAll('.tab-pane');
const pageTitle = document.getElementById('pageTitle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileSidebarClose = document.getElementById('mobileSidebarClose');
const sidebar = document.getElementById('sidebar');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const refreshBtn = document.getElementById('refreshBtn');

// Modals
const projectFormModal = document.getElementById('projectFormModal');
const certFormModal = document.getElementById('certFormModal');
const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
const cancelProjectModalBtn = document.getElementById('cancelProjectModalBtn');
const closeCertModalBtn = document.getElementById('closeCertModalBtn');
const cancelCertModalBtn = document.getElementById('cancelCertModalBtn');

// Forms
const projectEditorForm = document.getElementById('projectEditorForm');
const certEditorForm = document.getElementById('certEditorForm');
const profileForm = document.getElementById('profileForm');
const securityForm = document.getElementById('securityForm');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  checkAuthAndInit();
});

// Toast Notification Helper
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Check stored JWT authentication on load
async function checkAuthAndInit() {
  if (!authToken) {
    showAuthView();
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    const data = await res.json();

    if (data.success && data.user) {
      currentUser = data.user;
      showDashboardView();
      await loadDashboardData();
    } else {
      localStorage.removeItem('ayon_admin_token');
      authToken = '';
      showAuthView();
    }
  } catch (err) {
    console.error('Auth verification error:', err);
    showAuthView();
  }
}

function showAuthView() {
  authSection.style.display = 'flex';
  dashboardSection.style.display = 'none';
}

function showDashboardView() {
  authSection.style.display = 'none';
  dashboardSection.style.display = 'flex';

  if (currentUser) {
    document.getElementById('sideAdminName').textContent = currentUser.name || 'Admin';
    document.getElementById('sideAdminEmail').textContent = currentUser.email || '';
    document.getElementById('secAdminName').value = currentUser.name || '';
    document.getElementById('secAdminEmail').value = currentUser.email || '';
  }
}

// Fetch all data from API
async function loadDashboardData() {
  try {
    const [portRes, projRes, certRes] = await Promise.all([
      fetch(`${API_BASE}/api/portfolio`),
      fetch(`${API_BASE}/api/projects?all=true`),
      fetch(`${API_BASE}/api/certificates?all=true`),
    ]);

    const portJson = await portRes.json();
    const projJson = await projRes.json();
    const certJson = await certRes.json();

    if (portJson.success && portJson.data) {
      portfolioData.profile = portJson.data.profile || {};
      try {
        localStorage.setItem('ayon_portfolio_cache', JSON.stringify(portJson.data));
      } catch (e) {}
    }
    if (projJson.success) portfolioData.projects = projJson.data || [];
    if (certJson.success) portfolioData.certificates = certJson.data || [];

    renderOverview();
    renderProjectsList();
    renderCertificatesList();
    renderProfileForm();
    renderResumeManager();
  } catch (err) {
    console.error('Failed to load dashboard data:', err);
    showToast('Failed to load portfolio data from server', 'error');
  }
}

// Render Overview Pane
function renderOverview() {
  const projects = portfolioData.projects || [];
  const certs = portfolioData.certificates || [];
  const profile = portfolioData.profile || {};

  document.getElementById('ovTotalProjects').textContent = projects.length;
  document.getElementById('projectCountBadge').textContent = projects.length;
  
  const teamCount = projects.filter(p => p.isTeamProject).length;
  document.getElementById('ovTeamProjects').textContent = `${teamCount} Team Projects`;

  document.getElementById('ovTotalCerts').textContent = certs.length;
  document.getElementById('certCountBadge').textContent = certs.length;

  if (profile.avatarUrl) {
    document.getElementById('sideAvatar').src = profile.avatarUrl;
    document.getElementById('ovPreviewAvatar').src = profile.avatarUrl;
  }
  document.getElementById('ovPreviewName').textContent = profile.name || 'Obaydur Rahman Ayon';
  document.getElementById('ovPreviewTitle').textContent = profile.roleTitle || 'Full Stack Developer';

  if (profile.stats) {
    document.getElementById('ovStatY').textContent = `${profile.stats.yearsCoding || 5} Yrs Coding`;
    document.getElementById('ovStatP').textContent = `${profile.stats.projectsShipped || projects.length} Projects`;
    document.getElementById('ovStatS').textContent = `${profile.stats.coreStacks || 6} Core Stacks`;
  }
}

// Render Projects List
function renderProjectsList() {
  const container = document.getElementById('projectsAdminList');
  const search = document.getElementById('projectSearchInput').value.toLowerCase().trim();
  const filter = document.getElementById('projectTypeFilter').value;

  let projects = portfolioData.projects || [];

  if (filter === 'solo') projects = projects.filter(p => !p.isTeamProject);
  if (filter === 'team') projects = projects.filter(p => p.isTeamProject);

  if (search) {
    projects = projects.filter(p =>
      p.title.toLowerCase().includes(search) ||
      (p.tech && p.tech.some(t => t.toLowerCase().includes(search))) ||
      (p.desc && p.desc.toLowerCase().includes(search))
    );
  }

  if (projects.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-dim);">
        <p>No projects found matching your criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = projects.map(proj => `
    <article class="project-admin-card" data-id="${proj._id}">
      <div class="pac-media">
        <img src="${proj.image || 'sites/Cartora.png'}" alt="${proj.title}" onerror="this.src='sites/Cartora.png'" />
        <span class="pac-badge ${proj.isTeamProject ? 'team' : (proj.isFeatured ? 'flagship' : '')}">
          ${proj.isTeamProject ? 'Team Project' : (proj.isFeatured ? 'Flagship' : 'Individual')}
        </span>
      </div>
      <div class="pac-content">
        <div class="pac-title-row">
          <h3>${proj.title}</h3>
          <small style="color: var(--text-dim); font-family: var(--font-mono);">${proj.num || ''}</small>
        </div>
        <p class="pac-desc">${proj.desc || ''}</p>
        <div class="pac-tech-tags">
          ${(proj.tech || []).slice(0, 4).map(t => `<span>${t}</span>`).join('')}
          ${(proj.tech || []).length > 4 ? `<span>+${(proj.tech || []).length - 4}</span>` : ''}
        </div>
        <div class="pac-footer">
          <div style="display: flex; gap: 8px;">
            ${proj.live ? `<a href="${proj.live}" target="_blank" class="btn-icon-action" title="Visit Live Site"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}
            ${proj.githubClient ? `<a href="${proj.githubClient}" target="_blank" class="btn-icon-action" title="GitHub Repo"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg></a>` : ''}
          </div>
          <div class="pac-actions">
            <button class="btn-icon-action edit-proj-btn" data-id="${proj._id}" title="Edit Project">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-icon-action delete delete-proj-btn" data-id="${proj._id}" data-title="${proj.title}" title="Delete Project">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  // Wire action buttons
  document.querySelectorAll('.edit-proj-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditProjectModal(btn.dataset.id));
  });

  document.querySelectorAll('.delete-proj-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteProject(btn.dataset.id, btn.dataset.title));
  });
}

// Render Certificates List
function renderCertificatesList() {
  const container = document.getElementById('certsAdminList');
  const certs = portfolioData.certificates || [];

  if (certs.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-dim);">
        <p>No certificates found. Click "Add Certificate" to upload one.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = certs.map(cert => `
    <article class="cert-admin-card" data-id="${cert._id}">
      <div class="cac-cover">
        <img src="${cert.coverImage || 'Certificates/programming-hero-certificate-cover.png'}" alt="${cert.title}" onerror="this.src='Certificates/programming-hero-certificate-cover.png'" />
      </div>
      <div class="cac-details">
        <h4>${cert.title}</h4>
        <span class="cac-org">${cert.organization}</span>
        <span class="cac-date">${cert.dateRange || ''}</span>
        <div class="cac-actions">
          ${cert.driveLink ? `<a href="${cert.driveLink}" target="_blank" class="btn-details" style="font-size: 11.5px; padding: 5px 10px;">Visit Link</a>` : ''}
          ${cert.pdfUrl ? `<a href="${cert.pdfUrl}" target="_blank" class="btn-details" style="font-size: 11.5px; padding: 5px 10px;">PDF</a>` : ''}
          <div style="margin-left: auto; display: flex; gap: 6px;">
            <button class="btn-icon-action edit-cert-btn" data-id="${cert._id}" title="Edit Certificate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-icon-action delete delete-cert-btn" data-id="${cert._id}" data-title="${cert.title}" title="Delete Certificate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.edit-cert-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditCertModal(btn.dataset.id));
  });

  document.querySelectorAll('.delete-cert-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteCertificate(btn.dataset.id, btn.dataset.title));
  });
}

// Render Profile Form
function renderProfileForm() {
  const p = portfolioData.profile || {};
  
  if (p.avatarUrl) {
    document.getElementById('profileAvatarPreview').src = p.avatarUrl;
    document.getElementById('avatarUrlManual').value = p.avatarUrl;
  }
  
  document.getElementById('profName').value = p.name || 'Obaydur Rahman Ayon';
  document.getElementById('profRole').value = p.roleTitle || 'Full Stack Developer';
  document.getElementById('heroDesc').value = p.heroDesc || '';
  document.getElementById('availableStatus').value = p.availableStatus || 'Available · Open to Work';
  document.getElementById('locationText').value = p.location || 'Khulna, BD · GMT+6';

  if (p.stats) {
    document.getElementById('statYears').value = p.stats.yearsCoding !== undefined ? p.stats.yearsCoding : 5;
    document.getElementById('statProjects').value = p.stats.projectsShipped !== undefined ? p.stats.projectsShipped : 11;
    document.getElementById('statStacks').value = p.stats.coreStacks !== undefined ? p.stats.coreStacks : 6;
    document.getElementById('statCuriosity').value = p.stats.curiosity || '∞';
  }

  if (Array.isArray(p.aboutParagraphs)) {
    document.getElementById('aboutBioText').value = p.aboutParagraphs.join('\n\n');
  }

  document.getElementById('profEmail').value = p.email || 'actuallyayon@gmail.com';
  document.getElementById('profPhone').value = p.phone || '+880 1327-000697';
  document.getElementById('profWhatsapp').value = p.whatsapp || 'https://wa.me/8801327000697';
  document.getElementById('profGithub').value = p.github || 'https://github.com/actuallyayon';
  document.getElementById('profLinkedin').value = p.linkedin || 'https://linkedin.com/in/ayon-webdev';
}

// Render Resume Manager
function renderResumeManager() {
  const p = portfolioData.profile || {};
  const resumeUrl = p.resumeUrl || 'resume/Resume.pdf?v=20260921';
  document.getElementById('currentResumeDisplay').textContent = resumeUrl;
  document.getElementById('currentResumeTestBtn').href = resumeUrl;
  document.getElementById('manualResumeUrl').value = resumeUrl;
  document.getElementById('ovResumeName').textContent = resumeUrl.split('/').pop() || 'Resume.pdf';
}

// Setup Event Listeners
function setupEventListeners() {
  // Toggle Password
  if (togglePwdBtn && loginPasswordInput) {
    togglePwdBtn.addEventListener('click', () => {
      const type = loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      loginPasswordInput.setAttribute('type', type);
    });
  }

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      loginBtn.querySelector('.btn-text').textContent = 'Signing In...';
      loginBtn.querySelector('.btn-spinner').style.display = 'block';

      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (data.success && data.token) {
          authToken = data.token;
          currentUser = data.user;
          localStorage.setItem('ayon_admin_token', authToken);
          showToast('Login successful! Welcome back Ayon.', 'success');
          showDashboardView();
          await loadDashboardData();
        } else {
          showToast(data.message || 'Invalid email or password', 'error');
        }
      } catch (err) {
        showToast('Login error: ' + err.message, 'error');
      } finally {
        loginBtn.querySelector('.btn-text').textContent = 'Sign In to Dashboard';
        loginBtn.querySelector('.btn-spinner').style.display = 'none';
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('ayon_admin_token');
      authToken = '';
      currentUser = null;
      showToast('Signed out successfully.', 'info');
      showAuthView();
    });
  }

  // Navigation tabs
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabKey = item.dataset.tab;
      navItems.forEach(n => n.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const targetPane = document.getElementById(`pane-${tabKey}`);
      if (targetPane) targetPane.classList.add('active');

      const titleMap = {
        overview: 'Dashboard Overview',
        projects: 'Projects Manager',
        certificates: 'Certificates Manager',
        profile: 'Profile & Photos',
        resume: 'Resume Manager',
        account: 'Security & Auth',
      };
      if (pageTitle) pageTitle.textContent = titleMap[tabKey] || 'Admin Dashboard';

      if (sidebar) sidebar.classList.remove('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Mobile menu open / close
  const openMobileSidebar = () => {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileSidebar = () => {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileSidebar);
  }
  if (mobileSidebarClose) {
    mobileSidebarClose.addEventListener('click', closeMobileSidebar);
  }
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  // Refresh
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.style.transform = 'rotate(360deg)';
      await loadDashboardData();
      showToast('Dashboard data synchronized with MongoDB Atlas', 'success');
      setTimeout(() => refreshBtn.style.transform = '', 400);
    });
  }

  // Quick Action Buttons
  document.getElementById('btnQuickAddProj')?.addEventListener('click', () => openNewProjectModal());
  document.getElementById('btnQuickAddCert')?.addEventListener('click', () => openNewCertModal());
  document.getElementById('btnQuickUploadPhoto')?.addEventListener('click', () => {
    document.querySelector('.nav-item[data-tab="profile"]').click();
    document.getElementById('avatarFileInput').click();
  });
  document.getElementById('btnQuickUploadResume')?.addEventListener('click', () => {
    document.querySelector('.nav-item[data-tab="resume"]').click();
  });

  // Search & Filter
  document.getElementById('projectSearchInput')?.addEventListener('input', renderProjectsList);
  document.getElementById('projectTypeFilter')?.addEventListener('change', renderProjectsList);

  // Modal Openers
  document.getElementById('btnOpenNewProjectModal')?.addEventListener('click', openNewProjectModal);
  document.getElementById('btnOpenNewCertModal')?.addEventListener('click', openNewCertModal);

  // Modal Closers
  closeProjectModalBtn?.addEventListener('click', closeProjectModal);
  cancelProjectModalBtn?.addEventListener('click', closeProjectModal);
  closeCertModalBtn?.addEventListener('click', closeCertModal);
  cancelCertModalBtn?.addEventListener('click', closeCertModal);

  // Profile Avatar Upload via ImgBB
  const avatarFileInput = document.getElementById('avatarFileInput');
  if (avatarFileInput) {
    avatarFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const overlay = document.getElementById('avatarLoadingOverlay');
      if (overlay) overlay.style.display = 'flex';

      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('name', 'profile_ayon');

        const res = await fetch(`${API_BASE}/api/upload/image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` },
          body: formData,
        });

        const data = await res.json();

        if (data.success && data.url) {
          document.getElementById('profileAvatarPreview').src = data.url;
          document.getElementById('avatarUrlManual').value = data.url;
          document.getElementById('sideAvatar').src = data.url;
          document.getElementById('ovPreviewAvatar').src = data.url;

          // Auto-save to profile
          await fetch(`${API_BASE}/api/profile`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ avatarUrl: data.url }),
          });

          if (!portfolioData.profile) portfolioData.profile = {};
          portfolioData.profile.avatarUrl = data.url;
          try {
            localStorage.setItem('ayon_portfolio_cache', JSON.stringify(portfolioData));
          } catch (e) {}

          showToast('Profile photo uploaded and saved live!', 'success');
        } else {
          showToast(data.message || 'ImgBB upload failed', 'error');
        }
      } catch (err) {
        showToast('Image upload failed: ' + err.message, 'error');
      } finally {
        if (overlay) overlay.style.display = 'none';
        avatarFileInput.value = '';
      }
    });
  }

  // Project Image Upload to ImgBB
  const projImageFileInput = document.getElementById('projImageFileInput');
  if (projImageFileInput) {
    projImageFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const spinner = document.getElementById('projImgSpinner');
      if (spinner) spinner.style.display = 'flex';

      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('name', 'project_thumb');

        const res = await fetch(`${API_BASE}/api/upload/image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` },
          body: formData,
        });

        const data = await res.json();

        if (data.success && data.url) {
          document.getElementById('projImagePreview').src = data.url;
          document.getElementById('projImageUrlInput').value = data.url;
          showToast('Project screenshot uploaded to ImgBB!', 'success');
        } else {
          showToast(data.message || 'Upload failed', 'error');
        }
      } catch (err) {
        showToast('Upload error: ' + err.message, 'error');
      } finally {
        if (spinner) spinner.style.display = 'none';
        projImageFileInput.value = '';
      }
    });
  }

  // Cert Image Upload to ImgBB
  const certImageFileInput = document.getElementById('certImageFileInput');
  if (certImageFileInput) {
    certImageFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const spinner = document.getElementById('certImgSpinner');
      if (spinner) spinner.style.display = 'flex';

      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('name', 'certificate_cover');

        const res = await fetch(`${API_BASE}/api/upload/image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` },
          body: formData,
        });

        const data = await res.json();

        if (data.success && data.url) {
          document.getElementById('certImagePreview').src = data.url;
          document.getElementById('certImageUrlInput').value = data.url;
          showToast('Certificate cover uploaded to ImgBB!', 'success');
        } else {
          showToast(data.message || 'Upload failed', 'error');
        }
      } catch (err) {
        showToast('Upload error: ' + err.message, 'error');
      } finally {
        if (spinner) spinner.style.display = 'none';
        certImageFileInput.value = '';
      }
    });
  }

  // Resume Upload (PDF)
  const resumeFileInput = document.getElementById('resumeFileInput');
  if (resumeFileInput) {
    resumeFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      await uploadResumeFile(file);
    });
  }

  // Resume Dropzone Drag & Drop
  const resumeDropzone = document.getElementById('resumeDropzone');
  if (resumeDropzone) {
    ['dragenter', 'dragover'].forEach(name => {
      resumeDropzone.addEventListener(name, (e) => {
        e.preventDefault();
        resumeDropzone.classList.add('drag-over');
      });
    });
    ['dragleave', 'drop'].forEach(name => {
      resumeDropzone.addEventListener(name, (e) => {
        e.preventDefault();
        resumeDropzone.classList.remove('drag-over');
      });
    });
    resumeDropzone.addEventListener('drop', async (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        await uploadResumeFile(files[0]);
      }
    });
  }

  // Manual Resume Link Update
  document.getElementById('saveManualResumeBtn')?.addEventListener('click', async () => {
    const url = document.getElementById('manualResumeUrl').value.trim();
    if (!url) return;

    try {
      const res = await fetch(`${API_BASE}/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeUrl: url }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Resume link updated successfully!', 'success');
        await loadDashboardData();
      }
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    }
  });

  // Project Form Submit (Create / Edit)
  if (projectEditorForm) {
    projectEditorForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('editProjectId').value;
      const saveBtn = document.getElementById('saveProjectBtn');

      const payload = {
        title: document.getElementById('projTitleInput').value.trim(),
        num: document.getElementById('projNumInput').value.trim(),
        tagline: document.getElementById('projTaglineInput').value.trim(),
        order: Number(document.getElementById('projOrderInput').value) || 1,
        isTeamProject: document.getElementById('projIsTeamCheckbox').checked,
        isFeatured: document.getElementById('projIsFeaturedCheckbox').checked,
        image: document.getElementById('projImageUrlInput').value.trim(),
        live: document.getElementById('projLiveInput').value.trim(),
        serverApi: document.getElementById('projServerApiInput').value.trim(),
        githubClient: document.getElementById('projGithubClientInput').value.trim(),
        githubServer: document.getElementById('projGithubServerInput').value.trim(),
        tech: document.getElementById('projTechInput').value.split(',').map(t => t.trim()).filter(Boolean),
        desc: document.getElementById('projDescInput').value.trim(),
        features: document.getElementById('projFeaturesInput').value.split('\n').map(f => f.trim()).filter(Boolean),
        challenges: document.getElementById('projChallengesInput').value.split('\n').map(c => c.trim()).filter(Boolean),
        future: document.getElementById('projFutureInput').value.split('\n').map(f => f.trim()).filter(Boolean),
      };

      saveBtn.querySelector('.btn-text').textContent = 'Saving...';
      saveBtn.querySelector('.btn-spinner').style.display = 'block';

      try {
        const url = id ? `${API_BASE}/api/projects/${id}` : `${API_BASE}/api/projects`;
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.success) {
          showToast(`Project "${payload.title}" saved successfully!`, 'success');
          closeProjectModal();
          await loadDashboardData();
        } else {
          showToast(data.message || 'Failed to save project', 'error');
        }
      } catch (err) {
        showToast('Error: ' + err.message, 'error');
      } finally {
        saveBtn.querySelector('.btn-text').textContent = 'Save Project';
        saveBtn.querySelector('.btn-spinner').style.display = 'none';
      }
    });
  }

  // Certificate Form Submit (Create / Edit)
  if (certEditorForm) {
    certEditorForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('editCertId').value;
      const saveBtn = document.getElementById('saveCertBtn');

      const payload = {
        title: document.getElementById('certTitleInput').value.trim(),
        organization: document.getElementById('certOrgInput').value.trim(),
        dateRange: document.getElementById('certDateInput').value.trim(),
        num: document.getElementById('certNumInput').value.trim(),
        order: Number(document.getElementById('certOrderInput').value) || 1,
        coverImage: document.getElementById('certImageUrlInput').value.trim(),
        driveLink: document.getElementById('certDriveInput').value.trim(),
        pdfUrl: document.getElementById('certPdfInput').value.trim(),
        desc: document.getElementById('certDescInput').value.trim(),
      };

      saveBtn.querySelector('.btn-text').textContent = 'Saving...';
      saveBtn.querySelector('.btn-spinner').style.display = 'block';

      try {
        const url = id ? `${API_BASE}/api/certificates/${id}` : `${API_BASE}/api/certificates`;
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.success) {
          showToast(`Certificate "${payload.title}" saved successfully!`, 'success');
          closeCertModal();
          await loadDashboardData();
        } else {
          showToast(data.message || 'Failed to save certificate', 'error');
        }
      } catch (err) {
        showToast('Error: ' + err.message, 'error');
      } finally {
        saveBtn.querySelector('.btn-text').textContent = 'Save Certificate';
        saveBtn.querySelector('.btn-spinner').style.display = 'none';
      }
    });
  }

  // Profile Form Submit
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById('saveProfileBtn');

      const aboutText = document.getElementById('aboutBioText').value;
      const paragraphs = aboutText.split('\n\n').map(p => p.trim()).filter(Boolean);

      const payload = {
        name: document.getElementById('profName').value.trim(),
        roleTitle: document.getElementById('profRole').value.trim(),
        heroDesc: document.getElementById('heroDesc').value.trim(),
        availableStatus: document.getElementById('availableStatus').value.trim(),
        location: document.getElementById('locationText').value.trim(),
        avatarUrl: document.getElementById('avatarUrlManual').value.trim(),
        aboutParagraphs: paragraphs.length > 0 ? paragraphs : undefined,
        email: document.getElementById('profEmail').value.trim(),
        phone: document.getElementById('profPhone').value.trim(),
        whatsapp: document.getElementById('profWhatsapp').value.trim(),
        github: document.getElementById('profGithub').value.trim(),
        linkedin: document.getElementById('profLinkedin').value.trim(),
        stats: {
          yearsCoding: Number(document.getElementById('statYears').value) || 0,
          projectsShipped: Number(document.getElementById('statProjects').value) || 0,
          coreStacks: Number(document.getElementById('statStacks').value) || 0,
          curiosity: document.getElementById('statCuriosity').value || '∞',
        }
      };

      saveBtn.querySelector('.btn-text').textContent = 'Saving Profile...';
      saveBtn.querySelector('.btn-spinner').style.display = 'block';

      try {
        const res = await fetch(`${API_BASE}/api/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.success) {
          showToast('Profile information saved and live!', 'success');
          await loadDashboardData();
        } else {
          showToast(data.message || 'Failed to update profile', 'error');
        }
      } catch (err) {
        showToast('Error: ' + err.message, 'error');
      } finally {
        saveBtn.querySelector('.btn-text').textContent = 'Save & Update Live Profile';
        saveBtn.querySelector('.btn-spinner').style.display = 'none';
      }
    });
  }

  // Security Form Submit (Update Password)
  if (securityForm) {
    securityForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById('saveSecurityBtn');

      const name = document.getElementById('secAdminName').value.trim();
      const email = document.getElementById('secAdminEmail').value.trim();
      const currentPassword = document.getElementById('secCurrentPassword').value;
      const newPassword = document.getElementById('secNewPassword').value;

      const payload = { name, email };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      saveBtn.querySelector('.btn-text').textContent = 'Updating...';
      saveBtn.querySelector('.btn-spinner').style.display = 'block';

      try {
        const res = await fetch(`${API_BASE}/api/auth/update`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.success) {
          showToast('Credentials updated successfully!', 'success');
          document.getElementById('secCurrentPassword').value = '';
          document.getElementById('secNewPassword').value = '';
          if (data.user) {
            currentUser = data.user;
            showDashboardView();
          }
        } else {
          showToast(data.message || 'Update failed', 'error');
        }
      } catch (err) {
        showToast('Error: ' + err.message, 'error');
      } finally {
        saveBtn.querySelector('.btn-text').textContent = 'Save Security Settings';
        saveBtn.querySelector('.btn-spinner').style.display = 'none';
      }
    });
  }
}

// Upload Resume Helper
async function uploadResumeFile(file) {
  const progress = document.getElementById('resumeUploadProgress');
  if (progress) progress.style.display = 'flex';

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'resume');

    const res = await fetch(`${API_BASE}/api/upload/file`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData,
    });

    const data = await res.json();

    if (data.success && data.url) {
      // Auto save to profile
      await fetch(`${API_BASE}/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeUrl: data.url }),
      });

      showToast(`Resume "${data.originalName}" uploaded & linked!`, 'success');
      await loadDashboardData();
    } else {
      showToast(data.message || 'Resume upload failed', 'error');
    }
  } catch (err) {
    showToast('Upload error: ' + err.message, 'error');
  } finally {
    if (progress) progress.style.display = 'none';
  }
}

// Modal Controllers
function openNewProjectModal() {
  document.getElementById('projectModalTitle').textContent = 'Create New Project';
  document.getElementById('editProjectId').value = '';
  projectEditorForm.reset();
  document.getElementById('projImagePreview').src = 'sites/Cartora.png';
  document.getElementById('projOrderInput').value = (portfolioData.projects?.length || 0) + 1;
  projectFormModal.classList.add('active');
}

function openEditProjectModal(id) {
  const proj = (portfolioData.projects || []).find(p => p._id === id);
  if (!proj) return;

  document.getElementById('projectModalTitle').textContent = `Edit Project: ${proj.title}`;
  document.getElementById('editProjectId').value = proj._id;
  document.getElementById('projTitleInput').value = proj.title || '';
  document.getElementById('projNumInput').value = proj.num || '';
  document.getElementById('projTaglineInput').value = proj.tagline || '';
  document.getElementById('projOrderInput').value = proj.order || 1;
  document.getElementById('projIsTeamCheckbox').checked = Boolean(proj.isTeamProject);
  document.getElementById('projIsFeaturedCheckbox').checked = Boolean(proj.isFeatured);
  document.getElementById('projImageUrlInput').value = proj.image || '';
  document.getElementById('projImagePreview').src = proj.image || 'sites/Cartora.png';
  document.getElementById('projLiveInput').value = proj.live || '';
  document.getElementById('projServerApiInput').value = proj.serverApi || '';
  document.getElementById('projGithubClientInput').value = proj.githubClient || '';
  document.getElementById('projGithubServerInput').value = proj.githubServer || '';
  document.getElementById('projTechInput').value = (proj.tech || []).join(', ');
  document.getElementById('projDescInput').value = proj.desc || '';
  document.getElementById('projFeaturesInput').value = (proj.features || []).join('\n');
  document.getElementById('projChallengesInput').value = (proj.challenges || []).join('\n');
  document.getElementById('projFutureInput').value = (proj.future || []).join('\n');

  projectFormModal.classList.add('active');
}

function closeProjectModal() {
  projectFormModal.classList.remove('active');
}

async function deleteProject(id, title) {
  if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

  try {
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Project "${title}" deleted`, 'info');
      await loadDashboardData();
    } else {
      showToast(data.message || 'Delete failed', 'error');
    }
  } catch (err) {
    showToast('Delete error: ' + err.message, 'error');
  }
}

function openNewCertModal() {
  document.getElementById('certModalTitle').textContent = 'Add Certificate';
  document.getElementById('editCertId').value = '';
  certEditorForm.reset();
  document.getElementById('certImagePreview').src = 'Certificates/programming-hero-certificate-cover.png';
  document.getElementById('certOrderInput').value = (portfolioData.certificates?.length || 0) + 1;
  certFormModal.classList.add('active');
}

function openEditCertModal(id) {
  const cert = (portfolioData.certificates || []).find(c => c._id === id);
  if (!cert) return;

  document.getElementById('certModalTitle').textContent = `Edit Certificate: ${cert.title}`;
  document.getElementById('editCertId').value = cert._id;
  document.getElementById('certTitleInput').value = cert.title || '';
  document.getElementById('certOrgInput').value = cert.organization || '';
  document.getElementById('certDateInput').value = cert.dateRange || '';
  document.getElementById('certNumInput').value = cert.num || '';
  document.getElementById('certOrderInput').value = cert.order || 1;
  document.getElementById('certImageUrlInput').value = cert.coverImage || '';
  document.getElementById('certImagePreview').src = cert.coverImage || 'Certificates/programming-hero-certificate-cover.png';
  document.getElementById('certDriveInput').value = cert.driveLink || '';
  document.getElementById('certPdfInput').value = cert.pdfUrl || '';
  document.getElementById('certDescInput').value = cert.desc || '';

  certFormModal.classList.add('active');
}

function closeCertModal() {
  certFormModal.classList.remove('active');
}

async function deleteCertificate(id, title) {
  if (!confirm(`Are you sure you want to delete certificate "${title}"?`)) return;

  try {
    const res = await fetch(`${API_BASE}/api/certificates/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Certificate "${title}" deleted`, 'info');
      await loadDashboardData();
    } else {
      showToast(data.message || 'Delete failed', 'error');
    }
  } catch (err) {
    showToast('Delete error: ' + err.message, 'error');
  }
}
