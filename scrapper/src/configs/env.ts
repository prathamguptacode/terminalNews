import { z } from "zod"

const schema = z.object({
  DB_URL: z.string(),
  DEV_DB_URL: z.string(),
  NODE_ENV: z.string().default("DEVELOPEMENT")
})

const val = schema.safeParse(process.env)
if (val.success === false) {
  console.log("ENV File not valid")
  process.exit(1)
}

export default val.data

