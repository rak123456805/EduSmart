import { useAuthStore } from '@/store/authStore'
import StudentDashboard from './student/StudentDashboard'
import TeacherDashboard from './teacher/TeacherDashboard'

export default function Assignments() {
  const { user } = useAuthStore()
  // Reusing components to maintain layout consistency as per requirements
  return user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />
}
