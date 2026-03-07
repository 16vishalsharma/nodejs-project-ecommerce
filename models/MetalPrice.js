const mongoose = require('mongoose');

const metalPriceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required'],
    unique: true,
  },
  gold_usd_per_oz: Number,
  gold_inr_per_gram: Number,
  gold_inr_per_10gram: Number,
  silver_usd_per_oz: Number,
  silver_inr_per_gram: Number,
  silver_inr_per_kg: Number,
  platinum_usd_per_oz: Number,
  palladium_usd_per_oz: Number,
  bitcoin_usd: Number,
  bitcoin_inr: Number,
  ethereum_usd: Number,
  ethereum_inr: Number,
  usd_to_inr_rate: Number,
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    trim: true,
  },
});

metalPriceSchema.index({ date: -1 });

module.exports = mongoose.model('MetalPrice', metalPriceSchema, 'metal_prices');
