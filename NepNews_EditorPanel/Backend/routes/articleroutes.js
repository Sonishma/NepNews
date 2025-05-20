const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Article, EditorArticle } = require('../models/Article.js');
const { Types: { ObjectId } } = mongoose;
const sanitizeHtml = require('sanitize-html');

// GET all articles from 'articles' collection with pagination
router.get('/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const articles = await Article.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET article by ID from 'articles'
router.get('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid article ID format' });
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    console.error('Error finding article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE new article in 'articles' collection
router.post('/articles', async (req, res) => {
  try {
    const { title, content, category, coverImage, additionalImage1, additionalImage2, status } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const validStatuses = ['draft', 'pending', 'approved', 'review'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const newArticle = new Article({
      title,
      content,
      category,
      coverImage: coverImage || "",
      additionalImage1: additionalImage1 || "",
      additionalImage2: additionalImage2 || "",
      status: status || 'draft'
    });

    await newArticle.save();
    res.status(201).json({ message: 'Article created successfully', article: newArticle });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE article content in 'articles'
router.put('/articles/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, category, coverImage, additionalImage1, additionalImage2 } = req.body;

  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid article ID' });
  if (!title || !content || !category) return res.status(400).json({ message: 'Missing required fields' });

  const sanitizedTitle = sanitizeHtml(title, { allowedTags: [] });
  const sanitizedContent = sanitizeHtml(content, { allowedTags: [] });

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        title: sanitizedTitle,
        content: sanitizedContent,
        category,
        coverImage: coverImage || "",
        additionalImage1: additionalImage1 || "",
        additionalImage2: additionalImage2 || ""
      },
      { new: true }
    );

    if (!updatedArticle) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article updated successfully', article: updatedArticle });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE article status in 'articles'
router.put('/articles/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid article ID' });

  const validStatuses = ['draft', 'pending', 'approved', 'review'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid or missing status' });
  }

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedArticle) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Status updated successfully', article: updatedArticle });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH approve article in 'articles'
router.patch('/articles/:id/approve', async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid article ID' });

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );
    if (!updatedArticle) return res.status(404).json({ message: 'Article not found' });
    res.json(updatedArticle);
  } catch (error) {
    console.error('Error approving article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// NEW ROUTE: Move an article from 'articles' to 'editor_articles'
router.post('/articles/:id/move-to-editor', async (req, res) => {
  try {
    const articleId = req.params.id;
    const { author } = req.body;

    if (!author) {
      return res.status(400).json({ message: 'Author is required' });
    }

    if (!ObjectId.isValid(articleId)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }

    // Find article in 'articles' collection
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found in articles collection' });
    }

    // Create editor article with mapped fields & status adjustment
    const editorArticle = new EditorArticle({
      newsTitle: article.title,
      newsDescription: article.content,
      categories: [article.category],  // Convert single string category to array
      author,
      date: article.createdAt || new Date(),
      status: article.status === 'review' ? 'Pending' : article.status.charAt(0).toUpperCase() + article.status.slice(1),
      coverImage: article.coverImage || "",
      additionalImage1: article.additionalImage1 || "",
      additionalImage2: article.additionalImage2 || ""
    });

    await editorArticle.save();

    res.status(201).json({ message: 'Article moved to editor_articles successfully', editorArticle });
  } catch (error) {
    console.error('Error moving article to editor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
