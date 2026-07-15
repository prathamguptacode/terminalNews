import articleModel from "@/models/articleModel";
import { Page } from "puppeteer";

export default async function articleScrapper({ page, rank, position, source, href }: { page: Page, rank: number, position: string, source: string, href: string }) {
  // i dont know if it hits timeout then will cluster will rerun it(Scale depends)
  await page.goto(href, { waitUntil: "domcontentloaded" })
  const newsArticle = await page.evaluate(() => {
    const titleSelector = "h1"
    const contentSelector = `[data-articlebody="1"]`
    const titleElm = document.querySelector(titleSelector) as HTMLElement | null
    const contentElm = document.querySelector(contentSelector) as HTMLElement | null
    if (titleElm == null || contentElm == null) {
      return { title: "", content: "" }
    }
    return { title: titleElm.innerText, content: contentElm.innerText }
  })
  if (newsArticle.title === "" || newsArticle.content === "") {
    return console.log(`Unable to scrap ${href}`)
  }
  //two cases, either news is not there or update news rank
  const oldArticle = await articleModel.findOne({ title: newsArticle.title })
  if (oldArticle === null) {
    const article = new articleModel({
      title: newsArticle.title,
      content: newsArticle.content,
      source: source,
      board: [{ rank: rank, position: position, updatedAt: Date.now() }]
    })
    await article.save()
    return
  }
  await articleModel.updateOne(
    { _id: oldArticle._id },
    {
      $pull:
      {
        board:
        {
          position: position
        }
      }
    }
  )
  await articleModel.updateOne(
    { _id: oldArticle._id },
    {
      $push: {
        board:
        {
          position: position,
          rank: rank,
          updatedAt: Date.now()
        }
      }
    }
  )
  return
}
