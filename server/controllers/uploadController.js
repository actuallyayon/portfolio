const path = require('path');
const fs = require('fs');

// @desc    Upload image to ImgBB
// @route   POST /api/upload/image
// @access  Private
const uploadToImgbb = async (req, res) => {
  try {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'ImgBB API key not configured on server' });
    }

    let base64Image = '';

    if (req.file) {
      base64Image = req.file.buffer.toString('base64');
    } else if (req.body.image) {
      base64Image = req.body.image.replace(/^data:image\/[a-z]+;base64,/, '');
    } else {
      return res.status(400).json({ success: false, message: 'No image file or base64 data provided' });
    }

    const formData = new FormData();
    formData.append('image', base64Image);
    if (req.body.name) {
      formData.append('name', req.body.name);
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({
        success: false,
        message: data.error?.message || 'ImgBB upload failed',
        data,
      });
    }

    return res.status(200).json({
      success: true,
      url: data.data.url,
      display_url: data.data.display_url,
      delete_url: data.data.delete_url,
      thumb: data.data.thumb?.url || data.data.url,
      message: 'Image uploaded successfully to ImgBB',
    });
  } catch (error) {
    console.error('[ImgBB Upload Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload document file (e.g. Resume PDF / Certificate PDF)
// @route   POST /api/upload/file
// @access  Private
const uploadDocumentFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const uploadType = req.body.type || 'general'; // 'resume', 'certificate', 'general'
    let targetDir = path.join(__dirname, '../../uploads');
    let relativeUrlPrefix = '/uploads';

    if (uploadType === 'resume') {
      targetDir = path.join(__dirname, '../../resume');
      relativeUrlPrefix = 'resume';
    } else if (uploadType === 'certificate') {
      targetDir = path.join(__dirname, '../../Certificates');
      relativeUrlPrefix = 'Certificates';
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const cleanOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}_${cleanOriginalName}`;
    const filePath = path.join(targetDir, filename);

    fs.writeFileSync(filePath, req.file.buffer);

    const fileUrl = `${relativeUrlPrefix}/${filename}`;

    return res.status(200).json({
      success: true,
      url: fileUrl,
      filename,
      originalName: req.file.originalname,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('[Document Upload Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadToImgbb,
  uploadDocumentFile,
};
