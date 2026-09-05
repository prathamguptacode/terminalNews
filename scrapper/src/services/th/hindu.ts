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

  const url = "https://www.thehindu.com/"
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" })
    await page.waitForSelector(".top-section")
    await hinduScrap({ page, selector: ".top-section h3> a", name: "heroSection" })
  })
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" })
    await page.waitForSelector(".top-section")
    await hinduScrap({ page, selector: ".top-section a.picture", name: "heroSection" })
  })
  cluser.queue(async ({ page }: { page: Page }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" })
    await page.waitForSelector(`[data-ga-label="extended-top-news"] h3>a`)
    await hinduScrap({ page, selector: `[data-ga-label="extended-top-news"] h3>a`, name: "trendingSection" })
  })
  cluser.queue(async ({ page }: { page: Page }) => {
    const sportsUrl = "https://www.thehindu.com/sport/"
    await page.goto(sportsUrl, { waitUntil: "domcontentloaded" })
    await page.waitForSelector(`.container:nth-child(2) h3>a`)
    await hinduScrap({ page, selector: `.container:nth-child(2) h3>a`, name: "sportsNews" })
  })
  cluser.queue(async ({ page }: { page: Page }) => {
    const hinduWorldUrl = "https://www.thehindu.com/news/international/"
    await page.goto(hinduWorldUrl, { waitUntil: "domcontentloaded" })
    await page.waitForSelector(".container:nth-child(2) h3>a")
    await hinduScrap({ page, selector: ".container:nth-child(2) h3>a", name: "worldNews" })
  })


  await cluser.idle()
  await cluser.close()
}


