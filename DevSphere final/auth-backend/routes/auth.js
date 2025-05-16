// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const nodemailer = require('nodemailer');
// const router = express.Router();

// // Create a transporter for sending emails
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER, // Your email
//         pass: process.env.EMAIL_PASS  // Your email password
//     }
// });
// // Login route
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // 1. Find user by email
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         // 2. Compare passwords
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//         // 3. Create a JWT token (optional, for future use like protected routes)
//         const token = jwt.sign(
//             { userId: user._id },
//             process.env.JWT_SECRET, // Ensure you have JWT_SECRET in .env
//             { expiresIn: '1h' } // Token expires in 1 hour
//         );

//         // 4. Send response with user details (you can include token later if needed)
//         res.status(200).json({
//             message: 'Login successful',
//             user: {
//                 id: user._id,
//                 email: user.email,
//                 name: user.name // Or any other fields you want to send back
//             },
//             token // Only include this if you're using JWT for auth
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;
// Register route
// router.post('/register', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ message: 'User already exists' });

//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create new user
//         const newUser = new User({
//             email,
//             password: hashedPassword
//         });

//         await newUser.save();

//         return res.status(201).json({ message: 'User registered successfully' });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Server error during registration' });
//     }
// });


// module.exports = router;




// Password Reset Request Route
// router.post('/reset-password-request', async (req, res) => {
//     const { email } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Generate password reset token (1 hour expiry)
//         const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         // Send password reset email
//         const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: 'Password Reset Request',
//             html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
//         };

//         transporter.sendMail(mailOptions, (err, info) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Error sending email' });
//             }
//             res.status(200).json({ message: 'Password reset link sent to your email' });
//         });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });




// Reset Password Route
// router.post('/reset-password', async (req, res) => {
//     const { token, newPassword } = req.body;

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Hash new password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         user.password = hashedPassword;

//         await user.save();
//         res.status(200).json({ message: 'Password updated successfully' });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// module.exports = router;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();
router.post('/register', async (req, res) => {
    console.log("Received registration data:", req.body);
    const { name, phone, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            phone,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Add the user profile data (excluding password) in the response
        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                name: newUser.name,
                phone: newUser.phone,
                email: newUser.email,
                _id: newUser._id,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }
        });

    } catch (err) {
        console.error("Error during registration:", err.message);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;




// POST /api/auth/login
router.post('/login', async (req, res) => {
    console.log("Login attempt:", req.body);
    const { email, password } = req.body;

    try {
        // Finds user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Compares password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // (Optional) Create token
        // const token = jwt.sign({ id: user._id }, 'yourSecretKey', { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful' }); 
    } catch (err) {
        console.error("Error during registration:", err);
        return res.status(500).json({ message: 'Server error', error: err.message }); 
    }
    
});

module.exports = router;
// // User registration endpoint
// router.post('/register', async (req, res) => {
//     console.log("Received registration data:", req.body);
//     const { name, phone, email, password } = req.body;

//     try {
//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create new user
//         const newUser = new User({
//             name,
//             phone,
//             email,
//             password: hashedPassword
//         });

//         await newUser.save();

//         return res.status(201).json({ message: 'User registered successfully' });
        
//     } catch (err) {
//         console.error("Error during registration:", err.message);
//         return res.status(500).json({ message: 'Server error', error: err.message });
//     }
// });

// module.exports = router;  // Export the router
// User registration endpoint

