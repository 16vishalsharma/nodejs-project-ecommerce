const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

// CRUD routes
router.route('/')
  .get(getAllBlogs)
  .post(createBlog);

router.route('/:id')
  .get(getBlog)
  .put(updateBlog)
  .delete(deleteBlog);

module.exports = router;
