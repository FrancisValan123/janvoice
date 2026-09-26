import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Profile from './components/citizen/Profile'
import ForgotPassword from './components/auth/ForgotPassword'
import CitizenDashboard from './components/citizen/CitizenDashboard'
import SubmitComplaint from './components/citizen/SubmitComplaint'
import MyComplaints from './components/citizen/MyComplaints'
import TrackComplaint from './components/citizen/TrackComplaint'
import ComplaintDetails from './components/citizen/ComplaintDetails'
import Notifications from './components/citizen/Notifications' 
import FeedbackForm from './components/citizen/FeedbackForm'         
import OfficerDashboard from './components/officer/OfficerDashboard'
import DepartmentDashboard from './components/department/DepartmentDashboard'
import AuthorityDashboard from './components/higher-auth/AuthorityDashboard'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminLayout from './components/admin/AdminLayout'
import UserManagement from './components/admin/UserManagement'
import DepartmentManagement from './components/admin/DepartmentManagement'
import CategoryManagement from './components/admin/CategoryManagement'
import AuditLog from './components/admin/AuditLog'
import SystemSettings from './components/admin/SystemSettings'

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
        <Route path="/citizen/profile" element={<Profile />} />
        <Route path="/citizen/submit" element={<SubmitComplaint />} />
        <Route path="/citizen/complaints" element={<MyComplaints />} />
        <Route path="/citizen/track" element={<TrackComplaint />} />
        <Route path="/citizen/complaints/:id" element={<ComplaintDetails />} />
        <Route
  path="/citizen/notifications"
  element={
    <ProtectedRoute allowedRoles={['citizen']}>
      <Notifications />
    </ProtectedRoute>
  }
/>
<Route
  path="/citizen/feedback/:complaintId"
  element={
    <ProtectedRoute allowedRoles={['citizen']}>
      <FeedbackForm />
    </ProtectedRoute>
  }
/>
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        <Route path="/department/dashboard" element={<DepartmentDashboard />} />
        <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
        {/* Admin Nested Routes */}
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<Navigate to="/admin/dashboard" replace />} />
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="users" element={<UserManagement />} />
  <Route path="departments" element={<DepartmentManagement />} />
<Route path="categories" element={<CategoryManagement />} />
<Route path="audit" element={<AuditLog />} />
<Route path="settings" element={<SystemSettings />} />
</Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App