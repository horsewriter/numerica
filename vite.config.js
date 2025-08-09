import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['bcryptjs'], // Evita que lo empaquete
    },
  },
})
