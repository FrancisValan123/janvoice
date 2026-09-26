import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ComplaintProvider } from './context/ComplaintContext'  
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ComplaintProvider>                       
          <App />
        </ComplaintProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)