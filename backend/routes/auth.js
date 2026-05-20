const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user profile (protected route)
router.get('/profile', authMiddleware, authController.getProfile);

// Forgot password - request password reset
router.post('/forgot-password', authController.forgotPassword);

// Reset password - update password with token
router.post('/reset-password', authController.resetPassword);

// Change password - authenticated user changes password
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;