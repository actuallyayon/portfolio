const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  num: {
    type: String,
    default: '01',
  },
  organization: {
    type: String,
    required: true,
    trim: true,
  },
  dateRange: {
    type: String,
    default: '',
    trim: true,
  },
  desc: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    required: true,
  },
  driveLink: {
    type: String,
    default: '',
  },
  pdfUrl: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Certificate', certificateSchema);
