import { Page } from "puppeteer";
import { Cluster } from "puppeteer-cluster";
import expressScrap from "./scrap";

export default async function indiaExpress() {
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

  const expressUrl = "https://indianexpress.com"
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(expressUrl, { waitUntil: "domcontentloaded" })
    await page.waitForSelector("#HP_TOP_NEWS")
    await expressScrap({ page, selector: "#HP_TOP_NEWS h1 >a", name: "heroSection" })
  })
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(expressUrl, { waitUntil: "domcontentloaded" })
    await page.waitForSelector("#HP_TOP_NEWS h2 >a")
    await expressScrap({ page, selector: "#HP_TOP_NEWS h2 >a", name: "heroSection" })
  })
  // cluser.queue(async ({ page }: { page: Page }) => {
  //   await page.goto(expressUrl, { waitUntil: "domcontentloaded" })
  //   await page.waitForSelector("#HP_HAPPENING_NOW a")
  //   await expressScrap({ page, selector: "#HP_HAPPENING_NOW a", name: "heroSection" })
  // })
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(expressUrl, { waitUntil: "domcontentloaded" })
    await page.waitForSelector("#HP_TOPNEWS")
    await expressScrap({ page, selector: "#HP_TOPNEWS article >a", name: "heroSection" })
  })
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(expressUrl, { waitUntil: "domcontentloaded" })
    await page.waitForSelector("#HP_TOPNEWS")
    await expressScrap({ page, selector: "#HP_TOPNEWS h3 >a", name: "heroSection" })
  })




  await cluser.idle()
  await cluser.close()
}


