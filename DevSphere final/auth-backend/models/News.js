// models/News.js
const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  newsTitle: String,
  newsDescription: String,
  categories: [String],
  author: String,
  date: Date,
  status: String,
}, { collection: 'editor_articles' }); 

module.exports = mongoose.model('News', NewsSchema);
