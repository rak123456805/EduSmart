import { motion } from 'framer-motion'
import { Zap, AlertTriangle, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

interface AIDetectionPanelProps {
  score: number
}

export default function AIDetectionPanel({ score }: AIDetectionPanelProps) {
  const getStatus = () => {
    if (score < 30) return { label: 'Low Probability', color: 'text-green-500', bg: 'bg-green-500', icon: CheckCircle2, message: 'Content appears to be human-written.' }
    if (score < 70) return { label: 'Moderate Probability', color: 'text-yellow-500', bg: 'bg-yellow-500', icon: AlertTriangle, message: 'Partial match with known AI patterns found.' }
    return { label: 'High Probability', color: 'text-red-500', bg: 'bg-red-500', icon: Zap, message: 'Significant AI-generated patterns detected. Review recommended.' }
  }

  const { label, color, bg, icon: Icon, message } = getStatus()

  return (
    <div className="card p-6 border-l-4" style={{ borderLeftColor: color === 'text-red-500' ? '#ef4444' : color === 'text-yellow-500' ? '#eab308' : '#22c55e' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-opacity-10', bg.replace('bg-', 'bg-opacity-10 bg-'))}>
            <Icon size={18} className={color} />
          </div>
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>AI Detection Scan</h3>
        </div>
        <span className={clsx('text-lg font-black', color)}>{score}%</span>
      </div>

      <div className="progress-bar mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={clsx('progress-bar-fill', bg)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{message}</p>
      </div>

      {score > 70 && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
          <p className="text-[11px] text-red-600 dark:text-red-400 font-medium leading-relaxed">
            Warning: This submission exceeds the 70% AI detection threshold. Please verify original sources and check for plagiarism.
          </p>
        </div>
      )}
    </div>
  )
}
