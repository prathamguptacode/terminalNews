import { Page } from "puppeteer";
import articleScrapper from "../articleScrapper";

export default async function businessHeroScrap(page: Page) {
  const hrefs = await page.evaluate(() => {
    const topSectionBox = document.querySelector(".row")
    if (topSectionBox == null) {
      return []
    }
    const anchors = topSectionBox.querySelectorAll(`a`) as NodeListOf<HTMLAnchorElement>
    const hrefs: string[] = []
    anchors.forEach(element => hrefs.push(element.href))
    return hrefs
  })
  let i = 1
  for (const elm of hrefs) {
    await articleScrapper({ page, href: elm, source: "TOI", position: "businessNews", rank: i })
    i++
  }
}
