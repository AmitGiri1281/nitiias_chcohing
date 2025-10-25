const Course = require('../models/Course');

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new course
const createCourse = async (req, res) => {
  try {
    const {
      title,
      titleHindi,
      description,
      descriptionHindi,
      price,
      duration,
      category,
      features,
      featuresHindi
    } = req.body;
    
    const course = new Course({
      title,
      titleHindi,
      description,
      descriptionHindi,
      price,
      duration,
      category,
      features: features ? features.split(',').map(feature => feature.trim()) : [],
      featuresHindi: featuresHindi ? featuresHindi.split(',').map(feature => feature.trim()) : [],
      image: req.file ? req.file.path : '',
    });
    
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (course) {
      course.title = req.body.title || course.title;
      course.titleHindi = req.body.titleHindi || course.titleHindi;
      course.description = req.body.description || course.description;
      course.descriptionHindi = req.body.descriptionHindi || course.descriptionHindi;
      course.price = req.body.price || course.price;
      course.duration = req.body.duration || course.duration;
      course.category = req.body.category || course.category;
      course.features = req.body.features ? req.body.features.split(',').map(feature => feature.trim()) : course.features;
      course.featuresHindi = req.body.featuresHindi ? req.body.featuresHindi.split(',').map(feature => feature.trim()) : course.featuresHindi;
      course.isActive = req.body.isActive !== undefined ? req.body.isActive : course.isActive;
      
      if (req.file) {
        course.image = req.file.path;
      }
      
      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (course) {
      await Course.deleteOne({ _id: req.params.id });
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Export all controllers
module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
