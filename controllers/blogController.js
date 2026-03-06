const Blog = require('../models/Blog');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getAllBlogs = asyncHandler(async (req, res) => {
  const { status = 'published', limit = 20, page = 1 } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Blog.countDocuments(query);

  const blogs = await Blog.find(query)
    .select('-blogger.password -blogger.salt')
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: blogs.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    data: blogs,
  });
});

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .select('-blogger.password -blogger.salt');

  if (!blog) {
    return res.status(404).json({
      success: false,
      error: 'Blog not found',
    });
  }

  res.status(200).json({
    success: true,
    data: blog,
  });
});

// @desc    Create blog
// @route   POST /api/blogs
// @access  Public
exports.createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create(req.body);

  res.status(201).json({
    success: true,
    data: blog,
  });
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Public
exports.updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      error: 'Blog not found',
    });
  }

  Object.assign(blog, req.body);
  await blog.save();

  res.status(200).json({
    success: true,
    data: blog,
  });
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Public
exports.deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      error: 'Blog not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});
