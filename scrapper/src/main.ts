import 'dotenv/config'
import env from "@/configs/env"
import mongoose from "mongoose";
import toiScrapper from './services/toi/toi';
import hindu from './services/th/hindu';
import indiaExpress from './services/ie/expressScrapper';
import hindustanTimes from './services/ht/hindustanTimeScrapper';

try {
  await mongoose.connect(env.DB_URL)
  console.log("Connected to DB")
} catch (error) {
  console.log("Cannot connect to DB")
  process.exit(1)
}



await toiScrapper()
await hindu()
await indiaExpress()
await hindustanTimes()

await mongoose.disconnect();

