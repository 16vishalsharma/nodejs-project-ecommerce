const News = require('../models/News');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
exports.getAllNews = asyncHandler(async (req, res) => {
  const { topic, category, search, limit = 50, page = 1 } = req.query;

  const query = {};

  if (topic) {
    query.topic = topic.toLowerCase();
  }

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$text = { $search: search };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await News.countDocuments(query);

  const news = await News.find(query)
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: news.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    data: news,
  });
});

// @desc    Get single news
// @route   GET /api/news/:id
// @access  Public
exports.getNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return res.status(404).json({
      success: false,
      error: 'News not found',
    });
  }

  res.status(200).json({
    success: true,
    data: news,
  });
});

// @desc    Create news
// @route   POST /api/news
// @access  Public
exports.createNews = asyncHandler(async (req, res) => {
  const news = await News.create(req.body);

  res.status(201).json({
    success: true,
    data: news,
  });
});

// @desc    Create multiple news (bulk insert)
// @route   POST /api/news/bulk
// @access  Public
exports.createBulkNews = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Please provide an array of news items in "items" field',
    });
  }

  const news = await News.insertMany(items);

  res.status(201).json({
    success: true,
    count: news.length,
    data: news,
  });
});

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Public
exports.updateNews = asyncHandler(async (req, res) => {
  const news = await News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!news) {
    return res.status(404).json({
      success: false,
      error: 'News not found',
    });
  }

  res.status(200).json({
    success: true,
    data: news,
  });
});

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Public
exports.deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findByIdAndDelete(req.params.id);

  if (!news) {
    return res.status(404).json({
      success: false,
      error: 'News not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get news by topic
// @route   GET /api/news/topic/:topic
// @access  Public
exports.getNewsByTopic = asyncHandler(async (req, res) => {
  const news = await News.find({ topic: req.params.topic.toLowerCase() })
    .sort({ publishedAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    count: news.length,
    topic: req.params.topic,
    data: news,
  });
});

// @desc    Get all available topics with count
// @route   GET /api/news/topics/summary
// @access  Public
exports.getTopicsSummary = asyncHandler(async (req, res) => {
  const summary = await News.aggregate([
    {
      $group: {
        _id: { topic: '$topic', category: '$category' },
        count: { $sum: 1 },
        latestNews: { $first: '$title' },
        lastPublished: { $max: '$publishedAt' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.status(200).json({
    success: true,
    data: summary,
  });
});
