import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// Custom validator for PostgreSQL connection strings
const postgresqlUrl = z.string().refine(
    (val) =>
        val.startsWith('postgresql://') ||
        val.startsWith('postgres://'),
    {
        message: 'DATABASE_URL must start with postgresql:// or postgres://',
    }
)

export const env = createEnv({
    server: {
        PORT: z.coerce.number().default(3333),
        DATABASE_URL: postgresqlUrl,
        JWT_SECRET: z.string(),
        GITHUB_OAUTH_CLIENT_ID: z.string(),
        GITHUB_OAUTH_CLIENT_SECRET: z.string(),
        GITHUB_OAUTH_CLIENT_REDIRECT_URI: z.string().url(),
    },
    client: {
        NEXT_PUBLIC_API_URL: z.string().url().optional(),
   },
    shared: {},
    runtimeEnv: {
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID,
        GITHUB_OAUTH_CLIENT_SECRET: process.env.GITHUB_OAUTH_CLIENT_SECRET,
        GITHUB_OAUTH_CLIENT_REDIRECT_URI: process.env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    emptyStringAsUndefined: true,
})
