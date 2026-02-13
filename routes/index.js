const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./userRoutes');
const urlRoutes = require('./urlRoutes');
const productRoutes = require('./productRoutes');

// Mount routes
router.use('/users', userRoutes);
router.use('/urls', urlRoutes);
router.use('/products', productRoutes);

// router.use('/categories', categoryRoutes);
// router.use('/orders', orderRoutes);

module.exports = router;

