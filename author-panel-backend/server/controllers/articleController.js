const Article = require("../models/Article");

exports.submitArticle = async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILES:", req.files);

    const { title, content, category, status } = req.body;

    if (!title || !content || !category || !status) {
      return res.status(400).json({ success: false, message: "❌ Missing required fields." });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}/`; // e.g. http://localhost:5000/

    const article = new Article({
      title,
      content,
      category,
      status,
      coverImage: req.files?.coverImage?.[0]
        ? baseUrl + req.files.coverImage[0].path.replace(/\\/g, "/")
        : "",
      additionalImage1: req.files?.additionalImage1?.[0]
        ? baseUrl + req.files.additionalImage1[0].path.replace(/\\/g, "/")
        : "",
      additionalImage2: req.files?.additionalImage2?.[0]
        ? baseUrl + req.files.additionalImage2[0].path.replace(/\\/g, "/")
        : ""
    });

    await article.save();

    console.log("✅ Article saved:", article);
    res.status(201).json({ success: true, message: "✅ Article saved successfully!", article });
  } catch (error) {
    console.error("❌ Article save failed:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
