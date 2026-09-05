import { Page } from "puppeteer";
import { Cluster } from "puppeteer-cluster";
import hindustanScrap from "./scrap";
import sportsHindustan from "./sportsScrapper";

export default async function hindustanTimes() {
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

  const url = "https://www.hindustantimes.com/"
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" })
    await page.waitForSelector(".topRow")
    await hindustanScrap({ page, selector: ".topRow a.imgWrap", name: "heroSection" })
  })
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" })
    await page.waitForSelector(".bottomRow")
    await hindustanScrap({ page, selector: ".bottomRow a.sliderThumb", name: "heroSection" })
  })
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" })
    await page.waitForSelector(".home_section_layout")
    await sportsHindustan({ page })
  })
  cluser.queue(async ({ page }: { page: Page }) => {
    const worldNewsUrl = "https://www.hindustantimes.com/world-news"
    await page.goto(worldNewsUrl, { waitUntil: "domcontentloaded" })
    await page.waitForSelector(".mainContainer")
    await hindustanScrap({ page, selector: ".mainContainer h2>a", name: "worldNews" })
  })





  await cluser.idle()
  await cluser.close()
}


