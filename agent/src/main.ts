import 'dotenv/config'
import mongoose from 'mongoose'
import env from "@/config/env"
import scrap from './model/scrap';
import { run } from '@openai/agents';
import agent from './agents/editor';
import article from "./model/news"

await mongoose.connect(env.DB_URL).then(() => console.log("Connected to DB")).catch(() => {
  console.log("Something went wrong cannot connnect to DB");
  process.exit(1)
})

const scrapNews = await scrap.find({ scan: false })
for (const news of scrapNews) {
  try {
    const articleRaw = await run(agent, JSON.stringify(news))
    const newArticle = new article({ title: articleRaw.finalOutput?.title, content: articleRaw.finalOutput?.content, board: news.board, origin: news._id })
    await newArticle.save()
    await scrap.updateOne({ _id: news.id }, { scan: true })
  } catch (error) {
    console.log("Something went wrong")
  }
}

await mongoose.disconnect()
