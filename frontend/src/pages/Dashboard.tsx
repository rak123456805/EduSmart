import { useAuthStore } from '@/store/authStore'
import StudentDashboard from './student/StudentDashboard'
import TeacherDashboard from './teacher/TeacherDashboard'
import { Navigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />
}
