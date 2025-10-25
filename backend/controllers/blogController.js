const Blog = require('../models/Blog');

// Get all blogs
const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const blogs = await Blog.find({ isPublished: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Blog.countDocuments({ isPublished: true });
    
    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    
    if (blog) {
      // Increment view count
      blog.views += 1;
      await blog.save();
      
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new blog
const createBlog = async (req, res) => {
  try {
    const {
      title,
      titleHindi,
      content,
      contentHindi,
      category,
      tags,
      isPublished
    } = req.body;
    
    const blog = new Blog({
      title,
      titleHindi,
      content,
      contentHindi,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: req.user._id,
      isPublished: isPublished || false,
      image: req.file ? req.file.path : '',
    });
    
    const createdBlog = await blog.save();
    await createdBlog.populate('author', 'name');
    
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (blog) {
      blog.title = req.body.title || blog.title;
      blog.titleHindi = req.body.titleHindi || blog.titleHindi;
      blog.content = req.body.content || blog.content;
      blog.contentHindi = req.body.contentHindi || blog.contentHindi;
      blog.category = req.body.category || blog.category;
      blog.tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : blog.tags;
      blog.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : blog.isPublished;
      
      if (req.file) {
        blog.image = req.file.path;
      }
      
      const updatedBlog = await blog.save();
      await updatedBlog.populate('author', 'name');
      
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (blog) {
      await Blog.deleteOne({ _id: req.params.id });
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin blogs
const getAdminBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const blogs = await Blog.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Blog.countDocuments();
    
    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getAdminBlogs,
};