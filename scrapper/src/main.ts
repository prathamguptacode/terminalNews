import 'dotenv/config'
import env from "@/configs/env"
import mongoose from "mongoose";
import { Cluster } from 'puppeteer-cluster';
import { Page } from 'puppeteer';
import centerSectionScrap from './services/centerSectionScrap';
import leftSectionScrap from './services/leftSectionScap';
import techrowScrap from './services/techrowScrap';

try {
  await mongoose.connect(env.DB_URL)
  console.log("Connected to DB")
} catch (error) {
  console.log("Cannot connect to DB")
  process.exit(1)
}

const cluster = await Cluster.launch({
  concurrency: Cluster.CONCURRENCY_PAGE,
  maxConcurrency: 3,
  monitor: true,
  retryLimit: 2,
  retryDelay: 2000,
  puppeteerOptions: {
    headless: false,
    defaultViewport: null
  }
})

const toiUrl = "https://timesofindia.indiatimes.com/"
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiUrl, { waitUntil: "domcontentloaded" })
  await centerSectionScrap(page)
})
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiUrl, { waitUntil: "domcontentloaded" })
  await leftSectionScrap(page)
})
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiUrl, { waitUntil: 'domcontentloaded' });
  await techrowScrap(page);
});


await cluster.idle();
await cluster.close();
await mongoose.disconnect();

