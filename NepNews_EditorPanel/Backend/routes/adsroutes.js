const express = require("express");
const multer = require("multer");
const path = require("path");
const Ad = require("../models/ads");

const router = express.Router();

// Configure Multer for storage
const storage = multer.diskStorage({
    destination: "./uploads/",  // Ensure the 'uploads' directory exists
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// File filter to allow only image files (JPEG, PNG, GIF)
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true); // Accept the file
    } else {
        cb(new Error('Only image files (JPEG, PNG, GIF) are allowed!'), false); // Reject the file
    }
};

const upload = multer({
    storage,
    fileFilter, // Use the file filter for validation
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5 MB (optional)
});

// Handle Ad Submission WITH Image Upload
router.post("/upload", upload.single("image"), async (req, res) => {
    console.log("Received image file:", req.file); // Debugging log

    try {
        const { title, websiteLink, position, placementPlan, duration } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Store the file path as URL

        const newAd = new Ad({
            title,
            websiteLink,
            position,
            placementPlan,
            duration: parseInt(duration),
            imageUrl
        });

        await newAd.save();
        res.status(201).json({ message: "Ad successfully uploaded!", ad: newAd });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error saving ad", details: error.message });
    }
});

module.exports = router;
