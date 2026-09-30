const Certificate = require('../models/Certificate');

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
const getCertificates = async (req, res) => {
  try {
    const isPublic = req.query.all !== 'true';
    const query = isPublic ? { isVisible: true } : {};
    const certificates = await Certificate.find(query).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new certificate
// @route   POST /api/certificates
// @access  Private
const createCertificate = async (req, res) => {
  try {
    const {
      title,
      num,
      organization,
      dateRange,
      desc,
      coverImage,
      driveLink,
      pdfUrl,
      order,
      isVisible,
    } = req.body;

    if (!title || !organization || !coverImage) {
      return res.status(400).json({ success: false, message: 'Title, organization, and cover image are required' });
    }

    let finalOrder = order;
    if (finalOrder === undefined || finalOrder === null) {
      const count = await Certificate.countDocuments();
      finalOrder = count + 1;
    }

    const certificate = await Certificate.create({
      title,
      num: num || `${String(finalOrder).padStart(2, '0')}`,
      organization,
      dateRange: dateRange || '',
      desc: desc || '',
      coverImage,
      driveLink: driveLink || '',
      pdfUrl: pdfUrl || '',
      order: Number(finalOrder),
      isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Certificate created successfully',
      data: certificate,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private
const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    const {
      title,
      num,
      organization,
      dateRange,
      desc,
      coverImage,
      driveLink,
      pdfUrl,
      order,
      isVisible,
    } = req.body;

    if (title) certificate.title = title;
    if (num !== undefined) certificate.num = num;
    if (organization) certificate.organization = organization;
    if (dateRange !== undefined) certificate.dateRange = dateRange;
    if (desc !== undefined) certificate.desc = desc;
    if (coverImage) certificate.coverImage = coverImage;
    if (driveLink !== undefined) certificate.driveLink = driveLink;
    if (pdfUrl !== undefined) certificate.pdfUrl = pdfUrl;
    if (order !== undefined) certificate.order = Number(order);
    if (isVisible !== undefined) certificate.isVisible = Boolean(isVisible);

    const updated = await certificate.save();

    return res.status(200).json({
      success: true,
      message: 'Certificate updated successfully',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private
const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    await certificate.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};
