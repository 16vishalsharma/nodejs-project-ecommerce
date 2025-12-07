const express = require('express');
const router = express.Router();
const {
  getSignup,
  signup,
  getLogin,
  login,
  logout,
  getMe,
} = require('../controllers/authController');
const { isNotAuthenticated, isAuthenticated } = require('../middleware/auth');
const { protect } = require('../middleware/jwtAuth');

// Web routes (views)
router.get('/signup', isNotAuthenticated, getSignup);
router.post('/signup', isNotAuthenticated, signup);
router.get('/login', isNotAuthenticated, getLogin);
router.post('/login', isNotAuthenticated, login);
router.post('/logout', isAuthenticated, logout);

// API routes (JWT)
router.post('/api/auth/signup', signup);
router.post('/api/auth/login', login);
router.post('/api/auth/logout', protect, logout);
router.get('/api/auth/me', protect, getMe);

module.exports = router;

