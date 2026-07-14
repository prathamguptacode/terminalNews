import articleModel from "@/models/articleModel";
import productionNews from "@/models/productionNews";

export default async function ranker() {
  const news = await productionNews.find().select("_id origin")
  for (const elm of news) {
    const board = await articleModel.findById(elm.origin).select("board")
    await productionNews.updateOne({ _id: elm._id }, { board: board?.board })
  }
}
