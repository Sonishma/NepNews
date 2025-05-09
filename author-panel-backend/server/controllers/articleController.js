const Article = require('../models/Article');
const { validationResult } = require('express-validator');

// Get all articles for current user based on status
exports.getArticles = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { author: req.user.id };
    
    // If status filter is provided
    if (status) {
      query.status = status;
    }
    
    const articles = await Article.find(query).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get articles to be edited (for editors)
exports.getArticlesToEdit = async (req, res) => {
  try {
    // Only editors or admins can access this
    if (req.user.role !== 'editor' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const articles = await Article.find({ status: 'to_be_edited' })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
      
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get single article
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    
    // Check if user is the author or an editor/admin
    if (article.author.toString() !== req.user.id && 
        req.user.role !== 'editor' && 
        req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    res.json(article);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Article not found' });
    }
    res.status(500).send('Server error');
  }
};

// Create article
exports.createArticle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content } = req.body;
    
    const newArticle = new Article({
      title,
      content,
      author: req.user.id,
      status: 'draft'
    });
    
    const article = await newArticle.save();
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update article
exports.updateArticle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    
    // Check authorization: author can update draft/rejected, editor can update anything
    if (article.author.toString() === req.user.id) {
      if (article.status !== 'draft' && article.status !== 'rejected' && req.user.role !== 'editor') {
        return res.status(403).json({ msg: 'Cannot update article in this status' });
      }
    } else if (req.user.role !== 'editor' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    // Update fields
    const { title, content, status, coverImage, images } = req.body;
    
    if (title) article.title = title;
    if (content) article.content = content;
    if (status && (req.user.role === 'editor' || req.user.role === 'admin')) {
      article.status = status;
    }
    if (coverImage) article.coverImage = coverImage;
    if (images) article.images = images;
    
    article.updatedAt = Date.now();
    
    // If editor is updating, store editor info
    if (req.user.role === 'editor') {
      article.editor = req.user.id;
    }
    
    await article.save();
    res.json(article);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Article not found' });
    }
    res.status(500).send('Server error');
  }
};

// Submit article for review
exports.submitForReview = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    
    // Only author can submit their own article
    if (article.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    // Can only submit draft or rejected articles
    if (article.status !== 'draft' && article.status !== 'rejected') {
      return res.status(400).json({ msg: 'Can only submit draft or rejected articles' });
    }
    
    article.status = 'pending';
    article.updatedAt = Date.now();
    
    await article.save();
    res.json(article);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Article not found' });
    }
    res.status(500).send('Server error');
  }
};

// Delete article
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    
    // Author can delete their draft articles, admin can delete any
    if (article.author.toString() === req.user.id) {
      if (article.status !== 'draft' && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Can only delete draft articles' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    await article.remove();
    res.json({ msg: 'Article removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Article not found' });
    }
    res.status(500).send('Server error');
  }
};