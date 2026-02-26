const Blog = require('../models/Blog');
const Notification = require('../models/Notification');

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

// Create blog
const createBlog = async (req, res) => {
  try {
    const { title, titleHindi, content, contentHindi, category, tags, isPublished } = req.body;

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

    if (createdBlog.isPublished) {
      const notification = await Notification.create({
        title: "New Blog Published",
        message: `${createdBlog.title} is now live`,
        type: "blog"
      });

      const io = req.app.get('io');
      io.emit('newNotification', notification);
    }

    res.status(201).json(createdBlog);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const wasPublished = blog.isPublished;

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.isPublished =
      req.body.isPublished !== undefined ? req.body.isPublished : blog.isPublished;

    const updatedBlog = await blog.save();

    if (!wasPublished && updatedBlog.isPublished) {
      const notification = await Notification.create({
        title: "New Blog Published",
        message: `${updatedBlog.title} is now live`,
        type: "blog",
      });

      const io = req.app.get("io");
      io.emit("newNotification", notification);
    }

    res.json(updatedBlog);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE BLOG (outside)
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADMIN BLOGS (outside)
const getAdminBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(blogs);

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