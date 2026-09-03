import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// On GitHub Pages the site lives at https://yueran-ml.github.io/7285/, so assets
// need the /7285/ prefix. Local dev and other hosts keep base '/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/7285/' : '/',
})
