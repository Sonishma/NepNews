const mongoose = require('mongoose');

// Define the Article schema
const articleSchema = new mongoose.Schema({
  newsTitle: String,
  newsDescription: String,
  status: { type: String, enum: ['Pending', 'Reviewed', 'Approved'] }, // Added enum for status values
  categories: [String],  // Array for multiple tags
  author: String,
  // coverImage: String,  // Optional: String URL path for the main image
  // otherImages: [String],  // Array of URLs for additional images
  date: { type: Date, default: Date.now }
});

// Create the Article model for 'editor_articles' collection
const Article = mongoose.model('Article', articleSchema, 'editor_articles');
module.exports = Article;

