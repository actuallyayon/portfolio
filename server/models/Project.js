const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  num: {
    type: String,
    default: '01',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  tagline: {
    type: String,
    default: '',
    trim: true,
  },
  desc: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  live: {
    type: String,
    default: '',
  },
  serverApi: {
    type: String,
    default: '',
  },
  githubClient: {
    type: String,
    default: '',
  },
  githubServer: {
    type: String,
    default: '',
  },
  tech: {
    type: [String],
    default: [],
  },
  features: {
    type: [String],
    default: [],
  },
  challenges: {
    type: [String],
    default: [],
  },
  future: {
    type: [String],
    default: [],
  },
  isTeamProject: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
