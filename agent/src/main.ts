import 'dotenv/config'
import mongoose from 'mongoose'
import env from "@/config/env"
import ScrapArticle from './models/ScrapArticle';
import { run } from '@openai/agents';
import agent from './agents/editor';
import Article from "./models/Article"
import axios from 'axios';
import OpenAI from 'openai'
const client = new OpenAI();

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
    const imageQuery: string[] = []
    // no ts support
    const imgResponse = await client.responses.create({
      model: "gpt-5.4-mini",
      reasoning: { effort: "low" },
      tools: [
        {
          type: "web_search",
          search_content_types: ["image",],
          image_settings: {
            max_results: 3,
            caption: true,
          },
        } as any,
      ],
      include: ["web_search_call.results"],
      input: `give images for a news headline: ${finalOutput.title} (make sure images does not have any watermark)`,
    });
    imgResponse.output.forEach((e: any) => {
      if (e.results && e.results.length > 0) {
        e.results.forEach((r: any) => {
          imageQuery.push(r.image_url);
        })
        // why we cant break the loop there
      }
    })
    const imgUrls: string[] = []
    for (const link of imageQuery) {
      try {
        const base64Response = await fetch(link)
        const contentType = base64Response.headers.get("content-type");
        if (contentType == null) {
          throw new Error("Content type not found")
        }
        const blob = await base64Response.blob()
        const formData = new FormData()
        const file = new File([blob], `hello.${(contentType.split("/"))[1]}`, { type: contentType })
        formData.append("upload", file)
        const imgUrlRes = await axios.post("http://localhost:3080/file", formData)
        imgUrls.push(imgUrlRes.data.fileName)
      } catch (error) {
        console.log(error)
        console.log("Cannot upload image")
      }
    }
    const article = new Article({ title: finalOutput.title, content: finalOutput.content, sections: news.sections, origin: news._id, image: imgUrls })
    await article.save()
    await ScrapArticle.updateOne({ _id: news.id }, { scan: true })
  } catch (error) {
    console.log("Something went wrong")
    console.log(error)
  }
}

await mongoose.disconnect()
