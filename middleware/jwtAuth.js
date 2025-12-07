const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header and attaches user to request
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Also check for token in query parameter (for convenience)
  else if (req.query.token) {
    token = req.query.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route. Please provide a valid token.',
    });
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found with this token',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'User account has been deactivated',
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token. Please login again.',
    });
  }
});

/**
 * Optional JWT Authentication Middleware
 * Attaches user if token is valid, but doesn't require it
 */
exports.optional = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (token) {
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }
  }

  next();
});

