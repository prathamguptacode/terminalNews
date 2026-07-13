import 'dotenv/config'
import env from "@/configs/env"
import mongoose from "mongoose";
import { Cluster } from 'puppeteer-cluster';
import { Page } from 'puppeteer';
import centerSectionScrap from './services/toiHomepage/centerSectionScrap';
import leftSectionScrap from './services/toiHomepage/leftSectionScap';
import techrowScrap from './services/toiHomepage/techrowScrap';
import entertainmentScrap from './services/toiHomepage/entertainmentScrap';
import crimeScrap from './services/toiHomepage/crimeScrap';
import worldrowScrap from './services/toiHomepage/worldRowScrap';
import fifaScrap from './services/toiHomepage/fifaScrap';
import sportsScrap from './services/toiHomepage/sportsScrap';
import legalScrap from './services/toiHomepage/legalScrap';
import trendingScrap from './services/toiHomepage/trendingScrap';
import businessrowScrap from './services/toiHomepage/businessrowScrap';
import educationScrap from './services/toiHomepage/educationScrap';
import techScrap from './services/toiHomepage/techScrap';
import indiaScrap from './services/indiaPage/indiaScrap';

try {
  await mongoose.connect(env.DB_URL)
  console.log("Connected to DB")
} catch (error) {
  console.log("Cannot connect to DB")
  process.exit(1)
}

const cluster = await Cluster.launch({
  concurrency: Cluster.CONCURRENCY_PAGE,
  maxConcurrency: 5,
  monitor: true,
  retryLimit: 2,
  retryDelay: 2000,
  puppeteerOptions: {
    headless: true,
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
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiUrl, { waitUntil: 'domcontentloaded' });
  await entertainmentScrap(page);
});
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiUrl, { waitUntil: 'domcontentloaded' });
  await crimeScrap(page);
});
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiUrl, { waitUntil: 'domcontentloaded' });
  await worldrowScrap(page);
});
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiUrl, { waitUntil: 'domcontentloaded' });
  await fifaScrap(page);
});
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiUrl, { waitUntil: 'domcontentloaded' });
  await fifaScrap(page);
});
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiUrl, { waitUntil: "domcontentloaded" })
  await sportsScrap(page)
});
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiUrl, { waitUntil: 'domcontentloaded' });
  await legalScrap(page);
});
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiUrl, { waitUntil: 'domcontentloaded' });
  await trendingScrap(page);
});
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiUrl, { waitUntil: 'domcontentloaded' });
  await businessrowScrap(page);
});
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiUrl, { waitUntil: 'domcontentloaded' });
  await educationScrap(page);
});
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiUrl, { waitUntil: 'domcontentloaded' });
  await techScrap(page);
});

const toiIndiaNewsSection = 'https://timesofindia.indiatimes.com/india';
cluster.queue(async ({ page }: { page: Page }) => {
  await page.goto(toiIndiaNewsSection, { waitUntil: 'domcontentloaded' });
  await indiaScrap(page);
});




await cluster.idle();
await cluster.close();
await mongoose.disconnect();

