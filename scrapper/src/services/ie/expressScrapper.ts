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
    await page.waitForSelector("#home-main-content > div:nth-child(3)")
    await expressScrap({ page, selector: "#home-main-content > div:nth-child(3) h1>a", name: "heroSection" })
  })
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(expressUrl, { waitUntil: "domcontentloaded" })
    await page.waitForSelector("#home-main-content > div:nth-child(3)")
    await expressScrap({ page, selector: "#home-main-content > div:nth-child(3) h2>a", name: "leftSection" })
  })
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(expressUrl, { waitUntil: "domcontentloaded" })
    await page.waitForSelector("#home-main-content > div:nth-child(5)")
    await expressScrap({ page, selector: "#home-main-content > div:nth-child(5) h3>a", name: "leftSection" })
  })

  await cluser.idle()
  await cluser.close()
}


