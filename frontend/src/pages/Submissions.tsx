import { useAuthStore } from '@/store/authStore'
import StudentDashboard from './student/StudentDashboard'
import TeacherDashboard from './teacher/TeacherDashboard'

export default function Submissions() {
  const { user } = useAuthStore()
  // Reusing components but focusing on submission tables/grids
  return user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />
}
