import mongoose from "mongoose";

const newsletterEmailSchema = new mongoose.Schema({
  email: String
}, {
  timestamps: true
})

export default mongoose.model("newsletteremails", newsletterEmailSchema) 
