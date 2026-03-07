const MetalPrice = require('../models/MetalPrice');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all metal prices
// @route   GET /api/metal-prices
// @access  Public
exports.getAllMetalPrices = asyncHandler(async (req, res) => {
  const { limit = 50, page = 1 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await MetalPrice.countDocuments();

  const prices = await MetalPrice.find()
    .sort({ date: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: prices.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    data: prices,
  });
});

// @desc    Get latest metal prices
// @route   GET /api/metal-prices/latest
// @access  Public
exports.getLatestPrices = asyncHandler(async (req, res) => {
  const price = await MetalPrice.findOne().sort({ date: -1 });

  if (!price) {
    return res.status(404).json({
      success: false,
      error: 'No metal price data found',
    });
  }

  res.status(200).json({
    success: true,
    data: price,
  });
});

// @desc    Get single metal price by ID
// @route   GET /api/metal-prices/:id
// @access  Public
exports.getMetalPrice = asyncHandler(async (req, res) => {
  const price = await MetalPrice.findById(req.params.id);

  if (!price) {
    return res.status(404).json({
      success: false,
      error: 'Metal price not found',
    });
  }

  res.status(200).json({
    success: true,
    data: price,
  });
});

// @desc    Create metal price
// @route   POST /api/metal-prices
// @access  Public
exports.createMetalPrice = asyncHandler(async (req, res) => {
  const price = await MetalPrice.create(req.body);

  res.status(201).json({
    success: true,
    data: price,
  });
});

// @desc    Create multiple metal prices (bulk insert)
// @route   POST /api/metal-prices/bulk
// @access  Public
exports.createBulkMetalPrices = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Please provide an array of metal price items in "items" field',
    });
  }

  const prices = await MetalPrice.insertMany(items, { ordered: false }).catch((err) => {
    if (err.insertedDocs) return err.insertedDocs;
    throw err;
  });

  res.status(201).json({
    success: true,
    count: prices.length,
    data: prices,
  });
});

// @desc    Update metal price
// @route   PUT /api/metal-prices/:id
// @access  Public
exports.updateMetalPrice = asyncHandler(async (req, res) => {
  const price = await MetalPrice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!price) {
    return res.status(404).json({
      success: false,
      error: 'Metal price not found',
    });
  }

  res.status(200).json({
    success: true,
    data: price,
  });
});

// @desc    Delete metal price
// @route   DELETE /api/metal-prices/:id
// @access  Public
exports.deleteMetalPrice = asyncHandler(async (req, res) => {
  const price = await MetalPrice.findByIdAndDelete(req.params.id);

  if (!price) {
    return res.status(404).json({
      success: false,
      error: 'Metal price not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});
