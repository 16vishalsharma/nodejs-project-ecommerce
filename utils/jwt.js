const jwt = require('jsonwebtoken');

// JWT Secret (should be in .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d'; // 7 days default

/**
 * Generate JWT Token
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT token
 */
exports.generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

/**
 * Verify JWT Token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Decode JWT Token (without verification - for debugging)
 * @param {String} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
exports.decodeToken = (token) => {
  return jwt.decode(token);
};

