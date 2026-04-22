import React from 'react'
import { motion } from 'framer-motion'
import { FileSearch } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export default function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-20 h-20 rounded-3xl bg-tertiary flex items-center justify-center mb-6"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        {icon || <FileSearch size={32} className="text-muted" style={{ color: 'var(--text-muted)' }} />}
      </motion.div>
      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="max-w-xs mx-auto mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
      {actionLabel && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
