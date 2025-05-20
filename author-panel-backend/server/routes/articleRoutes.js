const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const { articleImageUpload } = require("../middleware/imageUpload");
const { submitArticle } = require("../controllers/articleController");

// ✅ GET draft articles
router.get("/author_draft", async (req, res) => {
  try {
    const drafts = await Article.find({ status: "draft" }).sort({ updatedAt: -1 });
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch drafts" });
  }
});

// ✅ GET review articles
router.get("/author_review", async (req, res) => {
  try {
    const reviews = await Article.find({ status: "review" }).sort({ updatedAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch review articles" });
  }
});

// ✅ POST a new article with images (for drafts)
router.post("/author_draft", articleImageUpload, submitArticle);

// ✅ PUT (update) existing article by ID
router.put("/:id", articleImageUpload, async (req, res) => {
  try {
    const articleId = req.params.id;
    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const updates = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      status: req.body.status,
    };

    // ✅ If images are re-uploaded, construct full URLs
    if (req.files["coverImage"]) {
      updates.coverImage = baseUrl + req.files["coverImage"][0].path.replace(/\\/g, "/");
    }
    if (req.files["additionalImage1"]) {
      updates.additionalImage1 = baseUrl + req.files["additionalImage1"][0].path.replace(/\\/g, "/");
    }
    if (req.files["additionalImage2"]) {
      updates.additionalImage2 = baseUrl + req.files["additionalImage2"][0].path.replace(/\\/g, "/");
    }

    const updatedArticle = await Article.findByIdAndUpdate(articleId, updates, { new: true });

    if (!updatedArticle) return res.status(404).json({ error: "Article not found" });

    res.json({ message: "✅ Article updated successfully", article: updatedArticle });
  } catch (err) {
    console.error("❌ Failed to update article:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET single article by ID (keep this last to avoid route conflict)
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    res.json(article);
  } catch (err) {
    console.error("❌ Failed to fetch article:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
