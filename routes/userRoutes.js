const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  patchUser,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/jwtAuth');

// User API routes (all protected with JWT)
// These routes are mounted at /api/users, so they're API-only
router.route('/')
  .post(protect, createUser)
  .get(protect, getUsers);

router.route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .patch(protect, patchUser)
  .delete(protect, deleteUser);

module.exports = router;

