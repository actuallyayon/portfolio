const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');

// @desc    Get profile details
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile details
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      Object.assign(profile, req.body);
    }

    const updated = await profile.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all portfolio aggregated data (Public API for fast site hydration)
// @route   GET /api/portfolio
// @access  Public
const getFullPortfolio = async (req, res) => {
  try {
    const [profile, projects, certificates] = await Promise.all([
      Profile.findOne(),
      Project.find({ isVisible: true }).sort({ order: 1, createdAt: -1 }),
      Certificate.find({ isVisible: true }).sort({ order: 1, createdAt: -1 }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        profile: profile || {},
        projects: projects || [],
        certificates: certificates || [],
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getFullPortfolio,
};
