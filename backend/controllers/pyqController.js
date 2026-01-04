const Pyq = require('../models/Pyq');

// Get all PYQs with optional limit
const getPyqs = async (req, res) => {
  try {
    const { limit, category, exam, year, subject, search } = req.query;
    const query = { isPublished: true };
    
    // Apply filters
    if (category) query.category = category;
    if (exam) query.exam = exam;
    if (year) query.year = parseInt(year);
    if (subject) query.subject = new RegExp(subject, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { titleHindi: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }
    
    let pyqsQuery = Pyq.find(query)
      .select('-questions') // Don't send questions in list view
      .sort({ year: -1, createdAt: -1 });
    
    if (limit) {
      pyqsQuery = pyqsQuery.limit(parseInt(limit));
    }
    
    const pyqs = await pyqsQuery;
    res.json(pyqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get PYQ by ID with questions
const getPyqById = async (req, res) => {
  try {
    const pyq = await Pyq.findById(req.params.id);
    
    if (pyq) {
      // Increment views
      pyq.views += 1;
      await pyq.save();
      
      res.json(pyq);
    } else {
      res.status(404).json({ message: 'PYQ not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new PYQ
const createPyq = async (req, res) => {
  try {
    const {
      title,
      titleHindi,
      description,
      descriptionHindi,
      exam,
      year,
      subject,
      subjectHindi,
      questions,
      category,
      isPublished,
      timeLimit,
      instructions,
      instructionsHindi,
      tags
    } = req.body;
    
    // Parse questions array
    let questionsArray = [];
    if (questions) {
      try {
        questionsArray = JSON.parse(questions);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid questions format' });
      }
    }
    
    const pyq = new Pyq({
      title,
      titleHindi,
      description,
      descriptionHindi,
      exam,
      year: parseInt(year),
      subject,
      subjectHindi,
      questions: questionsArray,
      category,
      isPublished: isPublished || false,
      timeLimit: timeLimit || 180,
      instructions: instructions || 'Answer all questions. Each question carries marks as indicated.',
      instructionsHindi: instructionsHindi || 'सभी प्रश्नों के उत्तर दें। प्रत्येक प्रश्न के लिए अंक निर्धारित हैं।',
      tags: tags ? tags.split(',') : []
    });
    
    const createdPyq = await pyq.save();
    res.status(201).json(createdPyq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update PYQ
const updatePyq = async (req, res) => {
  try {
    const pyq = await Pyq.findById(req.params.id);
    
    if (!pyq) {
      return res.status(404).json({ message: 'PYQ not found' });
    }
    
    // Update basic fields
    pyq.title = req.body.title || pyq.title;
    pyq.titleHindi = req.body.titleHindi || pyq.titleHindi;
    pyq.description = req.body.description || pyq.description;
    pyq.descriptionHindi = req.body.descriptionHindi || pyq.descriptionHindi;
    pyq.exam = req.body.exam || pyq.exam;
    pyq.year = req.body.year ? parseInt(req.body.year) : pyq.year;
    pyq.subject = req.body.subject || pyq.subject;
    pyq.subjectHindi = req.body.subjectHindi || pyq.subjectHindi;
    pyq.category = req.body.category || pyq.category;
    pyq.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : pyq.isPublished;
    pyq.timeLimit = req.body.timeLimit || pyq.timeLimit;
    pyq.instructions = req.body.instructions || pyq.instructions;
    pyq.instructionsHindi = req.body.instructionsHindi || pyq.instructionsHindi;
    pyq.tags = req.body.tags ? req.body.tags.split(',') : pyq.tags;
    
    // Update questions if provided
    if (req.body.questions) {
      try {
        pyq.questions = JSON.parse(req.body.questions);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid questions format' });
      }
    }
    
    const updatedPyq = await pyq.save();
    res.json(updatedPyq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit test and calculate score
const submitTest = async (req, res) => {
  try {
    const { answers } = req.body; // answers: { questionId: selectedOptionIndex }
    const pyq = await Pyq.findById(req.params.id);
    
    if (!pyq) {
      return res.status(404).json({ message: 'PYQ not found' });
    }
    
    let score = 0;
    let totalMarks = 0;
    const results = pyq.questions.map(question => {
      const userAnswer = answers[question._id];
      const isCorrect = userAnswer !== undefined && 
                       question.options[userAnswer]?.isCorrect === true;
      
      const marks = question.marks || 1;
      totalMarks += marks;
      
      if (isCorrect) {
        score += marks;
      }
      
      return {
        questionId: question._id,
        questionNumber: question.questionNumber,
        question: question.question,
        userAnswer: userAnswer !== undefined ? userAnswer : null,
        correctAnswer: question.options.findIndex(opt => opt.isCorrect),
        isCorrect,
        marks,
        explanation: question.explanation
      };
    });
    
    // Update statistics
    pyq.attempts += 1;
    const newAverage = ((pyq.averageScore * (pyq.attempts - 1)) + (score / totalMarks * 100)) / pyq.attempts;
    pyq.averageScore = newAverage;
    await pyq.save();
    
    res.json({
      score,
      totalMarks,
      percentage: (score / totalMarks * 100).toFixed(2),
      results,
      statistics: {
        attempts: pyq.attempts,
        averageScore: pyq.averageScore.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete PYQ
const deletePyq = async (req, res) => {
  try {
    const pyq = await Pyq.findById(req.params.id);
    
    if (pyq) {
      await Pyq.deleteOne({ _id: req.params.id });
      res.json({ message: 'PYQ removed' });
    } else {
      res.status(404).json({ message: 'PYQ not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin PYQs
const getAdminPyqs = async (req, res) => {
  try {
    const pyqs = await Pyq.find().sort({ createdAt: -1 });
    res.json(pyqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPyqs,
  getPyqById,
  createPyq,
  updatePyq,
  deletePyq,
  getAdminPyqs,
  submitTest
};