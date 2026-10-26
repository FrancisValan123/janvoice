import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// ===================================
// CONTEXT PROVIDERS
// ===================================
import { AuthProvider } from './context/AuthContext'
import { ComplaintProvider } from './context/ComplaintContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// ===================================
// LAYOUTS
// ===================================
import MainLayout from './layout/MainLayout'
import AuthLayout from './layout/AuthLayout'
import AdminLayout from './layout/AdminLayout'

// ===================================
// PUBLIC PAGES
// ===================================
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'

// ===================================
// AUTH PAGES
// ===================================
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import OTPVerification from './components/auth/OTPVerification'
import Logout from './components/auth/Logout'

// ===================================
// CITIZEN PAGES
// ===================================
import CitizenDashboard from './components/citizen/CitizenDashboard'
import CitizenProfile from './components/citizen/Profile'
import SubmitComplaint from './components/citizen/SubmitComplaint'
import MyComplaints from './components/citizen/MyComplaints'
import ComplaintList from './components/citizen/ComplaintList'
import ComplaintHistory from './components/citizen/ComplaintHistory'
import ComplaintDetails from './components/citizen/ComplaintDetails'
import TrackComplaint from './components/citizen/TrackComplaint'
import Notifications from './components/citizen/Notifications'
import FeedbackForm from './components/citizen/FeedbackForm'
import EmergencyComplaint from './components/citizen/EmergencyComplaint'
import EvidenceUpload from './components/citizen/EvidenceUpload'

// ===================================
// OFFICER PAGES
// ===================================
import OfficerDashboard from './components/officer/OfficerDashboard'
import AssignedComplaints from './components/officer/AssignedComplaints'
import ComplaintInvestigation from './components/officer/ComplaintInvestigation'
import StatusUpdate from './components/officer/StatusUpdate'
import ActionEvidence from './components/officer/ActionEvidence'
import RequestReassignment from './components/officer/RequestReassignment'
import ComplaintNotes from './components/officer/ComplaintNotes'
import EscalationRequest from './components/officer/EscalationRequest'
import PerformanceMetrics from './components/officer/PerformanceMetrics'
import ResolutionReport from './components/officer/ResolutionReport'

// ===================================
// DEPARTMENT PAGES
// ===================================
import DepartmentDashboard from './components/department/DepartmentDashboard'
import AssignOfficers from './components/department/AssignOfficers'
import MonitorDeadlines from './components/department/MonitorDeadlines'
import EscalateCases from './components/department/EscalateCases'
import EscalateSingleCase from './components/department/EscalateSingleCase'
import DepartmentStats from './components/department/DepartmentStats'
import ComplaintAnalytics from './components/department/ComplaintAnalytics'
import OfficerPerformance from './components/department/OfficerPerformance'
import ResourceAllocation from './components/department/ResourceAllocation'
import SLAReports from './components/department/SLAReports'
import DepartmentSettings from './components/department/DepartmentSettings'
import DepartmentProfile from './components/department/DepartmentProfile'
import DepartmentComplaintDetails from './components/department/DepartmentComplaintDetails'

// ===================================
// HIGHER AUTHORITY PAGES
// ===================================
import AuthorityDashboard from './components/higher-auth/AuthorityDashboard'
import EscalatedComplaints from './components/higher-auth/EscalatedComplaints'
import PerformanceMonitor from './components/higher-auth/PerformanceMonitor'
import OverdueReview from './components/higher-auth/OverdueReview'
import DepartmentComparison from './components/higher-auth/DepartmentComparison'
import ActionTakenReport from './components/higher-auth/ActionTakenReport'
import MonthlyStatistics from './components/higher-auth/MonthlyStatistics'
import RecommendationSystem from './components/higher-auth/RecommendationSystem'
import AuthorityProfile from './components/higher-auth/AuthorityProfile'
import AuthoritySettings from './components/higher-auth/AuthoritySettings'

// ✅ NEW IMPORT: Higher Authority Complaint Details
import AuthorityComplaintDetails from './components/higher-auth/AuthorityComplaintDetails'

