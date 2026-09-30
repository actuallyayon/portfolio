const Project = require('../models/Project');

// Helper to generate slug from title
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public (or with private query for draft projects)
const getProjects = async (req, res) => {
  try {
    const isPublic = req.query.all !== 'true';
    const query = isPublic ? { isVisible: true } : {};
    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project by slug or ID
// @route   GET /api/projects/:idOrSlug
// @access  Public
const getProject = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let project;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(idOrSlug);
    }
    if (!project) {
      project = await Project.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const {
      title,
      slug,
      num,
      tagline,
      desc,
      image,
      live,
      serverApi,
      githubClient,
      githubServer,
      tech,
      features,
      challenges,
      future,
      isTeamProject,
      isFeatured,
      isVisible,
      order,
    } = req.body;

    if (!title || !desc || !image) {
      return res.status(400).json({ success: false, message: 'Title, description, and image are required' });
    }

    let finalSlug = slug ? slugify(slug) : slugify(title);
    const existing = await Project.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    // Determine default order if not provided
    let finalOrder = order;
    if (finalOrder === undefined || finalOrder === null) {
      const count = await Project.countDocuments();
      finalOrder = count + 1;
    }

    const project = await Project.create({
      title,
      slug: finalSlug,
      num: num || `${String(finalOrder).padStart(2, '0')}`,
      tagline: tagline || '',
      desc,
      image,
      live: live || '',
      serverApi: serverApi || '',
      githubClient: githubClient || '',
      githubServer: githubServer || '',
      tech: Array.isArray(tech) ? tech : (typeof tech === 'string' ? tech.split(',').map(t => t.trim()).filter(Boolean) : []),
      features: Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').map(f => f.trim()).filter(Boolean) : []),
      challenges: Array.isArray(challenges) ? challenges : (typeof challenges === 'string' ? challenges.split('\n').map(c => c.trim()).filter(Boolean) : []),
      future: Array.isArray(future) ? future : (typeof future === 'string' ? future.split('\n').map(f => f.trim()).filter(Boolean) : []),
      isTeamProject: Boolean(isTeamProject),
      isFeatured: Boolean(isFeatured),
      isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
      order: Number(finalOrder),
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    console.error('[Create Project Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const {
      title,
      slug,
      num,
      tagline,
      desc,
      image,
      live,
      serverApi,
      githubClient,
      githubServer,
      tech,
      features,
      challenges,
      future,
      isTeamProject,
      isFeatured,
      isVisible,
      order,
    } = req.body;

    if (title) project.title = title;
    if (slug) project.slug = slugify(slug);
    if (num !== undefined) project.num = num;
    if (tagline !== undefined) project.tagline = tagline;
    if (desc) project.desc = desc;
    if (image) project.image = image;
    if (live !== undefined) project.live = live;
    if (serverApi !== undefined) project.serverApi = serverApi;
    if (githubClient !== undefined) project.githubClient = githubClient;
    if (githubServer !== undefined) project.githubServer = githubServer;
    if (tech !== undefined) {
      project.tech = Array.isArray(tech) ? tech : tech.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (features !== undefined) {
      project.features = Array.isArray(features) ? features : features.split('\n').map(f => f.trim()).filter(Boolean);
    }
    if (challenges !== undefined) {
      project.challenges = Array.isArray(challenges) ? challenges : challenges.split('\n').map(c => c.trim()).filter(Boolean);
    }
    if (future !== undefined) {
      project.future = Array.isArray(future) ? future : future.split('\n').map(f => f.trim()).filter(Boolean);
    }
    if (isTeamProject !== undefined) project.isTeamProject = Boolean(isTeamProject);
    if (isFeatured !== undefined) project.isFeatured = Boolean(isFeatured);
    if (isVisible !== undefined) project.isVisible = Boolean(isVisible);
    if (order !== undefined) project.order = Number(order);

    const updated = await project.save();

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('[Update Project Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reorder projects
// @route   PUT /api/projects/reorder
// @access  Private
const reorderProjects = async (req, res) => {
  try {
    const { items } = req.body; // array of { id, order }
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array is required' });
    }

    const updates = items.map((item) =>
      Project.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updates);

    return res.status(200).json({
      success: true,
      message: 'Projects reordered successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
};
