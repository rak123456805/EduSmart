import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, Users, Clock, Plus, Search, 
  Filter, MoreHorizontal, CheckCircle2, XCircle, 
  MessageSquare, ExternalLink, Download, FileCheck,
  BarChart3, Calendar, GraduationCap, ChevronRight
} from 'lucide-react'
import { useAssignmentStore, Submission, Assignment, Team } from '@/store/assignmentStore'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { format, formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'

export default function TeacherDashboard() {
  const { user } = useAuthStore()
  const { assignments, submissions, teams } = useAssignmentStore()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [filterClass, setFilterClass] = useState('All Classes')
  const [filterStatus, setFilterStatus] = useState('All Status')

  const classes = ['All Classes', ...Array.from(new Set(assignments.map((a: Assignment) => a.class)))] as string[]
  const statuses = ['All Status', 'pending', 'submitted', 'review', 'rejected', 'approved']

  const filteredSubmissions = submissions.filter((s: Submission) => {
    const matchesSearch = s.studentName.toLowerCase().includes(search.toLowerCase()) || 
                         s.fileName.toLowerCase().includes(search.toLowerCase())
    const matchesClass = filterClass === 'All Classes' || s.class === filterClass
    const matchesStatus = filterStatus === 'All Status' || s.status === filterStatus
    return matchesSearch && matchesClass && matchesStatus
  })

  const stats = [
    { label: 'Active Assignments', value: assignments.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Total Submissions', value: submissions.length, icon: Users, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Pending Reviews', value: submissions.filter(s => s.status === 'review' || s.status === 'submitted').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Completion Rate', value: '84%', icon: FileCheck, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  ]

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-4xl font-black tracking-tight gradient-text mb-1">Teacher Dashboard</h1>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name}. Here's what's happening with your classes.</p>
        </div>
        <button 
          onClick={() => navigate('/assignments/create')}
          className="btn-primary shadow-glow px-8 py-3.5 h-auto self-start md:self-auto rounded-2xl"
        >
          <Plus size={20} /> Create Assignment
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div 
            key={stat.label} 
            whileHover={{ y: -5, scale: 1.02 }}
            className="card p-6 flex items-center gap-4 border-l-4"
            style={{ borderLeftColor: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('purple') ? '#9333ea' : stat.color.includes('amber') ? '#f59e0b' : '#22c55e' }}
          >
             <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner', stat.bg)}>
                <stat.icon size={24} className={stat.color} />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{stat.label}</p>
                <p className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Submissions Section */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
           <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Recent Submissions</h2>
           
           <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl text-xs border outline-none w-48 focus:w-64 transition-all"
                  style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <select 
                value={filterClass}
                onChange={e => setFilterClass(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-bold border outline-none cursor-pointer"
                style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                {classes.map((c: string) => <option key={c} value={c}>{c}</option>)}
              </select>

              <select 
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-bold border outline-none cursor-pointer"
                style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
           </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <EmptyState title="No submissions found" description="Adjust your filters or search terms to find what you're looking for." />
        ) : (
          <div className="card overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Student Name</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Assignment</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Submitted At</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Current Stage</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">AI Score</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                  {filteredSubmissions.map((s: Submission) => {
                    const assignment = assignments.find(a => a.id === s.assignmentId)
                    const team = assignment?.isTeamProject ? teams.find(t => t.assignmentId === s.assignmentId && t.memberIds.includes(s.studentId)) : null
                    return (
                    <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 group transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-black">
                            {team ? <Users size={14} /> : s.studentName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-bold block truncate" style={{ color: 'var(--text-primary)' }}>
                               {team ? team.name : s.studentName}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                               {team ? `Leader: ${s.studentName} • ${s.class}` : s.class}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="min-w-0">
                          <span className="text-sm font-bold block truncate" style={{ color: 'var(--text-primary)' }}>{s.fileName}</span>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{(s.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{format(s.submittedAt, 'MMM d, yyyy')}</span>
                           <span className="text-[10px] text-slate-400">{formatDistanceToNow(s.submittedAt, { addSuffix: true })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm">
                         <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--text-primary)' }}>
                            <div className="w-6 h-6 rounded-lg bg-tertiary flex items-center justify-center text-[10px]" style={{ background: 'var(--bg-tertiary)' }}>
                               {s.currentStep + 1}
                            </div>
                            {s.workflowSteps[s.currentStep]?.role || 'Finalized'}
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2">
                           <div className="flex-1 w-12 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                             <div 
                               className={clsx('h-full', s.aiScore > 70 ? 'bg-red-500' : s.aiScore > 30 ? 'bg-amber-500' : 'bg-green-500')}
                               style={{ width: `${s.aiScore}%` }}
                             />
                           </div>
                           <span className={clsx('text-xs font-black', s.aiScore > 70 ? 'text-red-500' : s.aiScore > 30 ? 'text-amber-500' : 'text-green-500')}>{s.aiScore}%</span>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <Badge status={s.status} />
                      </td>
                      <td className="px-6 py-5 text-right">
                         <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 text-green-600" title="Approve"><CheckCircle2 size={18} /></button>
                            <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600" title="Reject"><XCircle size={18} /></button>
                            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" title="Comment"><MessageSquare size={18} /></button>
                            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
                            <button className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/30 text-primary-600" title="Download"><Download size={18} /></button>
                         </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Assignment List for Teacher */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Your Assignments</h2>
           <button className="text-xs font-bold text-primary-500 hover:underline">View all</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {assignments.slice(0, 3).map((a: Assignment) => (
              <div key={a.id} className="card p-6 border-t-4 border-t-primary-500 relative overflow-hidden">
                 {a.isTeamProject && (
                    <div className="absolute top-0 right-0 bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl origin-top-right">
                       Team Project
                    </div>
                 )}
                 <div className="flex items-start justify-between mb-4 mt-2">
                    <h3 className="font-bold pr-6 line-clamp-1" style={{ color: 'var(--text-primary)' }}>{a.title}</h3>
                    <button className="p-1.5 rounded-lg btn-ghost"><MoreHorizontal size={16} /></button>
                 </div>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                       <Users size={14} /> {submissions.filter((s: Submission) => s.assignmentId === a.id).length} Submissions
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                       <Calendar size={14} /> {format(a.deadline, 'MMM d')}
                    </div>
                 </div>
                 <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex -space-x-2">
                       {[1,2,3,4].map(i => (
                          <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[8px] font-black">ST</div>
                       ))}
                       <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-primary-100 flex items-center justify-center text-[8px] font-black text-primary-600">+12</div>
                    </div>
                    <button className="text-xs font-black uppercase text-primary-500 hover:underline flex items-center gap-1">Details <ExternalLink size={12} /></button>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  )
}
