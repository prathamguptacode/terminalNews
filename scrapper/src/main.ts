import 'dotenv/config'
import env from "@/configs/env"
import mongoose from "mongoose";
import toiScrapper from './services/toi/toi';
import hindu from './services/th/hindu';
import indiaExpress from './services/ie/expressScrapper';
import hindustanTimes from './services/ht/hindustanTimeScrapper';
import ranker from './services/ranker/ranker';

try {
  const DB_URL = (env.NODE_ENV === "PRODUCTION") ? env.DB_URL : env.DEV_DB_URL
  await mongoose.connect(DB_URL)
  console.log("Connected to DB")
} catch (error) {
  console.log("Cannot connect to DB")
  process.exit(1)
}



await toiScrapper()
await hindu()
await indiaExpress()
await hindustanTimes()
await ranker()

await mongoose.disconnect()

