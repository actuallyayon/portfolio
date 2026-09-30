const path = require('path');
const fs = require('fs');

// @desc    Upload image to ImgBB
// @route   POST /api/upload/image
// @access  Private
const uploadToImgbb = async (req, res) => {
  try {
    let buffer = null;
    let originalName = 'image.png';
    let base64Image = '';

    if (req.file) {
      buffer = req.file.buffer;
      originalName = req.file.originalname || 'image.png';
      base64Image = req.file.buffer.toString('base64');
    } else if (req.body.image) {
      base64Image = req.body.image.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      buffer = Buffer.from(base64Image, 'base64');
      originalName = (req.body.name ? req.body.name.replace(/[^a-zA-Z0-9_-]/g, '_') : 'upload') + '.png';
    } else {
      return res.status(400).json({ success: false, message: 'No image file or base64 data provided' });
    }

    // Prepare local fallback file storage
    const uploadsDir = path.join(__dirname, '../../uploads');
    let localFileUrl = '';

    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const cleanName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filename = `img_${Date.now()}_${cleanName}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);
      localFileUrl = `/uploads/${filename}`;
    } catch (fsErr) {
      console.warn('[Local Save Warning]:', fsErr.message);
      // If serverless read-only filesystem, use data URL as ultimate fallback
      if (!localFileUrl && base64Image) {
        localFileUrl = `data:image/png;base64,${base64Image}`;
      }
    }

    const apiKey = process.env.IMGBB_API_KEY ? process.env.IMGBB_API_KEY.replace(/["']/g, '').trim() : '';

    // If API key is available, try ImgBB upload
    if (apiKey) {
      try {
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

        if (data && data.success && data.data && data.data.url) {
          return res.status(200).json({
            success: true,
            url: data.data.url,
            display_url: data.data.display_url || data.data.url,
            delete_url: data.data.delete_url || '',
            thumb: data.data.thumb?.url || data.data.url,
            message: 'Image uploaded successfully to ImgBB',
          });
        } else {
          console.warn('[ImgBB API Warning]:', data?.error?.message || 'ImgBB rejected upload, falling back to local server storage');
        }
      } catch (imgbbErr) {
        console.warn('[ImgBB Fetch Error]:', imgbbErr.message, '- falling back to local server storage');
      }
    }

    // Fallback: return local storage URL
    if (localFileUrl) {
      return res.status(200).json({
        success: true,
        url: localFileUrl,
        display_url: localFileUrl,
        message: 'Image uploaded successfully to server storage',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to process image upload on both ImgBB and local storage',
    });
  } catch (error) {
    console.error('[Upload Error]:', error);
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
