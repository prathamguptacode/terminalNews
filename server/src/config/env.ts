import { z } from 'zod'

const envSchema = z.object({
    DB_URL: z.string(),
    CLIENT_URL: z.string(),
    PORT: z.coerce.number().int().positive().max(65535).default(8080)
})

const parsedData = envSchema.safeParse(process.env)

if (!parsedData.success) {
    console.error("Env parsing failed, exiting...")
    process.exit(1)
}

export const env = parsedData.data