const mongoose = require('mongoose');

const questionAnswerSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  questionHindi: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    textHindi: String,
    isCorrect: Boolean
  }],
  answer: {
    type: String,
    default: true
  },
  answerHindi: {
    type: String,
    default: true
  },
  explanation: String,
  explanationHindi: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  marks: {
    type: Number,
    default: 1
  },
  tags: [String],
  category: String,
  formattedContent: {
    type: String,
    default: ''
  }
}, { _id: true });

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
  // Removed file field
  questions: {
    type: [questionAnswerSchema],
    default: []
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  averageScore: {
    type: Number,
    default: 0
  },
  attempts: {
    type: Number,
    default: 0
  },
  timeLimit: {
    type: Number, // in minutes
    default: 180
  },
  instructions: {
    type: String,
    default: 'Answer all questions. Each question carries marks as indicated.'
  },
  instructionsHindi: {
    type: String,
    default: 'सभी प्रश्नों के उत्तर दें। प्रत्येक प्रश्न के लिए अंक निर्धारित हैं।'
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

pyqSchema.pre('save', function(next) {
  this.totalQuestions = this.questions.length;
  this.totalMarks = this.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Pyq', pyqSchema);