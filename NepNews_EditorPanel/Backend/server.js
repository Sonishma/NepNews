// Load environment variables
require('dotenv').config();

// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

// Route files
const articleRoutes = require('./routes/articleroutes');
const loginRoutes = require('./routes/loginRoutes');
const adRoutes = require('./routes/adsroutes');


// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"], // Add both frontend URLs
  methods: ["GET", "POST"],
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api', articleRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/ads', adRoutes);
app.use("/uploads", express.static("uploads")); // Serve uploaded files


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
