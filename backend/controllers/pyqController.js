const Pyq = require('../models/Pyq');




// Get all PYQs
const getPyqs = async (req, res) => {
  try {
    const { limit, category, exam, year, subject, search } = req.query;
    const query = { isPublished: true };

    if (category) query.category = category;
    if (exam) query.exam = exam;
    if (year) query.year = parseInt(year);
    if (subject) query.subject = new RegExp(subject, 'i');

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { titleHindi: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let pyqsQuery = Pyq.find(query)
      .select('-questions')
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


// Get PYQ by ID
const getPyqById = async (req, res) => {
  try {
    const pyq = await Pyq.findById(req.params.id);

    if (!pyq) {
      return res.status(404).json({ message: 'PYQ not found' });
    }

    pyq.views = (pyq.views || 0) + 1;
    await pyq.save();

    res.json(pyq);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create PYQ
const createPyq = async (req, res) => {
  try {
    const {
      title, titleHindi, description, descriptionHindi,
      exam, year, subject, subjectHindi,
      questions, category, isPublished,
      timeLimit, instructions, instructionsHindi, tags
    } = req.body;

    let questionsArray = [];
    if (questions) {
      try {
        questionsArray = JSON.parse(questions);
      } catch {
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
      instructions,
      instructionsHindi,
      tags: tags ? tags.split(',') : []
    });

    const created = await pyq.save();
    res.status(201).json(created);

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

    Object.assign(pyq, req.body);

    if (req.body.questions) {
      pyq.questions = JSON.parse(req.body.questions);
    }

    const updated = await pyq.save();
    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Submit test
const submitTest = async (req, res) => {
  try {
    const { answers } = req.body;
    const pyq = await Pyq.findById(req.params.id);

    if (!pyq) {
      return res.status(404).json({ message: 'PYQ not found' });
    }

    let score = 0;
    let totalMarks = 0;
const results = pyq.questions.map(q => {
  const userAnswer =
    answers[q._id.toString()] !== undefined
      ? Number(answers[q._id.toString()])
      : null;

  const isCorrect =
    userAnswer !== null &&
    q.options?.[userAnswer]?.isCorrect === true;

  const marks = q.marks || 1;
  totalMarks += marks;

  if (isCorrect) score += marks;

  return {
    questionId: q._id,
    questionNumber: q.questionNumber,
    userAnswer,
    correctAnswer: q.options.findIndex(o => o.isCorrect),
    isCorrect,
    marks,
    explanation: q.explanation || ''
  };
});

    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

    // update statistics
  pyq.attempts = (pyq.attempts || 0) + 1;

pyq.averageScore =
  ((pyq.averageScore || 0) * (pyq.attempts - 1) + percentage) /
  pyq.attempts;

    await pyq.save();

    res.json({
      score,
      totalMarks,
      percentage: percentage.toFixed(2),
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
    await Pyq.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Admin list
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

