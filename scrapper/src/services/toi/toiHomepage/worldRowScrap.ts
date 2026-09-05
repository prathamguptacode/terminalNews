import { Page } from "puppeteer";
import articleScrapper from "../articleScrapper";

export default async function worldrowScrap(page: Page) {
  const hrefs = await page.evaluate(() => {
    const anchors = document.querySelectorAll(`[data-type=in_view]:nth-child(15) a`) as NodeListOf<HTMLAnchorElement>
    const hrefs: string[] = []
    anchors.forEach(element => hrefs.push(element.href))
    return hrefs
  })
  let i = 1
  for (const elm of hrefs) {
    await articleScrapper({ page, href: elm, source: "TOI", name: "worldNews", rank: i })
    i++
  }
}
