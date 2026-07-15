import articleModel from "@/models/articleModel";
import productionNews from "@/models/productionNews";

export default async function ranker() {
  const news = await productionNews.find().select("_id origin") // Assume n results
  for (const elm of news) { // Therefore n iterations
    //Every iteration,
    const board = await articleModel.findById(elm.origin).select("board") // Fetch one board
    await productionNews.updateOne({ _id: elm._id }, { board: board?.board }) // Update one prodNews after refinding it

    //Therefore, every iteration, we find 2 things , and update one (very RAW info)
  }
  // Finally, fetching 3n search queries + n update ONLY queries OR we can say 2n search queries + n updateOne query
  // Can this be improved?
}
