import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/prisma-techfest/',

  build: {
    // Enable source maps for debugging (can disable in production)
    sourcemap: false,

    // Chunk size warnings
    chunkSizeWarningLimit: 1000,

    // Rollup options for optimization
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks - separate large libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-animation': ['framer-motion', 'gsap', 'lenis', 'lenis/react'],
          'vendor-ui': ['lucide-react'],
          'vendor-three': ['three'],
        },

        // Asset file naming for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          } else if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },

        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    // Minification options - using esbuild (built-in, faster)
    minify: 'esbuild',

    // Drop console.logs and debugger in production
    esbuildOptions: {
      drop: ['debugger'],
    },

    // CSS code splitting
    cssCodeSplit: true,

    // Asset inlining threshold (smaller assets will be inlined as base64)
    assetsInlineLimit: 4096,

    // Target modern browsers for smaller bundles
    target: 'es2015',
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'gsap', 'lenis', 'lenis/react'],
    exclude: [],
  },

  // Performance optimizations
  server: {
    hmr: {
      overlay: false, // Disable error overlay for better performance
    },
  },
})
