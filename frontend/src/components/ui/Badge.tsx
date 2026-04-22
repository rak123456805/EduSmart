import { AssignmentStatus } from '@/store/assignmentStore'
import clsx from 'clsx'

interface BadgeProps {
  status: AssignmentStatus | 'late'
  className?: string
}

export default function Badge({ status, className }: BadgeProps) {
  const label = status === 'review' ? 'Under Review' : status.charAt(0).toUpperCase() + status.slice(1)
  
  return (
    <span className={clsx(
      'badge',
      status === 'pending' && 'badge-pending',
      status === 'submitted' && 'badge-submitted',
      status === 'review' && 'badge-review',
      status === 'rejected' && 'badge-rejected',
      status === 'approved' && 'badge-approved',
      status === 'late' && 'badge-late',
      className
    )}>
      {label}
    </span>
  )
}
