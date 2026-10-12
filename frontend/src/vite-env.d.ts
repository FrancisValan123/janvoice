/// <reference types="vite/client" />

// ===================================
// JANVOICE — ENVIRONMENT VARIABLES
// ===================================
// Vite's client types already declare:
//   MODE, BASE_URL, PROD, DEV, SSR
//   + Static asset modules (svg, png, jpg, etc.)
//
// We only need to declare our custom VITE_* variables.

interface ImportMetaEnv {
  /**
   * Backend API base URL
   * @example "http://localhost:5000/api"
   */
  readonly VITE_API_URL: string

  /**
   * App name (used in titles, headers)
   * @example "JanVoice"
   */
  readonly VITE_APP_NAME: string

  /**
   * WebSocket server URL (for real-time features)
   * @example "ws://localhost:5000"
   */
  readonly VITE_WEBSOCKET_URL?: string

  /**
   * Socket.io server URL
   * @example "http://localhost:5000"
   */
  readonly VITE_SOCKET_URL?: string

  /**
   * Google Maps API key (optional — for location picker)
   */
  readonly VITE_GOOGLE_MAPS_API_KEY?: string

  /**
   * Cloudinary cloud name (optional — for image uploads)
   */
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string

  /**
   * Environment mode
   */
  readonly VITE_ENVIRONMENT?: 'development' | 'staging' | 'production'

  /**
   * Feature flags (optional)
   */
  readonly VITE_ENABLE_SOCKET?: string
  readonly VITE_ENABLE_ANALYTICS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}