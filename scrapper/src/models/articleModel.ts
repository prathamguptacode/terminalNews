import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    content: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: true
    },
    board: {
      type: [{ rank: { type: Number, required: true }, position: { type: String, required: true, enum: ["heroSection", "leftSection", "techSection", "entertainmentSection", "crimeSection"] }, updatedAt: { type: Date, required: true } }],
      required: true
    },
    scan: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true
  }
)

export default mongoose.model("scrapArticles", articleSchema)
