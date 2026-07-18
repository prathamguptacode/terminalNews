import { Page } from "puppeteer";
import { Cluster } from "puppeteer-cluster";
import hinduScrap from "./scrap";

export default async function hindu() {
  const cluser = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 10,
    monitor: true,
    retryLimit: 2,
    retryDelay: 2000,
    puppeteerOptions: {
      headless: true,
      defaultViewport: null
    }
  })

  const hinduUrl = "https://www.thehindu.com/"
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(hinduUrl, { waitUntil: "domcontentloaded" })
    await hinduScrap({ page, selector: ".top-section .title>a", name: "heroSection" })
  })
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(hinduUrl, { waitUntil: "domcontentloaded" })
    await hinduScrap({ page, selector: "section:nth-child(26) .title>a", name: "editorSection" })
  })
  const hinduWorldUrl = "https://www.thehindu.com/news/international/"
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(hinduWorldUrl, { waitUntil: "domcontentloaded" })
    await page.waitForSelector("body > section:nth-child(24) .title>a ")
    await hinduScrap({ page, selector: "body > section:nth-child(24) .title>a ", name: "worldNews" })
  })


  await cluser.idle()
  await cluser.close()
}


