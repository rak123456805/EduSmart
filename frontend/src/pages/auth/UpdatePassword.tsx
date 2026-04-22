import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Zap, Save, ChevronRight, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/Toast'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast('Passwords do not match', 'error')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      toast('Password updated successfully', 'success')
      navigate('/login')
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
        <div className="absolute top-[10%] left-[15%] w-[450px] h-[450px] bg-primary-400/20 rounded-full blur-[110px] floating-blob" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] bg-accent-400/20 rounded-full blur-[100px] floating-blob" style={{ animationDelay: '-12s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[480px] glass-card p-10 lg:p-14 text-center"
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
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Set New Password</h1>
          <p className="text-sm text-balance text-center leading-relaxed px-2" style={{ color: 'var(--text-secondary)' }}>
            Choose a strong password to secure your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="auth-label ml-1">New Password</label>
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
            <div className="space-y-2">
              <label className="auth-label ml-1">Confirm New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors shrink-0" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field input-field-icon h-13 pr-12"
                />
              </div>
            </div>
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
                <Save size={20} className="group-hover:translate-x-1 transition-transform" />
                <span className="font-bold">Update Password</span>
                <ChevronRight size={18} className="ml-auto group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: 'var(--border-color)' }}>
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
