// Load environment variables
require('dotenv').config();

// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');


// Route files
const articleRoutes = require('./routes/articleroutes'); // Make sure the filename matches (articleroutes → articles)
const loginRoutes = require('./routes/loginRoutes');
const adRoutes = require('./routes/adsroutes');

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"], // Add both frontend URLs
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Extend allowed methods for update/delete requests
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));
app.use(express.json()); // for parsing application/json

// Routes
app.use('/api', articleRoutes);       // This loads all article-related routes, including your new move-to-editor route
app.use('/api/auth', loginRoutes);
app.use('/api/ads', adRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Server is running');
});
