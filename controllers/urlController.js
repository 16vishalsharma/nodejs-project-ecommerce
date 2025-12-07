const Url = require('../models/Url');
const asyncHandler = require('../middleware/asyncHandler');
const { nanoid } = require('nanoid');

// @desc    Create a short URL
// @route   POST /api/urls
// @access  Public
exports.createShortUrl = asyncHandler(async (req, res) => {
  const { originalUrl, customCode, expiresInDays } = req.body;

  // Validate URL format
  if (!originalUrl || !/^https?:\/\/.+/.test(originalUrl)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid URL starting with http:// or https://',
    });
  }

  // Check if custom code is provided and if it already exists
  let shortCode;
  if (customCode) {
    const existingUrl = await Url.findOne({ shortCode: customCode });
    if (existingUrl) {
      return res.status(400).json({
        success: false,
        error: 'Custom code already exists. Please choose a different one.',
      });
    }
    shortCode = customCode;
  } else {
    // Generate unique short code
    let isUnique = false;
    while (!isUnique) {
      shortCode = nanoid(8);
      const existingUrl = await Url.findOne({ shortCode });
      if (!existingUrl) {
        isUnique = true;
      }
    }
  }

  // Calculate expiration date if provided
  let expiresAt = null;
  if (expiresInDays) {
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));
  }

  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const shortUrl = `${baseUrl}/s/${shortCode}`;

  const url = await Url.create({
    originalUrl,
    shortCode,
    shortUrl,
    expiresAt,
    createdBy: req.user ? req.user.id : null,
  });

  res.status(201).json({
    success: true,
    message: 'URL shortened successfully',
    data: url,
  });
});

// @desc    Get all shortened URLs
// @route   GET /api/urls
// @access  Public
exports.getUrls = asyncHandler(async (req, res) => {
  const urls = await Url.find()
    .sort({ createdAt: -1 })
    .populate('createdBy', 'firstName lastName email')
    .select('-clickHistory');

  res.status(200).json({
    success: true,
    count: urls.length,
    data: urls,
  });
});

// @desc    Get single shortened URL by ID
// @route   GET /api/urls/:id
// @access  Public
exports.getUrl = asyncHandler(async (req, res) => {
  const url = await Url.findById(req.params.id)
    .populate('createdBy', 'firstName lastName email');

  if (!url) {
    return res.status(404).json({
      success: false,
      error: 'URL not found',
    });
  }

  res.status(200).json({
    success: true,
    data: url,
  });
});

// @desc    Redirect to original URL
// @route   GET /s/:shortCode
// @access  Public
exports.redirectUrl = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;

  const url = await Url.findOne({ shortCode, isActive: true });

  if (!url) {
    return res.status(404).json({
      success: false,
      error: 'Short URL not found or has been deactivated',
    });
  }

  // Check if URL has expired
  if (url.expiresAt && new Date() > url.expiresAt) {
    return res.status(410).json({
      success: false,
      error: 'This short URL has expired',
    });
  }

  // Track click
  url.clicks += 1;
  url.clickHistory.push({
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    referer: req.get('referer'),
  });
  await url.save();

  // Redirect to original URL
  res.redirect(url.originalUrl);
});

// @desc    Get URL statistics by short code
// @route   GET /api/urls/stats/:shortCode
// @access  Public
exports.getUrlStats = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;

  const url = await Url.findOne({ shortCode })
    .populate('createdBy', 'firstName lastName email');

  if (!url) {
    return res.status(404).json({
      success: false,
      error: 'URL not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      clickHistory: url.clickHistory,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      isActive: url.isActive,
    },
  });
});

// @desc    Update URL (deactivate/reactivate)
// @route   PATCH /api/urls/:id
// @access  Public
exports.updateUrl = asyncHandler(async (req, res) => {
  const { isActive, expiresInDays } = req.body;

  const updateData = {};
  if (isActive !== undefined) {
    updateData.isActive = isActive;
  }
  if (expiresInDays !== undefined) {
    if (expiresInDays === null) {
      updateData.expiresAt = null;
    } else {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));
      updateData.expiresAt = expiresAt;
    }
  }

  const url = await Url.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!url) {
    return res.status(404).json({
      success: false,
      error: 'URL not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'URL updated successfully',
    data: url,
  });
});

// @desc    Delete URL
// @route   DELETE /api/urls/:id
// @access  Public
exports.deleteUrl = asyncHandler(async (req, res) => {
  const url = await Url.findByIdAndDelete(req.params.id);

  if (!url) {
    return res.status(404).json({
      success: false,
      error: 'URL not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'URL deleted successfully',
    data: url,
  });
});

