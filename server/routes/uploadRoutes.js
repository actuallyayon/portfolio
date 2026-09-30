const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadToImgbb, uploadDocumentFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

// Multer in-memory storage for handling buffers
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max
  },
});

router.post('/image', protect, upload.single('image'), uploadToImgbb);
router.post('/file', protect, upload.single('file'), uploadDocumentFile);

module.exports = router;
