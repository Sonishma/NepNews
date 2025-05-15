const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = require('../models/Article.js');
const { Types: { ObjectId } } = mongoose;
const sanitizeHtml = require('sanitize-html'); // If you want to sanitize HTML tags

// GET all articles with pagination
router.get('/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const articles = await Article.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET article by ID
router.get('/articles/:id', async (req, res) => {
  console.log(`Received request for article ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      console.log(`Invalid ID format: ${id}`);
      return res.status(400).json({ error: 'Invalid article ID format' });
    }

    const article = await Article.findById(id);
    console.log(`Article found: ${article !== null}`);

    if (!article) {
      return res.status(404).json({ error: `Article with ID ${id} not found` });
    }

    return res.json(article);
  } catch (error) {
    console.error(`Error finding article: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

// CREATE (Save) a new article
router.post('/articles', async (req, res) => {
  try {
    const { newsTitle, newsDescription, status, categories, author } = req.body;

    // Validate required fields
    if (!newsTitle || !newsDescription || !status || !author) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure the status is valid
    const validStatuses = ['Pending', 'Reviewed', 'Approved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Create new article in 'edites_articles' collection
    const newArticle = new Article({
      newsTitle,
      newsDescription,
      status,
      categories: categories || [],
      author,
      date: new Date()
    });

    await newArticle.save();
    res.status(201).json({ message: 'Article saved successfully', article: newArticle });

  } catch (error) {
    console.error('Error saving article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE article status
router.put('/articles/:id/status', async (req, res) => {
  try {
    const articleId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['draft', 'published', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }

    const article = await Article.findByIdAndUpdate(
      articleId,
      { status },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json({
      message: 'Article status updated successfully',
      article,
    });
  } catch (error) {
    console.error('Error updating article status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE article content (title and description)
router.put('/articles/:id', async (req, res) => {
  const { id } = req.params;
  const { newsTitle, newsDescription } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid article ID' });
  }

  if (!newsTitle || !newsDescription) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  // Optionally sanitize HTML or remove all HTML tags
  const sanitizedTitle = sanitizeHtml(newsTitle, {
    allowedTags: [],  // No HTML tags allowed
  });

  const sanitizedDescription = sanitizeHtml(newsDescription, {
    allowedTags: [],  // No HTML tags allowed
  });

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { newsTitle: sanitizedTitle, newsDescription: sanitizedDescription },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json({ message: 'Article updated successfully', article: updatedArticle });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Approve article by ID
router.patch('/articles/:id/approve', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid article ID format' });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error('Error approving article:', error);
    return res.status(500).json({ error: 'Failed to approve the article' });
  }
});


module.exports = router;
