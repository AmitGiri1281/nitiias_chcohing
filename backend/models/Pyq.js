const mongoose = require('mongoose');

const pyqSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleHindi: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  descriptionHindi: {
    type: String,
    required: true,
  },
  exam: {
    type: String,
    required: true,
    enum: ['UPSC', 'State PCS', 'IAS', 'Other'],
  },
  year: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  subjectHindi: {
    type: String,
    required: true,
  },
  file: {
    type: String, // PDF file path
    required: true,
  },
  questions: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
  },
  downloads: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Pyq', pyqSchema);