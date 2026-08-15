import { z } from "zod"

const envSchema = z.object({
  DB_URL: z.string(),
  IMAGE_DB_URL: z.string(),
  NODE_ENV: z.string().default("DEVELOPEMENT"),
  DEV_DB_URL: z.string()
})

const val = envSchema.safeParse(process.env)

if (val.success == false) {
  console.log("Something went wrong in ENV File")
  process.exit(1)
}

export default val.data
