const mongoose = require('mongoose');

// Product Schema for E-commerce
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be a positive number'],
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare at price must be a positive number'],
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required'],
  },
  images: [{
    url: String,
    alt: String,
  }],
  stock: {
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Stock quantity cannot be negative'],
    },
    trackInventory: {
      type: Boolean,
      default: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
  },
  variants: [{
    name: String,
    price: Number,
    sku: String,
    stock: Number,
  }],
  tags: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'archived'],
    default: 'draft',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
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
productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

