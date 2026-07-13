import { Page } from "puppeteer"
import { Cluster } from "puppeteer-cluster"
import centerSectionScrap from "./toiHomepage/centerSectionScrap"
import leftSectionScrap from "./toiHomepage/leftSectionScap"
import techrowScrap from "./toiHomepage/techrowScrap"
import entertainmentScrap from "./toiHomepage/entertainmentScrap"
import crimeScrap from "./toiHomepage/crimeScrap"
import worldrowScrap from "./toiHomepage/worldRowScrap"
import fifaScrap from "./toiHomepage/fifaScrap"
import sportsScrap from "./toiHomepage/sportsScrap"
import legalScrap from "./toiHomepage/legalScrap"
import trendingScrap from "./toiHomepage/trendingScrap"
import businessrowScrap from "./toiHomepage/businessrowScrap"
import educationScrap from "./toiHomepage/educationScrap"
import techScrap from "./toiHomepage/techScrap"
import indiaScrap from "./indiaPage/indiaScrap"
import worldNewsScrapper from "./worldNews/worldScrapper"
import businessHeroScrap from "./businessNews/businessHeroScrapper"
import businessNewsScrapper from "./businessNews/businessNewsScrapper"

export default async function toiScrapper() {
  const cluster = await Cluster.launch({
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

  const toiWorldnewsPage = 'https://timesofindia.indiatimes.com/world';
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiWorldnewsPage, { waitUntil: 'domcontentloaded' });
    // world news top section on world news page
    await worldNewsScrapper({ page, selector: `[data-type=in_view]:nth-child(3) a`, postion: "worldNews" })
  });
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiWorldnewsPage, { waitUntil: 'domcontentloaded' });
    // us news section
    await worldNewsScrapper({ page, selector: `[data-type=in_view]:nth-child(10) a`, postion: "usNews" })
  });
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiWorldnewsPage, { waitUntil: 'domcontentloaded' });
    // uk news section
    await worldNewsScrapper({ page, selector: `[data-type=in_view]:nth-child(17) a`, postion: "ukNews" })
  });
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiWorldnewsPage, { waitUntil: 'domcontentloaded' });
    // europe news section
    await worldNewsScrapper({ page, selector: `[data-type=in_view]:nth-child(19) a`, postion: "europeNews" })
  });
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiWorldnewsPage, { waitUntil: 'domcontentloaded' });
    // middle east news section
    await worldNewsScrapper({ page, selector: `[data-type=in_view]:nth-child(23) a`, postion: "middleEastNews" })
  });
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiWorldnewsPage, { waitUntil: 'domcontentloaded' });
    // middle east news section
    await worldNewsScrapper({ page, selector: `[data-type=in_view]:nth-child(23) a`, postion: "middleEastNews" })
  });
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiWorldnewsPage, { waitUntil: 'domcontentloaded' });
    // other world news section
    await worldNewsScrapper({ page, selector: `[data-type=in_view]:nth-child(25) a`, postion: "otherWorldNews" })
  });
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiWorldnewsPage, { waitUntil: 'domcontentloaded' });
    // popular world new section 
    await worldNewsScrapper({ page, selector: `[data-type=in_view]:nth-child(28) a`, postion: "popularWorldNews" })
  });

  const toiBusinessPage = 'https://timesofindia.indiatimes.com/business';
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiBusinessPage, { waitUntil: 'domcontentloaded' });
    await businessHeroScrap(page)
  });
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiBusinessPage, { waitUntil: "domcontentloaded" })
    await businessNewsScrapper({ page, selector: `[data-section="ind_biz_news"] a`, postion: "indiaBusiness" })
  })
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiBusinessPage, { waitUntil: "domcontentloaded" })
    await businessNewsScrapper({ page, selector: `[data-section="int_biz_news"] a`, postion: "internationBusiness" })
  })
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiBusinessPage, { waitUntil: "domcontentloaded" })
    await businessNewsScrapper({ page, selector: `[data-section="corporatenews"] a`, postion: "corporateNews" })
  })
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiBusinessPage, { waitUntil: "domcontentloaded" })
    await businessNewsScrapper({ page, selector: `[data-section="economynews"] a`, postion: "economyNews" })
  })
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiBusinessPage, { waitUntil: "domcontentloaded" })
    await businessNewsScrapper({ page, selector: `[data-section="cryptonews"] a`, postion: "cryptoNews" })
  })
  cluster.queue(async ({ page }: { page: Page }) => {
    await page.goto(toiBusinessPage, { waitUntil: "domcontentloaded" })
    await businessNewsScrapper({ page, selector: `[data-section="aviationnews"] a`, postion: "aviationNews" })
  })


  await cluster.idle();
  await cluster.close();

}
