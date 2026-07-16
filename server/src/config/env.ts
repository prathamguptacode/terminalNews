import { z } from 'zod'

const envSchema = z.object({
    DB_URL: z.string()
})

const parsedData = envSchema.safeParse(process.env)

if (!parsedData.success) {
    console.error("Env parsing failed, exiting...")
    process.exit(1)
}

export const env = parsedData.data