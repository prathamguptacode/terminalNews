import { ARTICLE_SECTIONS } from "../constants.js";
import mongoose from "mongoose";
const scrapArticleSchema = new mongoose.Schema({
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
    scan: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});
export default mongoose.model("ScrapArticle", scrapArticleSchema, 'scrap_articles');
//# sourceMappingURL=ScrapArticle.js.map