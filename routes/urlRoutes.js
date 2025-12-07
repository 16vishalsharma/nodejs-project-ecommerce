const express = require('express');
const router = express.Router();
const {
  createShortUrl,
  getUrls,
  getUrl,
  redirectUrl,
  getUrlStats,
  updateUrl,
  deleteUrl,
} = require('../controllers/urlController');

// URL routes
router.route('/')
  .post(createShortUrl)
  .get(getUrls);

router.route('/stats/:shortCode')
  .get(getUrlStats);

router.route('/:id')
  .get(getUrl)
  .patch(updateUrl)
  .delete(deleteUrl);

module.exports = router;

