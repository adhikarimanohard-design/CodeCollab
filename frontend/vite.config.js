import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This fixes the sockjs-client "global is not defined" error
    global: 'window',
  },
})
