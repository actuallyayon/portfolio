const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getFullPortfolio,
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.get('/portfolio', getFullPortfolio);
router.get('/', getProfile);
router.put('/', protect, updateProfile);

module.exports = router;
