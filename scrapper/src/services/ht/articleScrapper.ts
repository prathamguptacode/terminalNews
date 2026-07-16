import ScrapArticle from "@/models/ScrapArticle";
import { Page } from "puppeteer";

export default async function articleScrapper({ page, rank, position, source, href }: { page: Page, rank: number, position: string, source: string, href: string }) {
  // i dont know if it hits timeout then will cluster will rerun it(Scale depends)
  await page.goto(href, { waitUntil: "domcontentloaded" })
  const newsArticle = await page.evaluate(() => {
    const titleSelector = "h1"
    const contentSelector = ".artContent"
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
  //two casese either news not there or update news rank
  const oldArticle = await ScrapArticle.findOne({ title: newsArticle.title })
  if (oldArticle === null) {
    const article = new ScrapArticle({
      title: newsArticle.title,
      content: newsArticle.content,
      source: source,
      sections: [{ rank: rank, position: position, updatedAt: Date.now() }]
    })
    await article.save()
    return
  }
  await ScrapArticle.updateOne(
    { _id: oldArticle._id },
    {
      $pull:
      {
        sections:
        {
          position: position
        }
      }
    }
  )
  await ScrapArticle.updateOne(
    { _id: oldArticle._id },
    {
      $push: {
        sections:
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
