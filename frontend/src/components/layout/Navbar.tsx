import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Bell, Sun, Moon, Menu, ChevronDown,
  User, Settings, LogOut, CheckCheck, BookOpen
} from 'lucide-react'
import { useNotificationStore } from '@/store/notificationStore'
import { useAuthStore } from '@/store/authStore'
import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'
import { supabase } from '@/lib/supabase'

interface NavbarProps {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate()
  const { user, isDark, toggleTheme } = useAuthStore()

  // Notifications (kept as is)
  const { notifications, markRead, markAllRead } = useNotificationStore()

  const [showNotifs, setShowNotifs] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ✅ Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 z-20 flex items-center px-4 lg:px-8 gap-4 navbar-glass">

      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className={clsx(
          "relative group transition-all duration-300 rounded-2xl overflow-hidden",
          isSearchFocused ? "search-focus ring-2 ring-primary-500/20" : "bg-black/5 dark:bg-white/5"
        )}>
          <Search
            size={18}
            className={clsx(
              "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 shrink-0",
              isSearchFocused ? "text-primary-500" : "text-slate-400"
            )}
          />
          <input
            type="text"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search assignments, students..."
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-transparent outline-none border-none placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">

        {/* Theme */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative group"
        >
          {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Toggle Theme
          </span>
        </motion.button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifs(v => !v)}
            className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
          >
            <Bell size={20} className={showNotifs ? "text-primary-500" : "text-slate-600 dark:text-slate-400"} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-900" />
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 glass-card rounded-2xl shadow-premium overflow-hidden"
              >
                <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]">
                  <h3 className="font-bold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={clsx(
                          "p-4 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors border-b border-black/5 dark:border-white/5 last:border-0",
                          !n.read && "bg-primary-500/[0.03]"
                        )}
                      >
                        <div className="flex gap-3">
                          <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", n.type === 'assignment' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/40')}>
                            {n.type === 'assignment' ? <BookOpen size={14} /> : <Settings size={14} />}
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold leading-tight">{n.title}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{formatDistanceToNow(n.time)} ago</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <Bell size={24} className="mx-auto mb-2 opacity-20" />
                      <p className="text-xs">All caught up!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative ml-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowProfile(v => !v)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-glow bg-gradient-to-br from-primary-500 to-accent-500">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold leading-none">{user?.name?.split(' ')[0] || 'User'}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium capitalize mt-1">{user?.role}</p>
            </div>
            <ChevronDown size={14} className={clsx("text-slate-400 transition-transform duration-200", showProfile && "rotate-180")} />
          </motion.button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-64 glass-card rounded-2xl shadow-premium overflow-hidden"
              >
                <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5">
                  <p className="text-sm font-bold truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                </div>

                <div className="p-1.5">
                  <button
                    onClick={() => { navigate('/profile'); setShowProfile(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <User size={16} /> My Profile
                  </button>
                  <button
                    onClick={() => { navigate('/settings'); setShowProfile(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <Settings size={16} /> Account Settings
                  </button>
                </div>

                <div className="p-1.5 border-t border-black/5 dark:border-white/5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl hover:bg-red-500/10 text-red-500 transition-colors"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  )
}
