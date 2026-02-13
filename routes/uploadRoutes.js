const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { uploadSingle, uploadMultiple, uploadLarge } = require('../middleware/upload');

// @desc    Upload single file
// @route   POST /upload/single
// @access  Public
router.post('/single', uploadSingle, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded',
    });
  }

  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    workerId: process.pid,
    file: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/${path.basename(path.dirname(req.file.path))}/${req.file.filename}`,
    },
  });
});

// @desc    Upload multiple files
// @route   POST /upload/multiple
// @access  Public
router.post('/multiple', uploadMultiple, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No files uploaded',
    });
  }

  const files = req.files.map((file) => ({
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`,
  }));

  res.status(200).json({
    success: true,
    message: `${files.length} file(s) uploaded successfully`,
    workerId: process.pid,
    files,
  });
});

// @desc    Upload large file (video)
// @route   POST /upload/large
// @access  Public
router.post('/large', uploadLarge, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Large file uploaded successfully',
    workerId: process.pid,
    file: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/${path.basename(path.dirname(req.file.path))}/${req.file.filename}`,
    },
  });
});

// @desc    Get upload page
// @route   GET /upload
// @access  Public
router.get('/', (req, res) => {
  res.render('upload', {
    title: 'File Upload',
    workerId: process.pid,
  });
});

// @desc    List uploaded files
// @route   GET /upload/files
// @access  Public
router.get('/files', (req, res) => {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  const files = [];

  const readDir = (dir, subPath = '') => {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        readDir(fullPath, path.join(subPath, item));
      } else {
        files.push({
          name: item,
          path: `/uploads${subPath ? '/' + subPath : ''}/${item}`,
          size: stat.size,
          uploadedAt: stat.mtime,
        });
      }
    });
  };

  readDir(uploadDir);

  res.status(200).json({
    success: true,
    workerId: process.pid,
    count: files.length,
    files,
  });
});

module.exports = router;
