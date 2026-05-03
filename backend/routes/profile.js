const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authMiddleware);

router.get('/', profileController.getProfile);

router.post('/upload-image', (req, res, next) => {
  upload.single('profile_image')(req, res, (err) => {
    if (err) {
      console.error('[ProfileRoute] Multer error:', err.message);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Max 5MB.' });
      }
      if (err.message.includes('Invalid file type')) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
    }
    next();
  });
}, profileController.uploadProfileImage);

router.delete('/delete-image', profileController.deleteProfileImage);

module.exports = router;
