const express = require('express');
const router = express.Router();
const { login, getMe, updateCredentials } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update', protect, updateCredentials);

module.exports = router;
