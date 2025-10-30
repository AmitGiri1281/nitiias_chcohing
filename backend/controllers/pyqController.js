const Pyq = require('../models/Pyq');

// Get all PYQs with optional limit
const getPyqs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || null;
    const query = Pyq.find({ isPublished: true }).sort({ year: -1, createdAt: -1 });
    
    if (limit) {
      query.limit(limit);
    }
    
    const pyqs = await query;
    res.json(pyqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get PYQ by ID
const getPyqById = async (req, res) => {
  try {
    const pyq = await Pyq.findById(req.params.id);
    
    if (pyq) {
      // Increment download count
      pyq.downloads += 1;
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
      isPublished
    } = req.body;
    
    const pyq = new Pyq({
      title,
      titleHindi,
      description,
      descriptionHindi,
      exam,
      year,
      subject,
      subjectHindi,
      questions: questions || 0,
      category,
      isPublished: isPublished || false,
      file: req.file ? req.file.path : '',
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
    
    if (pyq) {
      pyq.title = req.body.title || pyq.title;
      pyq.titleHindi = req.body.titleHindi || pyq.titleHindi;
      pyq.description = req.body.description || pyq.description;
      pyq.descriptionHindi = req.body.descriptionHindi || pyq.descriptionHindi;
      pyq.exam = req.body.exam || pyq.exam;
      pyq.year = req.body.year || pyq.year;
      pyq.subject = req.body.subject || pyq.subject;
      pyq.subjectHindi = req.body.subjectHindi || pyq.subjectHindi;
      pyq.questions = req.body.questions || pyq.questions;
      pyq.category = req.body.category || pyq.category;
      pyq.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : pyq.isPublished;
      
      if (req.file) {
        pyq.file = req.file.path;
      }
      
      const updatedPyq = await pyq.save();
      res.json(updatedPyq);
    } else {
      res.status(404).json({ message: 'PYQ not found' });
    }
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
};