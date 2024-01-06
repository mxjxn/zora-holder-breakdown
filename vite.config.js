import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  base: '/zora-holder-breakdown/',
  plugins: [solid()],
})
