import { create } from 'zustand'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'assignment' | 'submission' | 'approval' | 'rejection' | 'info'
  read: boolean
  time: Date
}

interface NotificationState {
  notifications: Notification[]
  markRead: (id: string) => void
  markAllRead: () => void
  addNotification: (n: Omit<Notification, 'id' | 'time'>) => void
}

const DEMO_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'New Assignment Posted', message: 'Math Homework #5 has been posted by Dr. Smith', type: 'assignment', read: false, time: new Date(Date.now() - 1000 * 60 * 5) },
  { id: '2', title: 'Submission Approved ✓', message: 'Your Physics Lab Report was approved by HOD', type: 'approval', read: false, time: new Date(Date.now() - 1000 * 60 * 30) },
  { id: '3', title: 'Submission Rejected', message: 'Your CS Project needs revision — check feedback', type: 'rejection', read: false, time: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: '4', title: 'Under Review', message: 'Your English Essay is now under review by your Guide', type: 'submission', read: true, time: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: '5', title: 'Deadline Reminder ⏰', message: 'Operating Systems assignment due in 2 hours!', type: 'info', read: true, time: new Date(Date.now() - 1000 * 60 * 60 * 8) },
]

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: DEMO_NOTIFICATIONS,
  markRead: (id) => set((s) => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),
  addNotification: (n) => set((s) => ({
    notifications: [{ ...n, id: Date.now().toString(), time: new Date() }, ...s.notifications],
  })),
}))
