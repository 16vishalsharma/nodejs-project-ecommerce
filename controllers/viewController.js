const User = require('../models/User');
const Url = require('../models/Url');
const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');

// Helper function to render views with layout
const renderView = (res, view, data = {}) => {
  const defaultData = {
    title: 'E-commerce API',
    ...data,
  };
  res.render(view, defaultData);
};

// @desc    Home page
// @route   GET /
// @access  Public
exports.getHome = asyncHandler(async (req, res) => {
  // Get stats
  const userCount = await User.countDocuments();
  const urlCount = await Url.countDocuments();
  const totalClicks = await Url.aggregate([
    { $group: { _id: null, total: { $sum: '$clicks' } } },
  ]);
  
  const stats = {
    users: userCount,
    urls: urlCount,
    clicks: totalClicks[0]?.total || 0,
  };

  renderView(res, 'index', { stats });
});

// @desc    Get all users page
// @route   GET /users
// @access  Private (Authenticated users only)
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select('-password');
  renderView(res, 'users', { users });
});

// @desc    Get create user form
// @route   GET /users/create
// @access  Public
exports.getCreateUser = asyncHandler(async (req, res) => {
  renderView(res, 'user-form', { isEdit: false, user: {} });
});

// @desc    Create user (form submission)
// @route   POST /users
// @access  Public
exports.createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, age, phone, address, isActive } = req.body;

  // Check if user with email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return renderView(res, 'user-form', {
      isEdit: false,
      user: req.body,
      error: 'User with this email already exists',
    });
  }

  // Create user without password (admin-created users can set password later)
  const user = await User.create({
    firstName,
    lastName,
    email,
    age,
    phone,
    address,
    isActive: isActive === 'on',
  });

  res.redirect(`/users/${user._id}`);
});

// @desc    Get user detail page
// @route   GET /users/:id
// @access  Public
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).render('error', {
      title: 'User Not Found',
      error: 'User not found',
    });
  }

  renderView(res, 'user-detail', { user });
});

// @desc    Get edit user form
// @route   GET /users/:id/edit
// @access  Public
exports.getEditUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).render('error', {
      title: 'User Not Found',
      error: 'User not found',
    });
  }

  renderView(res, 'user-form', { isEdit: true, user });
});

// @desc    Update user (form submission)
// @route   PUT /users/:id
// @access  Public
exports.updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, age, phone, address, role, isActive } = req.body;

  // Check if email is being updated and if it already exists
  if (email) {
    const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
    if (existingUser) {
      const user = await User.findById(req.params.id);
      return renderView(res, 'user-form', {
        isEdit: true,
        user: { ...user.toObject(), ...req.body },
        error: 'User with this email already exists',
      });
    }
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName,
      lastName,
      email,
      age,
      phone,
      address,
      role: req.body.role || 'user', // Update role
      isActive: isActive === 'on',
      updatedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return res.status(404).render('error', {
      title: 'User Not Found',
      error: 'User not found',
    });
  }

  res.redirect(`/users/${user._id}`);
});

// @desc    URL Shortener page
// @route   GET /url-shortener
// @access  Public
exports.getUrlShortener = asyncHandler(async (req, res) => {
  const urls = await Url.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('-clickHistory');
  
  renderView(res, 'url-shortener', { urls });
});

// @desc    API Documentation page
// @route   GET /api
// @access  Public
exports.getApiDocs = asyncHandler(async (req, res) => {
  renderView(res, 'api-docs', { title: 'API Documentation' });
});

// @desc    Products page
// @route   GET /products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  
  let query = { status: 'active' };
  let categoryDoc = null;
  
  if (category) {
    // Try to find by slug first, then by name (case-insensitive)
    categoryDoc = await Category.findOne({ 
      $or: [
        { slug: category },
        { slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        { name: { $regex: new RegExp(`^${category}$`, 'i') } }
      ]
    });
    
    if (categoryDoc) {
      query.category = categoryDoc._id;
    } else {
      // If category not found, show all products but with a message
      console.log(`Category not found: ${category}`);
    }
  }

  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(50);

  const categories = await Category.find({ status: 'active' }).sort({ name: 1 });

  renderView(res, 'products', {
    title: 'Products',
    products,
    categories,
    selectedCategory: categoryDoc,
  });
});

// @desc    Dashboard page
// @route   GET /dashboard
// @access  Private
exports.getDashboard = asyncHandler(async (req, res) => {
  // Get stats
  const userCount = await User.countDocuments();
  const urlCount = await Url.countDocuments();
  const totalClicks = await Url.aggregate([
    { $group: { _id: null, total: { $sum: '$clicks' } } },
  ]);
  
  const stats = {
    users: userCount,
    urls: urlCount,
    clicks: totalClicks[0]?.total || 0,
  };

  renderView(res, 'dashboard', {
    title: 'Dashboard',
    userName: req.session.userName,
    userId: req.session.userId,
    stats,
  });
});

