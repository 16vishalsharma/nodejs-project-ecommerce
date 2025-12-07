// Authentication Middleware

// Check if user is authenticated (for views - redirects to login)
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  // Check if it's an API request
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please login first.',
    });
  }
  // Redirect to login for view requests
  res.redirect('/login');
};

// Check if user is not authenticated (for login/signup pages)
exports.isNotAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    // Redirect to dashboard if already logged in
    return res.redirect('/dashboard');
  }
  next();
};

// Get current user (optional middleware to attach user to request)
exports.getCurrentUser = async (req, res, next) => {
  if (req.session && req.session.userId) {
    const User = require('../models/User');
    try {
      const user = await User.findById(req.session.userId).select('-password');
      req.user = user;
    } catch (error) {
      req.user = null;
    }
  }
  next();
};

