import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, UserPlus, GraduationCap, BookOpen, Zap, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/Toast'
import { supabase } from '@/lib/supabase'

export default function Signup() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'student' as 'student' | 'teacher' 
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast('Passwords do not match', 'error')
      return
    }

    setLoading(true)
    console.log("Signup triggered")
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role
          }
        }
      })
      if (error) throw error
      
      if (data.user) {
        await supabase.from('profiles').insert([
          {
            id: data.user.id,
            name: formData.name,
            email: formData.email,
            role: formData.role
          }
        ])
      }

      toast('Account created! Please verify your email.', 'success')
      navigate('/login')
    } catch (error: any) {
      console.error("Signup error detail:", error)
      toast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-mesh relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-400/20 rounded-full blur-[140px] floating-blob" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent-400/20 rounded-full blur-[120px] floating-blob" style={{ animationDelay: '-7s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[560px] glass-card p-8 md:p-12 my-12"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center shadow-glow transition-all duration-500 group-hover:rotate-12" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #d946ef 100%)' }}>
                <Zap size={24} className="text-white fill-white/20" />
              </div>
              <span className="text-3xl font-display font-black tracking-tighter gradient-text">EduSmart</span>
            </Link>
          </motion.div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Create Account</h1>
          <p className="text-sm text-center text-balance leading-relaxed px-4" style={{ color: 'var(--text-secondary)' }}>
            Join the next generation of learners and educators.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Enhanced Role Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group h-full ${formData.role === 'student' ? 'border-primary-500 bg-primary-500/[0.03] dark:bg-primary-500/[0.05]' : 'border-transparent bg-slate-100/50 dark:bg-slate-800/50'}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${formData.role === 'student' ? 'bg-primary-500 text-white shadow-glow' : 'bg-white dark:bg-slate-700 text-slate-400'}`}>
                <BookOpen size={22} />
              </div>
              <p className={`font-black text-xs uppercase tracking-widest ${formData.role === 'student' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}>Student</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug font-medium">Learn, submit & track your progress.</p>
              {formData.role === 'student' && (
                <motion.div layoutId="activeRole" className="absolute top-4 right-4 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setFormData({ ...formData, role: 'teacher' })}
              className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group h-full ${formData.role === 'teacher' ? 'border-primary-500 bg-primary-500/[0.03] dark:bg-primary-500/[0.05]' : 'border-transparent bg-slate-100/50 dark:bg-slate-800/50'}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${formData.role === 'teacher' ? 'bg-primary-500 text-white shadow-glow' : 'bg-white dark:bg-slate-700 text-slate-400'}`}>
                <GraduationCap size={22} />
              </div>
              <p className={`font-black text-xs uppercase tracking-widest ${formData.role === 'teacher' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}>Teacher</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug font-medium">Manage students, tasks & grading.</p>
              {formData.role === 'teacher' && (
                <motion.div layoutId="activeRole" className="absolute top-4 right-4 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}
            </motion.button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="auth-label ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors shrink-0" size={20} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="input-field input-field-icon h-13"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="auth-label ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors shrink-0" size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="input-field input-field-icon h-13"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="auth-label ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors shrink-0" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
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

              <div className="space-y-2">
                <label className="auth-label ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors shrink-0" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="input-field input-field-icon h-13 pr-12"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-1">
            <input 
              type="checkbox" 
              id="terms"
              required 
              className="w-4.5 h-4.5 mt-0.5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" 
            />
            <label htmlFor="terms" className="text-[11px] leading-relaxed cursor-pointer select-none" style={{ color: 'var(--text-secondary)' }}>
              I agree to the <Link to="/" className="text-primary-600 font-bold hover:underline">Terms of Service</Link> and <Link to="/" className="text-primary-600 font-bold hover:underline">Privacy Policy</Link>.
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
                <UserPlus size={20} className="group-hover:translate-x-1 transition-transform" />
                <span className="font-bold">Create Account</span>
                <ChevronRight size={18} className="ml-auto group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Already have an account? {' '}
            <Link to="/login" className="font-black text-primary-600 hover:text-primary-700 transition-colors underline underline-offset-8 decoration-2 decoration-primary-500/30 hover:decoration-primary-500">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
