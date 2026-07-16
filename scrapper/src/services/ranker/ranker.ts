import ScrapArticle from "@/models/ScrapArticle";
import Article from "@/models/Article";

export default async function ranker() {
  const news = await Article.find().select("_id origin") // Assume n results
  for (const elm of news) { // Therefore n iterations
    //Every iteration,
    const sections = await ScrapArticle.findById(elm.origin).select("sections") // Fetch one sections
    await Article.updateOne({ _id: elm._id }, { sections: sections?.sections }) // Update one prodNews after refinding it

    //Therefore, every iteration, we find 2 things , and update one (very RAW info)
  }
  // Finally, fetching 3n search queries + n update ONLY queries OR we can say 2n search queries + n updateOne query
  // Can this be improved?
}
