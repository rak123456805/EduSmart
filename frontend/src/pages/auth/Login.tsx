import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, GraduationCap, BookOpen, Zap, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'student' | 'teacher'>('student')

  const { toast } = useToast()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile) {
        toast('Profile not found. Please signup again.', 'error')
        return
      }

      if (profile?.role === role) {
        setUser({
          id: data.user.id,
          name: profile.name,
          email: data.user.email || '',
          role: profile.role
        })
        toast('Login successful', 'success')
        navigate('/dashboard')
      } else {
        toast(`You are not authorized to login as ${role}`, 'error')
        await supabase.auth.signOut()
      }
    } catch (error: any) {
      toast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-mesh relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-[120px] floating-blob" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-accent-400/20 rounded-full blur-[100px] floating-blob" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[80px] floating-blob" style={{ animationDelay: '-10s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[480px] glass-card p-8 md:p-12"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center shadow-glow transition-all duration-500 group-hover:rotate-12" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #d946ef 100%)' }}>
                <Zap size={28} className="text-white fill-white/20" />
              </div>
              <span className="text-4xl font-display font-black tracking-tighter gradient-text">EduSmart</span>
            </Link>
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Welcome back</h1>
          <p className="text-sm text-balance text-center leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Empowering your academic journey with smart automation.
          </p>
        </div>

        {/* Premium Role Switcher */}
        <div className="relative flex p-1.5 rounded-2xl mb-10 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/10">
          <div 
            className="absolute top-1.5 bottom-1.5 transition-all duration-300 ease-[0.34,1.56,0.64,1] rounded-xl shadow-premium bg-white dark:bg-slate-700"
            style={{ 
              width: 'calc(50% - 6px)',
              left: role === 'student' ? '6px' : 'calc(50%)'
            }}
          />
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 relative z-10 flex items-center justify-center gap-2.5 py-2.5 text-sm font-bold transition-colors duration-300 ${role === 'student' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
          >
            <BookOpen size={18} /> Student
          </button>
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`flex-1 relative z-10 flex items-center justify-center gap-2.5 py-2.5 text-sm font-bold transition-colors duration-300 ${role === 'teacher' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
          >
            <GraduationCap size={18} /> Teacher
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="auth-label ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors shrink-0" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="input-field input-field-icon h-13"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end ml-1">
                <label className="auth-label mb-0">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-wider">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors shrink-0" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field input-field-icon h-13 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4.5 h-4.5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer" 
            />
            <label htmlFor="remember" className="text-xs font-semibold cursor-pointer select-none" style={{ color: 'var(--text-secondary)' }}>
              Keep me signed in for 30 days
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.01, translateY: -2 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="btn-primary w-full h-13 flex items-center justify-center gap-3 text-base shadow-glow group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                <span className="font-bold">Sign In</span>
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            New to EduSmart? {' '}
            <Link to="/signup" className="font-black text-primary-600 hover:text-primary-700 transition-colors underline underline-offset-8 decoration-2 decoration-primary-500/30 hover:decoration-primary-500">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
