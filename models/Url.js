const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

// URL Schema for URL Shortener
const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, 'Original URL is required'],
    trim: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL starting with http:// or https://',
    },
  },
  shortCode: {
    type: String,
    unique: true,
    required: true,
    default: () => nanoid(8), // Generate 8-character short code
    index: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  clickHistory: [{
    ipAddress: String,
    userAgent: String,
    referer: String,
    clickedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  expiresAt: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
urlSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  // Generate shortUrl if not provided
  if (!this.shortUrl && this.shortCode) {
    this.shortUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/s/${this.shortCode}`;
  }
  next();
});

// Index for better query performance
urlSchema.index({ shortCode: 1 });
urlSchema.index({ createdAt: -1 });

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;

