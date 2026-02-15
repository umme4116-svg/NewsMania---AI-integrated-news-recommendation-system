/**
 * Vite configuration for News-Mania frontend.
 * Purpose: Configures the Vite build tool with React plugin and development settings.
 * Used for fast development server and optimized production builds.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})

