import { useNotificationStore, type Notification } from '@/store/notificationStore'
import { formatDistanceToNow } from 'date-fns'
import { Bell, CheckCheck, Trash2, Search, Filter } from 'lucide-react'
import clsx from 'clsx'

export default function NotificationsPage() {
  const { notifications, markRead, markAllRead } = useNotificationStore()

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Notifications</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage your alerts and staying updated with academic tasks.</p>
        </div>
        <button onClick={markAllRead} className="btn-secondary px-6 py-2.5 h-auto self-start md:self-auto gap-2">
           <CheckCheck size={18} /> Mark all read
        </button>
      </div>

      <div className="card overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50" style={{ borderColor: 'var(--border-color)' }}>
           <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Filter alerts..." className="pl-9 pr-4 py-1.5 rounded-lg text-xs border outline-none bg-white dark:bg-slate-900" style={{ borderColor: 'var(--border-color)' }} />
              </div>
           </div>
           <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg btn-ghost"><Filter size={16} /></button>
              <button className="p-2 rounded-lg btn-ghost text-red-500"><Trash2 size={16} /></button>
           </div>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {notifications.map((n: Notification) => (
            <div 
              key={n.id} 
              onClick={() => markRead(n.id)}
              className={clsx(
                'p-6 flex items-start gap-4 transition-all lg:hover:pl-8 cursor-pointer',
                !n.read ? 'bg-primary-50/30 dark:bg-primary-950/10 border-l-4 border-l-primary-500' : 'bg-transparent'
              )}
            >
              <div className={clsx(
                'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-sm',
                n.type === 'assignment' ? 'bg-blue-500' : n.type === 'approval' ? 'bg-green-500' : n.type === 'rejection' ? 'bg-red-500' : 'bg-amber-500'
              )}>
                <Bell size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                   <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{n.title}</h3>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{formatDistanceToNow(n.time, { addSuffix: true })}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                {!n.read && (
                  <div className="mt-4 flex items-center gap-3">
                     <button className="text-xs font-black uppercase text-primary-600 hover:underline">Mark as read</button>
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                     <button className="text-xs font-black uppercase text-primary-600 hover:underline">View details</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {notifications.length === 0 && (
          <div className="py-20 text-center">
             <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Bell size={32} className="text-slate-300" />
             </div>
             <p className="font-bold text-slate-400">All caught up!</p>
          </div>
        )}
      </div>
    </div>
  )
}
