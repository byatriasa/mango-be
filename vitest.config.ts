// eslint-disable-next-line @typescript-eslint/no-var-requires
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

// environment variables
import 'dotenv/config'

export default defineConfig({
  plugins: [tsconfigPaths()]
})
