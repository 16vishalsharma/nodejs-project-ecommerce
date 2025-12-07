const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const { category, status, featured, search } = req.query;
  
  // Build query
  const query = {};
  
  if (category) {
    const categoryDoc = await Category.findOne({ slug: category });
    if (categoryDoc) {
      query.category = categoryDoc._id;
    }
  }
  
  if (status) {
    query.status = status;
  }
  
  if (featured !== undefined) {
    query.featured = featured === 'true';
  }
  
  if (search) {
    query.$text = { $search: search };
  }

  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug description');

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found',
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Get products by category
// @route   GET /api/products/category/:categorySlug
// @access  Public
exports.getProductsByCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.categorySlug });
  
  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Category not found',
    });
  }

  const products = await Product.find({ category: category._id, status: 'active' })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: products.length,
    category: category.name,
    data: products,
  });
});

