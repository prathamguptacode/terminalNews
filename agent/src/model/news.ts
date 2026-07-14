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
    board: {
      type: [{ rank: { type: Number, required: true }, position: { type: String, required: true, }, updatedAt: { type: Date, required: true } }],
      required: true
    },
    origin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "scraparticles"
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model("articles", articleSchema)

