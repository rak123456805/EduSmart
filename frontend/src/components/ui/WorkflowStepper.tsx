import { motion } from 'framer-motion'
import { Check, X, Clock, User } from 'lucide-react'
import { WorkflowStep } from '@/store/assignmentStore'
import { format } from 'date-fns'
import clsx from 'clsx'

interface WorkflowStepperProps {
  steps: WorkflowStep[]
  currentStep: number
}

export default function WorkflowStepper({ steps, currentStep }: WorkflowStepperProps) {
  return (
    <div className="flex flex-col gap-6">
      {steps.map((step, idx) => {
        const isCompleted = step.status === 'approved' || idx < currentStep
        const isCurrent = step.status === 'current' || idx === currentStep
        const isRejected = step.status === 'rejected'
        const isPending = step.status === 'pending' && idx > currentStep

        return (
          <div key={step.id} className="relative flex gap-4">
            {/* Step Line */}
            {idx !== steps.length - 1 && (
              <div className={clsx(
                'absolute left-4 top-8 w-[2px] h-full -ml-[1px]',
                isCompleted ? 'bg-green-500' : isRejected ? 'bg-red-500' : 'bg-border-color'
              )} style={{ background: isCompleted ? '#22c55e' : isRejected ? '#ef4444' : 'var(--border-color)' }} />
            )}

            {/* Icon */}
            <div className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 transition-all duration-500',
              isCompleted ? 'bg-green-500 text-white' : 
              isRejected ? 'bg-red-500 text-white' : 
              isCurrent ? 'bg-primary-500 text-white shadow-glow' : 
              'bg-tertiary text-muted'
            )} style={{ 
              background: isCompleted ? '#22c55e' : isRejected ? '#ef4444' : isCurrent ? '#3b82f6' : 'var(--bg-tertiary)',
              color: (isCompleted || isRejected || isCurrent) ? 'white' : 'var(--text-muted)'
            }}>
              {isCompleted ? <Check size={16} /> : 
               isRejected ? <X size={16} /> : 
               isCurrent ? <Clock size={16} /> : 
               <span className="text-xs font-bold">{idx + 1}</span>}
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold" style={{ color: isCurrent ? '#3b82f6' : 'var(--text-primary)' }}>
                  {step.role} Approval
                </h4>
                {step.timestamp && (
                  <span className="text-[10px] uppercase font-bold tracking-tighter" style={{ color: 'var(--text-muted)' }}>
                    {format(step.timestamp, 'MMM d, h:mm a')}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    'text-[11px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md',
                    isCompleted ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 
                    isRejected ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400' : 
                    isCurrent ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' : 
                    'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  )}>
                    {step.status}
                  </span>
                  {step.actor && (
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <User size={12} />
                      <span className="font-medium">{step.actor}</span>
                    </div>
                  )}
                </div>

                {step.comment && (
                  <div className="p-3 rounded-xl border bg-white dark:bg-slate-900/50" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-xs leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
                      "{step.comment}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
