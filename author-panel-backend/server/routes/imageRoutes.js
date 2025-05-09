const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST api/images/upload
// @desc    Upload an image
// @access  Private
router.post('/upload', auth, upload.single('image'), imageController.uploadImage);

module.exports = router;