const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const articleController = require('../controllers/articleController');
const auth = require('../middleware/auth');

// @route   GET api/articles
// @desc    Get all articles for current user based on status
// @access  Private
router.get('/', auth, articleController.getArticles);

// @route   GET api/articles/to-edit
// @desc    Get articles to be edited (for editors)
// @access  Private (Editors only)
router.get('/to-edit', auth, articleController.getArticlesToEdit);

// @route   GET api/articles/:id
// @desc    Get single article by ID
// @access  Private
router.get('/:id', auth, articleController.getArticleById);

// @route   POST api/articles
// @desc    Create a new article
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty()
    ]
  ],
  articleController.createArticle
);

// @route   PUT api/articles/:id
// @desc    Update an article
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
      check('title', 'Title is required').optional(),
      check('content', 'Content is required').optional()
    ]
  ],
  articleController.updateArticle
);

// @route   PUT api/articles/:id/submit
// @desc    Submit an article for review
// @access  Private
router.put('/:id/submit', auth, articleController.submitForReview);

// @route   DELETE api/articles/:id
// @desc    Delete an article
// @access  Private
router.delete('/:id', auth, articleController.deleteArticle);

module.exports = router;