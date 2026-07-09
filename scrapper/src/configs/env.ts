import { z } from "zod"

const schema = z.object({
  DB_URL: z.string()
})

const val = schema.safeParse(process.env)
if (val.success === false) {
  console.log("ENV File not valid")
  process.exit(1)
}

export default val.data

