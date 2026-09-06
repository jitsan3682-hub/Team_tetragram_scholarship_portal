const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../../controllers/userController');
const authenticate = require('../../middlewares/authenticate');

// Intercept files in memory storage to stream directly to Google Drive
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    // Allow images, PDFs, docs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPG/PNG) and PDFs are allowed'));
    }
  },
});

router.get('/profile', authenticate, userController.getProfile);
router.patch('/profile', authenticate, upload.single('profilePicture'), userController.updateProfile);
router.post('/documents', authenticate, upload.single('document'), userController.uploadDocument);

module.exports = router;
