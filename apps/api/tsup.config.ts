import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/http/server.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
    noExternal: [
        '@saas/auth',
        '@saas/env'
    ],
    outDir: 'dist',
    format: 'cjs',
})
