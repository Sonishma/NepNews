const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["global","politics", "sports", "health", "culture", "arts", "earth", "travel", "national"]
  },
  coverImage: { type: String, default: "" },
  additionalImage1: { type: String, default: "" },
  additionalImage2: { type: String, default: "" },
  status: { type: String, enum: ["draft", "review"], default: "draft" }
}, { timestamps: true });

module.exports = mongoose.model("Article", ArticleSchema);
