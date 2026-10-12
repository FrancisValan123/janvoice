import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Styles — import order matters
import './styles/variables.css'
import './styles/global.css'
import './styles/theme.css'
import './styles/animations.css'
import './styles/responsive.css'

// ===================================
// THEME INITIALIZATION (Dark Mode)
// Runs BEFORE React renders so there's no flash of light theme
// ===================================
const applyInitialTheme = () => {
  const savedTheme = localStorage.getItem('janvoice_theme')
  const savedPrefs = localStorage.getItem('janvoice_preferences')

  let theme = savedTheme

  // Fall back to preferences object if janvoice_theme isn't set
  if (!theme && savedPrefs) {
    try {
      theme = JSON.parse(savedPrefs).theme
    } catch {
      theme = 'light'
    }
  }

  if (!theme) theme = 'light'

  const root = document.documentElement
  const body = document.body

  if (theme === 'dark') {
    root.classList.add('dark-mode')
    body.classList.add('dark-mode')
  } else if (theme === 'auto') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDark) {
      root.classList.add('dark-mode')
      body.classList.add('dark-mode')
    }
  }
}

applyInitialTheme()

// ===================================
// RENDER APP
// ===================================
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)