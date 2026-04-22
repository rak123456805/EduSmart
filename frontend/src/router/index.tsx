import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import AppShell from '@/components/layout/AppShell'
import LandingPage from '@/pages/LandingPage'
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import UpdatePassword from '@/pages/auth/UpdatePassword'
import Dashboard from '@/pages/Dashboard'
import Assignments from '@/pages/Assignments'
import Submissions from '@/pages/Submissions'
import NotificationsPage from '@/pages/NotificationsPage'
import SettingsPage from '@/pages/SettingsPage'
import CreateAssignment from '@/pages/teacher/CreateAssignment'
import ProfilePage from '@/pages/student/ProfilePage'

import { ProtectedRoute, PublicRoute } from '@/router/ProtectedRoute'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* Protected */}
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/assignments/create" element={<CreateAssignment />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
