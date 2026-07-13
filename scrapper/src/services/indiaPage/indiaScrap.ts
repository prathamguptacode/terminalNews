
import { Page } from "puppeteer";
import articleScrapper from "../articleScrapper";

export default async function indiaScrap(page: Page) {
  const hrefs = await page.evaluate(() => {
    const anchors = document.querySelectorAll(`[data-type=in_view]:nth-child(3) a`) as NodeListOf<HTMLAnchorElement>
    const hrefs: string[] = []
    anchors.forEach(element => hrefs.push(element.href))
    const anchors2 = document.querySelectorAll(`[data-type=in_view]:nth-child(9) a`) as NodeListOf<HTMLAnchorElement>
    anchors2.forEach(element => hrefs.push(element.href))
    return hrefs
  })
  let i = 1
  for (const elm of hrefs) {
    await articleScrapper({ page, href: elm, source: "TOI", position: "indiaNews", rank: i })
    i++
  }
}
