const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = require('../models/Article.js');
const { Types: { ObjectId } } = mongoose;

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

// ✅ FIXED: Removed the extra /api prefix
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

module.exports = router;
