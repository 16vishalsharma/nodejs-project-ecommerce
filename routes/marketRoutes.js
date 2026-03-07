const express = require('express');
const router = express.Router();
const {
  getCryptoPrices,
  getMetalPrices,
  getStockPrices,
  getAllMarketData,
  getMarketHistory,
} = require('../controllers/marketController');

router.get('/all', getAllMarketData);
router.get('/history', getMarketHistory);
router.get('/crypto', getCryptoPrices);
router.get('/metals', getMetalPrices);
router.get('/stocks', getStockPrices);

module.exports = router;
