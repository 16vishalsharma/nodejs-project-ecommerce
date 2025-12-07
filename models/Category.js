const mongoose = require('mongoose');

// Category Schema for E-commerce
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true,
  },
  description: {
    type: String,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  image: {
    url: String,
    alt: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  seo: {
    title: String,
    description: String,
    keywords: [String],
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
categorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  // Auto-generate slug from name if not provided
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for better search performance (slug already has unique index)
categorySchema.index({ parentCategory: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

