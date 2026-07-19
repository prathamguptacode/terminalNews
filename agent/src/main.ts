import 'dotenv/config'
import mongoose from 'mongoose'
import env from "@/config/env"
import ScrapArticle from './models/ScrapArticle';
import { run } from '@openai/agents';
import agent from './agents/editor';
import Article from "./models/Article"
import { generateImageFromText } from './textToImage';
import axios from 'axios';

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
    const imageQuery = []
    for (const query of finalOutput.googleImageQuery) {
      try {
        const res = await axios.get(`http://localhost:8001/img/${query}`)
        const link = res.data.link
        const base64Response = await fetch(link)
        const contentType = base64Response.headers.get("content-type");
        if (contentType == null) {
          throw new Error("Content type not found")
        }
        const blob = await base64Response.blob()
        const formData = new FormData()
        const file = new File([blob], `hello.${(contentType.split("/"))[1]}`, { type: contentType })
        formData.append("upload", file)
        const imageDb = await axios.post("http://localhost:3080/file", formData)
        imageQuery.push(imageDb.data.fileName)
      } catch (error) {
        console.log("Something went wrong while getting image")
        console.log(error)
      }
    }
    const article = new Article({ title: finalOutput.title, content: finalOutput.content, sections: news.sections, origin: news._id, image: imageQuery })
    await article.save()
    await ScrapArticle.updateOne({ _id: news.id }, { scan: true })
  } catch (error) {
    console.log("Something went wrong")
    console.log(error)
  }
}

await mongoose.disconnect()
