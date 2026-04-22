import { useAuthStore } from '@/store/authStore'
import { User, Mail, Shield, Bell, Settings, Moon, Sun, Monitor, Laptop, Zap, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import clsx from 'clsx'

export default function SettingsPage() {
  const { user, isDark, toggleTheme } = useAuthStore()
  const { toast } = useToast()

  const handleSave = () => {
    toast('Settings saved successfully', 'success')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Account Settings</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage your personal information, security, and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Nav Sidebar */}
        <div className="lg:col-span-4 space-y-2">
           {[
             { icon: User, label: 'Profile' },
             { icon: Bell, label: 'Notifications' },
             { icon: Shield, label: 'Privacy & Security' },
             { icon: Monitor, label: 'Appearance' },
             { icon: Laptop, label: 'Integrations' },
           ].map((item, i) => (
             <button key={item.label} className={clsx(
               'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all',
               i === 3 ? 'bg-white dark:bg-slate-800 shadow-sm text-primary-600 border' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
             )} style={{ borderColor: i === 3 ? 'var(--border-color)' : 'transparent' }}>
                <item.icon size={18} /> {item.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="card p-8 bg-white dark:bg-slate-900 border">
             <h2 className="text-xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>Appearance</h2>
             <p className="text-sm text-slate-500 mb-8">Customize how EduSmart looks on your device.</p>
             
             <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Theme Preference</p>
                      <p className="text-xs text-slate-400 mt-0.5">Switch between light and dark mode</p>
                   </div>
                   <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border" style={{ borderColor: 'var(--border-color)' }}>
                      <button 
                        onClick={() => !isDark || toggleTheme()}
                        className={clsx('flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all', !isDark ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400')}
                      >
                         <Sun size={14} /> Light
                      </button>
                      <button 
                        onClick={() => isDark || toggleTheme()}
                        className={clsx('flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all', isDark ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400')}
                      >
                         <Moon size={14} /> Dark
                      </button>
                   </div>
                </div>

                <div className="pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
                   <h3 className="text-sm font-black mb-6 uppercase tracking-widest text-slate-400">Profile Details</h3>
                   <div className="space-y-6">
                      <div className="flex gap-6 items-center">
                         <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-glow">
                            {user?.name.charAt(0)}
                         </div>
                         <button className="btn-secondary px-6 py-2 text-xs h-auto">Change Avatar</button>
                         <button className="text-xs font-bold text-red-500 hover:scale-105 transition-transform">Remove</button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                         <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
                            <input type="text" defaultValue={user?.name} className="input-field py-2.5" />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
                            <input type="email" defaultValue={user?.email} className="input-field py-2.5" />
                         </div>
                      </div>

                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Department</label>
                         <input type="text" defaultValue={user?.department} className="input-field py-2.5" />
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
                   <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg"><Zap size={20} /></div>
                         <div>
                            <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>EduSmart Pro</p>
                            <p className="text-xs text-blue-600/70 font-medium">Your account is currently on the professional plan.</p>
                         </div>
                      </div>
                      <button className="btn-primary py-2 px-6 text-xs h-auto bg-blue-600 block flex-shrink-0">Upgrade</button>
                   </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 pt-4">
                   <button className="btn-secondary px-6">Cancel</button>
                   <button onClick={handleSave} className="btn-primary px-8">Save Changes</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
