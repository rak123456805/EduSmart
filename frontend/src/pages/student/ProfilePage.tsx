import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Mail, GraduationCap, Building2, 
  Hash, Calendar, Link as LinkIcon, Save,
  AlertCircle, CheckCircle2
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/Toast'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    rollno: '',
    branch: '',
    department: '',
    sem: 1,
    pass_year: new Date().getFullYear() + 4,
    email: '',
    google_drive_link: ''
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          ...data,
          google_drive_link: data.google_drive_link || ''
        })
      } else {
        // If not found, pre-fill with auth data
        setFormData(prev => ({
          ...prev,
          first_name: user.name.split(' ')[0] || '',
          last_name: user.name.split(' ').slice(1).join(' ') || '',
          email: user.email
        }))
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, student_id: user.id })
      })

      if (response.ok) {
        toast('Profile updated successfully!', 'success')
      } else {
        toast('Failed to update profile', 'error')
      }
    } catch (error) {
      toast('Connection error', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-black tracking-tight gradient-text mb-2">My Profile</h1>
        <p className="text-slate-500 font-medium">Manage your personal information and academic details.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="w-24 h-24 rounded-3xl bg-primary-500 text-white flex items-center justify-center text-4xl font-black mx-auto mb-4 shadow-glow">
              {formData.first_name?.[0] || user?.name?.[0]}
            </div>
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formData.first_name} {formData.last_name}
            </h3>
            <p className="text-sm font-bold text-primary-500 uppercase tracking-widest mt-1">Student</p>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Mail size={16} />
                <span className="truncate">{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Hash size={16} />
                <span>{formData.rollno || 'Not set'}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex items-start gap-4">
            <AlertCircle className="text-amber-500 mt-1 flex-shrink-0" size={18} />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Make sure your Google Drive folder is set to <strong>Public</strong> so mentors can access your files.
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="card p-8 space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    value={formData.first_name}
                    onChange={e => setFormData({...formData, first_name: e.target.value})}
                    className="input-field pl-10" 
                    placeholder="John"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Last Name</label>
                <input 
                  type="text" 
                  value={formData.last_name}
                  onChange={e => setFormData({...formData, last_name: e.target.value})}
                  className="input-field" 
                  placeholder="Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">USN / Roll Number</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    value={formData.rollno}
                    onChange={e => setFormData({...formData, rollno: e.target.value})}
                    className="input-field pl-10" 
                    placeholder="1XX21CS000"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Branch</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    value={formData.branch}
                    onChange={e => setFormData({...formData, branch: e.target.value})}
                    className="input-field pl-10" 
                    placeholder="Computer Science"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                    className="input-field pl-10" 
                    placeholder="Engineering"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Semester</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select 
                    value={formData.sem}
                    onChange={e => setFormData({...formData, sem: parseInt(e.target.value)})}
                    className="input-field pl-10 bg-white dark:bg-slate-900"
                    required
                  >
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Passing Year</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="number" 
                    value={formData.pass_year}
                    onChange={e => setFormData({...formData, pass_year: parseInt(e.target.value)})}
                    className="input-field pl-10" 
                    placeholder="2025"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Google Drive Portfolio Link</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="url" 
                  value={formData.google_drive_link}
                  onChange={e => setFormData({...formData, google_drive_link: e.target.value})}
                  className="input-field pl-10" 
                  placeholder="https://drive.google.com/..."
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold">This link will be used as the default for your submissions.</p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="btn-primary px-8 py-3 rounded-2xl flex items-center gap-2 shadow-glow disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
