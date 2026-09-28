import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // host: true permite abrir la app desde el celular en la misma red Wi-Fi
  server: { host: true, port: 5173 },
  preview: { host: true, port: 5173 },
})
