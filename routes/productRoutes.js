const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getProductsByCategory,
} = require('../controllers/productController');

// Product routes
router.get('/', getProducts);
router.get('/category/:categorySlug', getProductsByCategory);
router.get('/:id', getProduct);

module.exports = router;

