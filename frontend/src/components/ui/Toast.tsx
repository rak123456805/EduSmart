import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react'
import clsx from 'clsx'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border min-w-[300px] glass',
                t.type === 'success' && 'border-green-500/50',
                t.type === 'error' && 'border-red-500/50',
                t.type === 'warning' && 'border-yellow-500/50',
                t.type === 'info' && 'border-blue-500/50'
              )}
            >
              <div className={clsx(
                'flex-shrink-0',
                t.type === 'success' && 'text-green-500',
                t.type === 'error' && 'text-red-500',
                t.type === 'warning' && 'text-yellow-500',
                t.type === 'info' && 'text-blue-500'
              )}>
                {t.type === 'success' && <CheckCircle2 size={18} />}
                {t.type === 'error' && <XCircle size={18} />}
                {t.type === 'warning' && <AlertCircle size={18} />}
                {t.type === 'info' && <Info size={18} />}
              </div>
              <p className="flex-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {t.message}
              </p>
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export default ToastProvider
