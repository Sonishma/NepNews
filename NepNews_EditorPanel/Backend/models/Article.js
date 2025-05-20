const mongoose = require('mongoose');

// Article schema for 'articles' collection
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  coverImage: { type: String, default: "" },
  additionalImage1: { type: String, default: "" },
  additionalImage2: { type: String, default: "" },
  status: { 
    type: String, 
    enum: ['draft', 'pending', 'approved'], 
    default: 'draft' 
  }
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema, 'articles');

// EditorArticle schema for 'editor_articles' collection
const editorArticleSchema = new mongoose.Schema({
  newsTitle: { type: String, required: true },
  newsDescription: { type: String, required: true },
  categories: { type: [String], default: [] },  // array of categories/tags
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['draft', 'pending', 'approved'], 
    default: 'draft' 
  },
  coverImage: { type: String, default: "" },
  additionalImage1: { type: String, default: "" },
  additionalImage2: { type: String, default: "" }
}, { timestamps: true });

const EditorArticle = mongoose.model('EditorArticle', editorArticleSchema, 'editor_articles');

module.exports = {
  Article,
  EditorArticle
};
