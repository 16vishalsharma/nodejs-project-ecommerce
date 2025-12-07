const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { generateToken } = require('../utils/jwt');

// @desc    Show signup page
// @route   GET /signup
// @access  Public
exports.getSignup = asyncHandler(async (req, res) => {
  res.render('signup', { 
    title: 'Sign Up',
    formData: {},
  });
});

// @desc    Handle signup
// @route   POST /signup
// @access  Public
exports.signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, age, phone } = req.body;

  // Check if this is an API request
  const isApiRequest = req.originalUrl.startsWith('/api/') || req.get('Content-Type') === 'application/json';

  // Validation
  if (!firstName || !lastName || !email || !password) {
    if (isApiRequest) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields',
      });
    }
    return res.render('signup', {
      title: 'Sign Up',
      error: 'Please fill in all required fields',
      formData: req.body,
    });
  }

  if (password.length < 6) {
    if (isApiRequest) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }
    return res.render('signup', {
      title: 'Sign Up',
      error: 'Password must be at least 6 characters',
      formData: req.body,
    });
  }

  if (password !== confirmPassword) {
    if (isApiRequest) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match',
      });
    }
    return res.render('signup', {
      title: 'Sign Up',
      error: 'Passwords do not match',
      formData: req.body,
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (isApiRequest) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }
    return res.render('signup', {
      title: 'Sign Up',
      error: 'User with this email already exists',
      formData: req.body,
    });
  }

  // Create user with default role
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    age,
    phone,
    role: 'user', // Default role for new users
  });

  // Generate JWT Token
  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  // Set session (for web views)
  req.session.userId = user._id;
  req.session.userEmail = user.email;
  req.session.userName = `${user.firstName} ${user.lastName}`;
  req.session.userRole = user.role;
  req.session.token = token; // Store token in session for API access

  // If API request, return token; otherwise redirect
  if (isApiRequest) {
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  }

  res.redirect('/dashboard');
});

// @desc    Show login page
// @route   GET /login
// @access  Public
exports.getLogin = asyncHandler(async (req, res) => {
  res.render('login', { 
    title: 'Login',
    formData: {},
  });
});

// @desc    Handle login
// @route   POST /login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if this is an API request
  const isApiRequest = req.originalUrl.startsWith('/api/') || req.get('Content-Type') === 'application/json';

  // Validation
  if (!email || !password) {
    if (isApiRequest) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }
    return res.render('login', {
      title: 'Login',
      error: 'Please provide email and password',
      formData: req.body,
    });
  }

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    if (isApiRequest) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }
    return res.render('login', {
      title: 'Login',
      error: 'Invalid email or password',
      formData: req.body,
    });
  }

  // Check if user is active
  if (!user.isActive) {
    if (isApiRequest) {
      return res.status(401).json({
        success: false,
        error: 'Your account has been deactivated',
      });
    }
    return res.render('login', {
      title: 'Login',
      error: 'Your account has been deactivated',
      formData: req.body,
    });
  }

  // Check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    if (isApiRequest) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }
    return res.render('login', {
      title: 'Login',
      error: 'Invalid email or password',
      formData: req.body,
    });
  }

  // Generate JWT Token
  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role || 'user',
  });

  // Set session (for web views)
  req.session.userId = user._id;
  req.session.userEmail = user.email;
  req.session.userName = `${user.firstName} ${user.lastName}`;
  req.session.userRole = user.role || 'user';
  req.session.token = token; // Store token in session for API access

  // If API request, return token; otherwise redirect
  if (isApiRequest) {
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role || 'user',
      },
    });
  }

  res.redirect('/dashboard');
});

// @desc    Handle logout
// @route   POST /logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  const isApiRequest = req.originalUrl.startsWith('/api/') || req.get('Content-Type') === 'application/json';
  
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    if (isApiRequest) {
      return res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    }
    res.redirect('/login');
  });
});

// @desc    Get current user (JWT)
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');

  res.status(200).json({
    success: true,
    data: user,
  });
});
