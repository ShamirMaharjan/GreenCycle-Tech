const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    category: {
      type: String,
      required: true,
      enum: ["RECYCLABLE WASTE", "COMPOST", "ELECTRONIC WASTE", "HAZARDOUS WASTE"], // Added enum
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;