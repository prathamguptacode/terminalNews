import { Page } from "puppeteer";
import articleScrapper from "./articleScrapper";

export default async function hinduScrap({ page, selector, name }: { page: Page, selector: string, name: string }) {
  const hrefs = await page.evaluate((selector) => {
    const anchors = document.querySelectorAll(selector) as NodeListOf<HTMLAnchorElement>
    const hrefs: string[] = []
    anchors.forEach(element => hrefs.push(element.href))
    return hrefs
  }, selector)
  let i = 1
  for (const elm of hrefs) {
    await articleScrapper({ page, href: elm, source: "hindu", name: name, rank: i })
    i++
  }
}
