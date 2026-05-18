const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
require('dotenv').config();

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'default_secret_key', {
    expiresIn: '24h'
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'lecturer'
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_image: user.profile_image,
        token: generateToken(user.id, user.role)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const profile_image_url = user.profile_image ? `http://localhost:3000${user.profile_image}` : null;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile_image: user.profile_image,
      profile_image_url: profile_image_url,
      token: generateToken(user.id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_image: user.profile_image,
        profile_image_url: user.profile_image ? `http://localhost:3000${user.profile_image}` : null
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Forgot password - generate reset token
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token for database storage
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Set token expiration (1 hour)
    const tokenExpires = new Date(Date.now() + 3600000);

    // Save token to database
    await user.update({
      reset_token: hashedToken,
      reset_token_expires: tokenExpires
    });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password.html?token=${resetToken}`;

    // In production, send email here using nodemailer
    // For development, log the reset URL
    console.log('\n[AUTH] Password reset requested for:', email);
    console.log('[AUTH] Reset URL:', resetUrl);
    console.log('[AUTH] Token expires:', tokenExpires);
    console.log('=========================================\n');

    res.json({ 
      message: 'If this email exists in our system, you will receive a password reset link.' 
    });

  } catch (error) {
    console.error('[AUTH] Forgot password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset password - verify token and update password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash the token to match stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      where: {
        reset_token: hashedToken,
        reset_token_expires: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = newPassword;
    // Clear reset token fields
    user.reset_token = null;
    user.reset_token_expires = null;
    
    await user.save();

    console.log('[AUTH] Password reset successful for:', user.email);

    res.json({ message: 'Password reset successful. You can now login with your new password.' });

  } catch (error) {
    console.error('[AUTH] Reset password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change password - authenticated user changes password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Get user from request (set by auth middleware)
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    console.log('[AUTH] Password changed successfully for:', user.email);

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('[AUTH] Change password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};