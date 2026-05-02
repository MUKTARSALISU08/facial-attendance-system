const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authMiddleware);

router.get('/', profileController.getProfile);

router.post('/upload-image', upload.single('profile_image'), profileController.uploadProfileImage);

router.put('/update', profileController.updateProfile);

router.delete('/delete-image', profileController.deleteProfileImage);

module.exports = router;