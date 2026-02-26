const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('profilePicture'), updateUserProfile);

// Password
router.put('/change-password', protect, changePassword);

module.exports = router;