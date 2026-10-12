/* ===================================
   JANVOICE — TAILWIND CSS v4 CONFIG
   =================================== */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F0',
          100: '#FFE8D6',
          200: '#FFD4B5',
          300: '#FFB088',
          400: '#FF8A5B',
          500: '#FF6B35',
          600: '#E55A2B',
          700: '#C44A24',
          800: '#A33C1E',
          900: '#823018'
        },
        secondary: {
          400: '#F7931E',
          500: '#DD7A0F'
        },
        success: '#38A169',
        warning: '#ED8936',
        danger: '#E53E3E',
        info: '#4299E1',
        purple: '#805AD5'
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}