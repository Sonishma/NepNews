const mongoose = require('mongoose');

// Define the Article schema
const articleSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,  // Explicitly define the ObjectId
  newsTitle: String,
  newsDescription: String,
  newsStatus: String,  // Pending, Reviewed, Approved
  categories: [String],  // Array for multiple tags
  author: String,
  coverImage: String,  // Optional: String URL path for the main image
  otherImages: [String],  // Array of URLs for additional images
  date: { type: Date, default: Date.now }
});

// Create the Article model for 'editor_articles' collection
const Article = mongoose.model('Article', articleSchema, 'editor_articles'); 
module.exports = Article;