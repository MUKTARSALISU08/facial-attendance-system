const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const UPLOAD_DIR = path.join(__dirname, '../uploads/profile-images');

function removePhysicalFile(filePath) {
  if (!filePath) return;
  const normalizedPath = filePath.replace(/^\//, '');
  const absolutePath = path.join(__dirname, '..', normalizedPath);
  if (fs.existsSync(absolutePath)) {
    try {
      fs.unlinkSync(absolutePath);
      console.log('[ProfileController] Deleted file:', absolutePath);
    } catch (err) {
      console.error('[ProfileController] Failed to delete file:', absolutePath, err);
    }
  }
}

exports.uploadProfileImage = async (req, res) => {
  try {
    console.log('\n[ProfileController] === UPLOAD IMAGE START ===');
    console.log('[ProfileController] User ID:', req.user.id);

    if (!req.file) {
      console.log('[ProfileController] ERROR: No file in request');
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    console.log('[ProfileController] File received:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    const user = await User.findByPk(req.user.id);
    if (!user) {
      console.log('[ProfileController] ERROR: User not found');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.profile_image) {
      console.log('[ProfileController] Removing old image:', user.profile_image);
      removePhysicalFile(user.profile_image);
    }

    const relativePath = `/uploads/profile-images/${req.file.filename}`;
    console.log('[ProfileController] Saving to DB:', relativePath);

    await user.update({ profile_image: relativePath });
    console.log('[ProfileController] Database updated successfully');

    const fullUrl = `http://localhost:3000${relativePath}`;
    console.log('[ProfileController] Full URL for frontend:', fullUrl);
    console.log('[ProfileController] === UPLOAD IMAGE END ===\n');

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      profile_image: relativePath,
      profile_image_url: fullUrl
    });

  } catch (error) {
    console.error('[ProfileController] ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.deleteProfileImage = async (req, res) => {
  try {
    console.log('\n[ProfileController] === DELETE IMAGE START ===');
    console.log('[ProfileController] User ID:', req.user.id);

    const user = await User.findByPk(req.user.id);
    if (!user) {
      console.log('[ProfileController] ERROR: User not found');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.profile_image) {
      console.log('[ProfileController] Deleting:', user.profile_image);
      removePhysicalFile(user.profile_image);
      await user.update({ profile_image: null });
      console.log('[ProfileController] Database updated - profile_image set to NULL');
    } else {
      console.log('[ProfileController] No image to delete');
    }

    console.log('[ProfileController] === DELETE IMAGE END ===\n');
    res.json({ success: true, message: 'Profile image removed' });

  } catch (error) {
    console.error('[ProfileController] ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    console.log('\n[ProfileController] === GET PROFILE START ===');
    console.log('[ProfileController] User ID:', req.user.id);

    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'profile_image', 'createdAt']
    });

    if (!user) {
      console.log('[ProfileController] ERROR: User not found');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('[ProfileController] User data:', {
      id: user.id,
      name: user.name,
      profile_image: user.profile_image
    });

    let profile_image_url = null;
    if (user.profile_image) {
      profile_image_url = `http://localhost:3000${user.profile_image}`;
      console.log('[ProfileController] Full image URL:', profile_image_url);
    }

    console.log('[ProfileController] === GET PROFILE END ===\n');
    res.json({
      success: true,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile_image: user.profile_image,
      profile_image_url: profile_image_url,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error('[ProfileController] ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log('\n[ProfileController] === UPDATE PROFILE START ===');
    console.log('[ProfileController] User ID:', req.user.id);

    const { name, email } = req.body;
    console.log('[ProfileController] Update data:', { name, email });

    const user = await User.findByPk(req.user.id);
    if (!user) {
      console.log('[ProfileController] ERROR: User not found');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.update({ name, email });
    console.log('[ProfileController] Profile updated successfully');

    console.log('[ProfileController] === UPDATE PROFILE END ===\n');
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('[ProfileController] ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};