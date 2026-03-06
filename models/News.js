const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'News title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters'],
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true,
    lowercase: true,
    enum: {
      values: [
        'share-market',
        'stocks',
        'ipo',
        'mutual-funds',
        'crypto',
        'startup',
        'economy',
        'finance',
        'business',
        'technology',
        'world',
        'politics',
        'other',
      ],
      message: '{VALUE} is not a valid topic',
    },
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: {
      values: [
        'Share Market',
        'Stocks',
        'IPO',
        'Mutual Funds',
        'Crypto',
        'Startup',
        'Economy',
        'Finance',
        'Business',
        'Technology',
        'World',
        'Politics',
        'Other',
      ],
      message: '{VALUE} is not a valid category',
    },
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    maxlength: [2000, 'Summary cannot exceed 2000 characters'],
  },
  source: {
    type: String,
    trim: true,
  },
  sourceUrl: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate news by title
newsSchema.index({ title: 1 }, { unique: true });

// Index for fast queries by topic and category
newsSchema.index({ topic: 1, publishedAt: -1 });
newsSchema.index({ category: 1, publishedAt: -1 });
newsSchema.index({ title: 'text', summary: 'text' });

module.exports = mongoose.model('News', newsSchema);
