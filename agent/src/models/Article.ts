import { ARTICLE_SECTIONS } from "@/constants";
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
    sections: {
      type: [{
        rank: { type: Number, required: true },
        name: {
          type: String,
          enum: ARTICLE_SECTIONS,
          required: true
        },
        updatedAt: { type: Date, required: true }
      }],
      required: true,
      _id: false
    },
    origin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScrapArticle"
    },
    image: {
      type: [String],
      required: true
    },
    tags: {
      type: [String],
      required: true
    },
    likes: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    autoSearchIndex: true
  }
)

articleSchema.searchIndex({
  name: 'default', definition: {
    mappings: {
      dynamic: false,
      fields: {
        title: [
          {
            type: "string"
          },
          {
            type: "autocomplete"
          },
          {
            type:'token'
          }
        ]
      }
    }
  }
})

articleSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 * 1000 })

export default mongoose.model("Article", articleSchema)

//There should be a possible improvement to the issue of repitition in schema/data ?

