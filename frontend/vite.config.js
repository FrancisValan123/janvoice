/* ===================================
   JANVOICE — VITE CONFIGURATION
   =================================== */

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// ===================================
// VITE CONFIG (Function form for env access)
// ===================================
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // ===================================
    // PLUGINS
    // ===================================
    plugins: [react()],

    // ===================================
    // DEV SERVER
    // ===================================
    server: {
      port: 5173,
      host: true, // Listen on all addresses (for mobile testing)
      strictPort: false, // Auto-increment if port is in use
      open: false, // Don't auto-open browser
      cors: true, // Enable CORS for dev

      // Hot Module Replacement
      hmr: {
        overlay: true // Show errors as overlay in browser
      },

      // API Proxy — forwards /api requests to backend
      proxy: {
        '/api': {
          target: env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          // Uncomment to see proxy logs
          // configure: (proxy) => {
          //   proxy.on('proxyReq', (proxyReq, req) => {
          //     console.log('📤 Proxying:', req.method, req.url)
          //   })
          // }
        }
      }
    },

    // ===================================
    // BUILD CONFIGURATION
    // ===================================
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      minify: 'esbuild', // 'esbuild' (fast) or 'terser' (smaller)

      // Warn when chunk exceeds this size (in KB)
      chunkSizeWarningLimit: 1000,

      // Rollup options for chunk splitting
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // React core
            'react-vendor': ['react', 'react-dom'],

            // Router
            'router-vendor': ['react-router-dom'],

            // UI libraries
            'ui-vendor': [
              '@mui/material',
              '@emotion/react',
              '@emotion/styled'
            ],

            // Charts
            'chart-vendor': ['recharts'],

            // Animations
            'anim-vendor': ['framer-motion'],

            // Icons
            'icon-vendor': ['react-icons']
          },

          // File naming patterns
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      },

      // Enable/disable compressed size reporting
      reportCompressedSize: true
    },

    // ===================================
    // PATH RESOLUTION ALIASES
    // ===================================
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@context': path.resolve(__dirname, './src/context'),
        '@services': path.resolve(__dirname, './src/services'),
        '@config': path.resolve(__dirname, './src/config'),
        '@layout': path.resolve(__dirname, './src/layout'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@assets': path.resolve(__dirname, './src/assets')
      }
    },

    // ===================================
    // CSS CONFIGURATION
    // ===================================
    css: {
      devSourcemap: true, // Enable CSS source maps in dev
      postcss: './postcss.config.js'
    },

    // ===================================
    // DEPENDENCY OPTIMIZATION
    // ===================================
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios'
      ],
      exclude: []
    },

    // ===================================
    // PREVIEW SERVER (for `vite preview`)
    // ===================================
    preview: {
      port: 4173,
      host: true,
      strictPort: false
    },

    // ===================================
    // ENVIRONMENT VARIABLES
    // ===================================
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    },

    // ===================================
    // LOG LEVEL
    // ===================================
    logLevel: 'info', // 'info' | 'warn' | 'error' | 'silent'

    // ===================================
    // CLEAR SCREEN ON START
    // ===================================
    clearScreen: true
  }
})