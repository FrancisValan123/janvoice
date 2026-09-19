import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import CitizenDashboard from './components/citizen/CitizenDashboard'
import OfficerDashboard from './components/officer/OfficerDashboard'
import DepartmentDashboard from './components/department/DepartmentDashboard'
import AuthorityDashboard from './components/higher-auth/AuthorityDashboard'
import AdminDashboard from './components/admin/AdminDashboard'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Role-based dashboards */}
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        <Route path="/department/dashboard" element={<DepartmentDashboard />} />
        <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App