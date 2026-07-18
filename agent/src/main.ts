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

const imgPrompt = `
Create a **news-style editorial illustration** for the following article.

**Requirements:**

* Produce a **digital illustration, sketch, or vector-style artwork**, **not a real photograph**.
* The illustration should be suitable as a **premium news article header image**.
* Convey the seriousness of the event without showing graphic injuries, blood, burned bodies, or identifiable victims.
* Focus on the scene, atmosphere, emergency response, and consequences rather than shock value.
* Use muted, realistic colors with a professional editorial aesthetic.
* Do not include logos, watermarks, text, or branding.
** Dont include any text on the image. **

**Style Keywords:**
editorial illustration, newspaper artwork, digital painting, realistic sketch, muted colors, cinematic lighting, respectful, non-graphic, premium news media, high detail.

**Article Context:**
`

const scrapNews = await ScrapArticle.find({ scan: false })
for (const news of scrapNews) {
  try {
    const { finalOutput } = await run(agent, JSON.stringify(news))
    if (!finalOutput) {
      console.error(news.id, "Failed: Agent transformation returned undefined")
      continue
    }
    const imageStr = await generateImageFromText({ prompt: imgPrompt + finalOutput.imageGenerationPrompt, articleId: news.id })
    if (imageStr == undefined) {
      throw new Error("image operation failed")
    }
    const base64Response = await fetch(`data:image/png;base64,${imageStr}`)
    const blob = await base64Response.blob()
    const file = new File([blob], "hello.png", { type: "image/png" })
    const formData = new FormData()
    formData.append("upload", file)
    const imageDb = await axios.post("http://localhost:3080/file", formData)
    const article = new Article({ title: finalOutput.title, content: finalOutput.content, sections: news.sections, origin: news._id, image: imageDb.data.fileName })
    await article.save()
    await ScrapArticle.updateOne({ _id: news.id }, { scan: true })
  } catch (error) {
    console.log("Something went wrong")
    console.log(error)
  }
}

await mongoose.disconnect()
