const express = require('express');
const router = express.Router();
const {
  getAllNews,
  getNews,
  createNews,
  createBulkNews,
  updateNews,
  deleteNews,
  getNewsByTopic,
  getTopicsSummary,
} = require('../controllers/newsController');

// Topics summary (must be before /:id)
router.get('/topics/summary', getTopicsSummary);

// Topic filter
router.get('/topic/:topic', getNewsByTopic);

// Bulk create
router.post('/bulk', createBulkNews);

// CRUD routes
router.route('/')
  .get(getAllNews)
  .post(createNews);

router.route('/:id')
  .get(getNews)
  .put(updateNews)
  .delete(deleteNews);

module.exports = router;
