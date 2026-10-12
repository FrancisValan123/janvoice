import React from 'react'
import { Outlet } from 'react-router-dom'

/**
 * MainLayout - Root wrapper for public pages
 * Used for: Home, About, Contact, FAQ, Privacy, Terms
 * No sidebar, no auth required
 */
const MainLayout = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f7fa'
      }}
    >
      {/* 
        Public pages render their own header/navbar/footer 
        This layout just provides the container
      */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout