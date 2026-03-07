const mongoose = require('mongoose');

const cryptoPriceSchema = new mongoose.Schema({
  id: String,
  symbol: String,
  name: String,
  image: String,
  current_price_inr: Number,
  market_cap: Number,
  market_cap_rank: Number,
  total_volume: Number,
  price_change_24h: Number,
  price_change_percentage_24h: Number,
  price_change_percentage_7d: Number,
  high_24h: Number,
  low_24h: Number,
  last_updated: String,
}, { _id: false });

const goldSchema = new mongoose.Schema({
  name: String,
  price_inr_per_oz: Number,
  price_inr_per_gram: Number,
  price_inr_per_10gram: Number,
  price_change_percentage_24h: Number,
  price_change_24h: Number,
  high_24h: Number,
  low_24h: Number,
  image: String,
}, { _id: false });

const silverSchema = new mongoose.Schema({
  name: String,
  price_inr_per_gram: Number,
  price_inr_per_kg: Number,
}, { _id: false });

const stockPriceSchema = new mongoose.Schema({
  symbol: String,
  name: String,
  type: { type: String, enum: ['index', 'stock'] },
  currency: String,
  current_price: Number,
  previous_close: Number,
  change: Number,
  change_percent: Number,
  day_high: Number,
  day_low: Number,
  volume: Number,
  last_updated: String,
}, { _id: false });

const marketDataSchema = new mongoose.Schema({
  crypto: [cryptoPriceSchema],
  metals: {
    gold: goldSchema,
    silver: silverSchema,
    source: String,
    last_updated: String,
  },
  stocks: [stockPriceSchema],
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
});

marketDataSchema.index({ fetchedAt: -1 });

module.exports = mongoose.model('MarketData', marketDataSchema, 'market_data');
