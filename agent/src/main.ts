import 'dotenv/config'
import mongoose from 'mongoose'
import env from "@/config/env"
import ScrapArticle from './models/ScrapArticle';
import { run } from '@openai/agents';
import agent from './agents/editor';
import Article from "./models/Article"

await mongoose.connect(env.DB_URL).then(() => console.log("Connected to DB")).catch(() => {
  console.log("Something went wrong cannot connnect to DB");
  process.exit(1)
})

const scrapNews = await ScrapArticle.find({ scan: false })
for (const news of scrapNews) {
  try {
    const { finalOutput } = await run(agent, JSON.stringify(news))
    if (!finalOutput) {
      console.error(news.id, "Failed: Agent transformation returned undefined")
      continue
    }
    const article = new Article({ title: finalOutput.title, content: finalOutput.content, sections: news.sections, origin: news._id })
    await article.save()
    await ScrapArticle.updateOne({ _id: news.id }, { scan: true })
  } catch (error) {
    console.log("Something went wrong")
  }
}

await mongoose.disconnect()
