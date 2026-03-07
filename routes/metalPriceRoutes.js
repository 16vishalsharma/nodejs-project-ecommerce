const express = require('express');
const router = express.Router();
const {
  getAllMetalPrices,
  getLatestPrices,
  getMetalPrice,
  createMetalPrice,
  createBulkMetalPrices,
  updateMetalPrice,
  deleteMetalPrice,
} = require('../controllers/metalPriceController');

// Latest prices (must be before /:id)
router.get('/latest', getLatestPrices);

// Bulk create
router.post('/bulk', createBulkMetalPrices);

// CRUD routes
router.route('/')
  .get(getAllMetalPrices)
  .post(createMetalPrice);

router.route('/:id')
  .get(getMetalPrice)
  .put(updateMetalPrice)
  .delete(deleteMetalPrice);

module.exports = router;
