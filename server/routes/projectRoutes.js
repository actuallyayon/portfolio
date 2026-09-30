const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.get('/', getProjects);
router.put('/reorder', protect, reorderProjects);
router.get('/:idOrSlug', getProject);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
