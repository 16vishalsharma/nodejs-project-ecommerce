const express = require('express');
const router = express.Router();
const {
  getHome,
  getUsers,
  getCreateUser,
  createUser,
  getUser,
  getEditUser,
  updateUser,
  getUrlShortener,
  getApiDocs,
  getDashboard,
  getProducts,
  getBlogs,
  getCreateBlog,
  createBlog,
  getBlog,
  getEditBlog,
  updateBlog,
  getBloggerLogin,
  bloggerLogin,
  bloggerLogout,
  getNewsPage,
  getNewsDetailPage,
} = require('../controllers/viewController');
const { isAuthenticated, getCurrentUser } = require('../middleware/auth');

// Apply getCurrentUser middleware to all routes to make user available in views
router.use(getCurrentUser);

// Home route (public)
router.get('/', getHome);

// Dashboard route (protected)
router.get('/dashboard', isAuthenticated, getDashboard);

// User view routes (protected - require authentication)
router.get('/users', isAuthenticated, getUsers);
router.get('/users/create', isAuthenticated, getCreateUser);
router.post('/users', isAuthenticated, createUser);
router.get('/users/:id', isAuthenticated, getUser);
router.get('/users/:id/edit', isAuthenticated, getEditUser);
router.put('/users/:id', isAuthenticated, updateUser);

// URL Shortener view route
router.get('/url-shortener', getUrlShortener);

// Products view route
router.get('/products', getProducts);

// API Documentation route
router.get('/api', getApiDocs);

// Blog routes (public)
router.get('/blogs', getBlogs);
router.get('/blogs/create', getCreateBlog);
router.post('/blogs', createBlog);
router.get('/blogs/:id', getBlog);
router.get('/blogs/:id/edit', getEditBlog);
router.put('/blogs/:id', updateBlog);

// Blogger auth routes
router.get('/blogger/login', getBloggerLogin);
router.post('/blogger/login', bloggerLogin);
router.post('/blogger/logout', bloggerLogout);

// News routes (public)
router.get('/news', getNewsPage);
router.get('/news/:id', getNewsDetailPage);

module.exports = router;

