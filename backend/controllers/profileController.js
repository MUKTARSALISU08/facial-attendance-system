const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const removePhysicalFile = (filePath) => {
  if (!filePath) return;
  const normalizedPath = filePath.replace(/^\//, '');
  const absolutePath = path.join(__dirname, '..', normalizedPath);

  if (fs.existsSync(absolutePath)) {
    try {
      fs.unlinkSync(absolutePath);
    } catch (err) {
      console.error('Failed to delete file:', absolutePath, err);
    }
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    console.log('=== Profile Image Upload Request ===');
    console.log('User ID:', req.user?.id);
    console.log('Has file:', !!req.file);
    console.log('File:', req.file ? req.file.filename : 'No file');
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.profile_image) {
      removePhysicalFile(user.profile_image);
    }

    const profileImagePath = `/uploads/profile-images/${req.file.filename}`;

    await user.update({ profile_image: profileImagePath });

    res.json({
      message: 'Profile image uploaded successfully',
      profile_image: profileImagePath
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'profile_image', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile_image: user.profile_image,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    await user.update({
      name: name || user.name,
      email: email || user.email
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_image: user.profile_image
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.profile_image) {
      removePhysicalFile(user.profile_image);
    }

    await user.update({ profile_image: null });

    res.json({ message: 'Profile image deleted successfully' });
  } catch (error) {
    console.error('Delete profile image error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};