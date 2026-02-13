const mongoose = require('mongoose');
const crypto = require('crypto');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters'],
  },
  blogger: {
    name: {
      type: String,
      required: [true, 'Blogger name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Blogger email is required'],
      trim: true,
      lowercase: true,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    avatar: {
      type: String,
    },
    website: {
      type: String,
    },
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String,
    },
    password: {
      type: String,
      required: [true, 'Blogger password is required'],
    },
    salt: {
      type: String,
    },
  },
  tags: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  featuredImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  publishedAt: {
    type: Date,
  },
});

blogSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150) + '...';
  }

  // Hash password if it's new or modified
  if (this.isModified('blogger.password') && this.blogger.password) {
    this.blogger.salt = crypto.randomBytes(16).toString('hex');
    this.blogger.password = crypto
      .pbkdf2Sync(this.blogger.password, this.blogger.salt, 1000, 64, 'sha512')
      .toString('hex');
  }

  next();
});

// Method to verify password
blogSchema.methods.verifyPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.blogger.salt, 1000, 64, 'sha512')
    .toString('hex');
  return this.blogger.password === hash;
};

module.exports = mongoose.model('Blog', blogSchema);
