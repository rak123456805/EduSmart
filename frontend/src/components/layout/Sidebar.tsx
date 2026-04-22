import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, FileText, Upload, Bell, Settings,
  BookOpen, GraduationCap, Zap, LogOut, X, ChevronRight
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import clsx from 'clsx'

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

const teacherLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/assignments', icon: FileText, label: 'Assignments' },
  { to: '/submissions', icon: Upload, label: 'Submissions' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

const studentLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/assignments', icon: FileText, label: 'Assignments' },
  { to: '/submissions', icon: Upload, label: 'My Submissions' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const links = user?.role === 'teacher' ? teacherLinks : studentLinks

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #d946ef 100%)' }}>
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <span className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>EduSmart</span>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {user?.role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
          </p>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 mx-3 mt-4 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-4 mt-3 mb-1">
        <div className="flex items-center gap-2">
          {user?.role === 'teacher' ? <GraduationCap size={13} className="text-primary-500" /> : <BookOpen size={13} className="text-primary-500" />}
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-500">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) => clsx('sidebar-link group', isActive && 'active')}
          >
            <link.icon size={18} className="flex-shrink-0 transition-transform group-hover:scale-110" />
            <span className="flex-1">{link.label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 z-30 border-r"
        style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-64 h-full z-50 border-r"
            style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 btn-ghost p-1.5 rounded-lg">
              <X size={18} />
            </button>
            <SidebarContent />
          </motion.aside>
        </div>
      )}
    </>
  )
}
