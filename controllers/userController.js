const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a new user
// @route   POST /api/users
// @access  Private (Authenticated users only)
exports.createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, age, phone, address, isActive } = req.body;

  // Check if user with email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User with this email already exists',
    });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    age,
    phone,
    address,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Authenticated users only)
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private (Authenticated users only)
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user by ID (Full update)
// @route   PUT /api/users/:id
// @access  Private (Authenticated users only)
exports.updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, age, phone, address, isActive } = req.body;

  // Check if email is being updated and if it already exists
  if (email) {
    const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName,
      lastName,
      email,
      age,
      phone,
      address,
      isActive,
      updatedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

// @desc    Partially update user by ID
// @route   PATCH /api/users/:id
// @access  Private (Authenticated users only)
exports.patchUser = asyncHandler(async (req, res) => {
  const updates = req.body;
  updates.updatedAt = Date.now();

  // Check if email is being updated and if it already exists
  if (updates.email) {
    const existingUser = await User.findOne({ email: updates.email, _id: { $ne: req.params.id } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Private (Authenticated users only)
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: user,
  });
});

