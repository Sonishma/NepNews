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
// const editorRoutes = require('./routes/editorRoutes');

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', articleRoutes);
app.use('/api/auth', loginRoutes);
app.use("/uploads", express.static("uploads"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});