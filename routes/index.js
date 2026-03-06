const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./userRoutes');
const urlRoutes = require('./urlRoutes');
const productRoutes = require('./productRoutes');
const newsRoutes = require('./newsRoutes');
const blogRoutes = require('./blogRoutes');

// Mount routes
router.use('/users', userRoutes);
router.use('/urls', urlRoutes);
router.use('/products', productRoutes);
router.use('/news', newsRoutes);
router.use('/blogs', blogRoutes);

// router.use('/categories', categoryRoutes);
// router.use('/orders', orderRoutes);

module.exports = router;