// ===================================
// ADMIN PAGES
// ===================================
import AdminDashboard from './components/admin/AdminDashboard'
import UserManagement from './components/admin/UserManagement'
import DepartmentManagement from './components/admin/DepartmentManagement'
import RoleManagement from './components/admin/RoleManagement'
import AuditLog from './components/admin/AuditLog'
import Backups from './components/admin/Backups'
import AnalyticsOverview from './components/admin/AnalyticsOverview'
import SystemHealth from './components/admin/SystemHealth'
import SystemSettings from './components/admin/SystemSettings'

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <Routes>
          {/* ===================================
              PUBLIC PAGES
              =================================== */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Route>

          {/* ===================================
              AUTH PAGES
              =================================== */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
          </Route>

          <Route path="/logout" element={<Logout />} />

          {/* ===================================
              CITIZEN ROUTES (Protected)
              =================================== */}
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/profile"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <CitizenProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/submit"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <SubmitComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/complaints"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <MyComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/complaints/list"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <ComplaintList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/complaints/:id"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <ComplaintDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/history"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <ComplaintHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/track"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <TrackComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/emergency"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <EmergencyComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/evidence"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <EvidenceUpload />
              </ProtectedRoute>
            }
          />
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

          {/* ===================================
              OFFICER ROUTES (Protected)
              =================================== */}
          <Route
            path="/officer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/assigned"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <AssignedComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/investigate"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <Navigate to="/officer/assigned" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/case/:id"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <ComplaintInvestigation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/investigate/:id"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <ComplaintInvestigation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/status/:id"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <StatusUpdate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/evidence/:id"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <ActionEvidence />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/evidence"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <ActionEvidence />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/reassign/:id"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <RequestReassignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/reassign"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <RequestReassignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/notes/:id"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <ComplaintNotes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/notes"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <ComplaintNotes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/escalate/:id"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <EscalationRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/escalate"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <EscalationRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/performance"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <PerformanceMetrics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/report/:id"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <ResolutionReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/report"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <ResolutionReport />
              </ProtectedRoute>
            }
          />

          {/* ===================================
              DEPARTMENT ADMIN ROUTES (Protected)
              =================================== */}
          <Route
            path="/department/dashboard"
            element={
              <ProtectedRoute allowedRoles={['department_admin']}>
                <DepartmentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department/profile"
            element={
              <ProtectedRoute allowedRoles={['department_admin']}>
                <DepartmentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department/assign"
            element={
              <ProtectedRoute allowedRoles={['department_admin']}>
                <AssignOfficers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department/deadlines"
            element={
              <ProtectedRoute allowedRoles={['department_admin']}>
                <MonitorDeadlines />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/department/complaints/:id"
            element={
              <ProtectedRoute allowedRoles={['department_admin']}>
                <DepartmentComplaintDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/department/escalate"
            element={
              <ProtectedRoute allowedRoles={['department_admin']}>
                <EscalateCases />
              </ProtectedRoute>
            }
          />

          <Route
            path="/department/escalate/:id"
            element={
              <ProtectedRoute allowedRoles={['department_admin']}>
                <EscalateSingleCase />
              </ProtectedRoute>
            }
          />

          <Route
            path="/department/stats"
            element={
              <ProtectedRoute allowedRoles={['department_admin']}>
                <DepartmentStats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department/analytics"
            element={
              <ProtectedRoute allowedRoles={['department_admin']}>
                <ComplaintAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department/officers"
            element={
              <ProtectedRoute allowedRoles={['department_admin']}>
                <OfficerPerformance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department/allocation"
            element={
              <ProtectedRoute allowedRoles={['department_admin']}>
                <ResourceAllocation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department/sla"
            element={
              <ProtectedRoute allowedRoles={['department_admin']}>
                <SLAReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department/settings"
            element={
              <ProtectedRoute allowedRoles={['department_admin']}>
                <DepartmentSettings />
              </ProtectedRoute>
            }
          />

          {/* ===================================
              HIGHER AUTHORITY ROUTES (Protected)
              =================================== */}
          <Route
            path="/authority/dashboard"
            element={
              <ProtectedRoute allowedRoles={['higher_authority']}>
                <AuthorityDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/profile"
            element={
              <ProtectedRoute allowedRoles={['higher_authority']}>
                <AuthorityProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/settings"
            element={
              <ProtectedRoute allowedRoles={['higher_authority']}>
                <AuthoritySettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/escalated"
            element={
              <ProtectedRoute allowedRoles={['higher_authority']}>
                <EscalatedComplaints />
              </ProtectedRoute>
            }
          />

          {/* ✅ FIXED: Use the dedicated AuthorityComplaintDetails component */}
          <Route
            path="/authority/complaints/:id"
            element={
              <ProtectedRoute allowedRoles={['higher_authority']}>
                <AuthorityComplaintDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/authority/performance"
            element={
              <ProtectedRoute allowedRoles={['higher_authority']}>
                <PerformanceMonitor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/overdue"
            element={
              <ProtectedRoute allowedRoles={['higher_authority']}>
                <OverdueReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/departments"
            element={
              <ProtectedRoute allowedRoles={['higher_authority']}>
                <DepartmentComparison />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/reports"
            element={
              <ProtectedRoute allowedRoles={['higher_authority']}>
                <ActionTakenReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/statistics"
            element={
              <ProtectedRoute allowedRoles={['higher_authority']}>
                <MonthlyStatistics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/recommendations"
            element={
              <ProtectedRoute allowedRoles={['higher_authority']}>
                <RecommendationSystem />
              </ProtectedRoute>
            }
          />

          {/* ===================================
              ADMIN ROUTES (Nested with AdminLayout)
              =================================== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['system_admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="audit" element={<AuditLog />} />
            <Route path="backups" element={<Backups />} />
            <Route path="analytics" element={<AnalyticsOverview />} />
            <Route path="health" element={<SystemHealth />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>

          {/* ===================================
              ERROR ROUTES
              =================================== */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ComplaintProvider>
    </AuthProvider>
  )
}

export default App