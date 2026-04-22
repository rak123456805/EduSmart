import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, RefreshCw, Zap, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { supabase } from '@/lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/update-password'
      })
      if (error) throw error
      setSubmitted(true)
      toast('Recovery link sent! Check your inbox.', 'success')
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
        <div className="absolute top-[20%] left-[20%] w-[450px] h-[450px] bg-primary-400/15 rounded-full blur-[110px] floating-blob" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-accent-400/15 rounded-full blur-[100px] floating-blob" style={{ animationDelay: '-8s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[480px] glass-card p-10 lg:p-14 text-center"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="flex items-center justify-center gap-3 mb-10 group">
            <div className="w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center shadow-glow transition-all duration-500 group-hover:rotate-12" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #d946ef 100%)' }}>
              <Zap size={24} className="text-white fill-white/20" />
            </div>
            <span className="text-3xl font-display font-black tracking-tighter gradient-text">EduSmart</span>
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="request"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold mb-4 tracking-tight">Forgot Password?</h1>
                <p className="text-sm text-balance leading-relaxed px-2" style={{ color: 'var(--text-secondary)' }}>
                  Enter your email and we'll send you a link to reset your password and regain access.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
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
                      <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                      <span className="font-bold">Send Reset Link</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center text-green-500 mb-8 shadow-glow shadow-green-500/20">
                <CheckCircle2 size={40} className="stroke-[2.5px]" />
              </div>
              <h2 className="text-2xl font-bold mb-3 tracking-tight">Check Your Inbox</h2>
              <p className="text-sm leading-relaxed mb-10 text-balance" style={{ color: 'var(--text-secondary)' }}>
                We've sent a secure password reset link to <span className="font-bold text-slate-800 dark:text-slate-200">{email}</span>. Please follow the instructions to continue.
              </p>
              
              <button
                onClick={() => setSubmitted(false)}
                className="text-primary-600 font-black hover:text-primary-700 underline underline-offset-8 decoration-2 decoration-primary-500/30 hover:decoration-primary-500 transition-all uppercase tracking-wider text-[11px]"
              >
                Didn't receive it? Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
