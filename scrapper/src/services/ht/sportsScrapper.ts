import { Page } from "puppeteer";
import articleScrapper from "./articleScrapper";

export default async function sportsHindustan({ page }: { page: Page }) {
  const hrefs = await page.evaluate(() => {
    const box = document.querySelector(".home_section_layout")
    if (box == null) {
      return []
    }
    const anchors = box.querySelectorAll("h2>a") as NodeListOf<HTMLAnchorElement>
    const hrefs: string[] = []
    anchors.forEach(element => hrefs.push(element.href))
    const anchors2 = box.querySelectorAll("h3>a") as NodeListOf<HTMLAnchorElement>
    anchors2.forEach(element => hrefs.push(element.href))
    return hrefs
  })
  let i = 1
  for (const elm of hrefs) {
    await articleScrapper({ page, href: elm, source: "hindustanTimes", name: "sportsNews", rank: i })
    i++
  }
}
