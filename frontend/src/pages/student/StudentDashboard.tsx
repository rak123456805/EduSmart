import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
   FileText, Clock, ExternalLink, Search,
   Filter, LayoutGrid, List, Upload,
   History, AlertCircle, X, ChevronRight, Users, Lock
} from 'lucide-react'
import { useAssignmentStore, Assignment, Submission, Team } from '@/store/assignmentStore'
import { useAuthStore } from '@/store/authStore'
import Badge from '@/components/ui/Badge'
import FileUpload from '@/components/ui/FileUploadComponent'

import WorkflowStepper from '@/components/ui/WorkflowStepper'
import EmptyState from '@/components/ui/EmptyState'
import { formatDistanceToNow, isPast } from 'date-fns'
import clsx from 'clsx'
import { useToast } from '@/components/ui/Toast'

export default function StudentDashboard() {
   const { user } = useAuthStore()
   const { toast } = useToast()
   const { assignments, submissions, teams, createTeam, joinTeam } = useAssignmentStore()
   const [view, setView] = useState<'grid' | 'list'>('grid')
   const [search, setSearch] = useState('')
   const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
   const [showUpload, setShowUpload] = useState(false)
   const [isSubmitting, setSubmitting] = useState(false)
   const [selectedFile, setSelectedFile] = useState<File | null>(null)
   const [driveLink, setDriveLink] = useState('')


   const [teamAction, setTeamAction] = useState<'create' | 'join' | null>(null)
   const [teamName, setTeamName] = useState('')
   const [joinTeamId, setJoinTeamId] = useState('')

   const assignmentTeam = selectedAssignment
      ? teams.find(t => t.assignmentId === selectedAssignment.id && t.memberIds.includes(user?.id || ''))
      : null

   const isLeader = assignmentTeam?.leaderId === user?.id
   const canSubmit = !selectedAssignment?.isTeamProject || isLeader

   const filteredAssignments = assignments.filter((a: Assignment) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase())
   )

   const getSubmission = (id: string) => submissions.find((s: Submission) => s.assignmentId === id && s.studentId === user?.id)

   const handleAssignmentClick = (a: Assignment) => {
      setSelectedAssignment(a)
      setShowUpload(true)
      setSelectedFile(null)
      fetchProfile()
   }

   const fetchProfile = async () => {
      if (!user) return
      try {
         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/${user.id}`)
         if (response.ok) {
            const data = await response.json()
            setDriveLink(data.google_drive_link || '')
         }
      } catch (error) {
         console.error('Error fetching profile:', error)
      }
   }

   const handleSubmission = async () => {
      if (!selectedFile || !selectedAssignment || !user) {
         toast('Please select a file first', 'error')
         return
      }

      if (!driveLink) {
         toast('Google Drive link is mandatory', 'error')
         return
      }

      setSubmitting(true)

      try {
         // 1. Submit Assignment
         const formData = new FormData()
         formData.append('file', selectedFile)
         formData.append('assignment_id', selectedAssignment.id)
         formData.append('student_id', user.id)
         formData.append('drive_link', driveLink)

         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/submit`, {
            method: 'POST',
            body: formData,
         })

         if (response.ok) {
            const data = await response.json()
            
            // Update store with new submission
            const newSubmission: Submission = {
               id: data.submission_id,
               assignmentId: selectedAssignment.id,
               studentId: user.id,
               studentName: user.name || 'Student',
               fileName: selectedFile.name,
               fileSize: selectedFile.size,
               versions: [{ version: 1, fileName: selectedFile.name, uploadedAt: new Date() }],
               status: 'submitted',
               currentStep: 0,
               workflowSteps: selectedAssignment.workflowSteps.map(step => ({ ...step, status: 'pending' })),
               aiScore: data.ai_score,
               submittedAt: new Date(),
               class: selectedAssignment.class
            }
            useAssignmentStore.getState().addSubmission(newSubmission)

            toast('Assignment submitted successfully!', 'success')
            setShowUpload(false)
         } else {
            const errorData = await response.json()
            toast(errorData.detail || 'Submission failed', 'error')
         }
      } catch (error) {
         toast('Connection error', 'error')
      } finally {
         setSubmitting(false)
      }
   }


   const submission = selectedAssignment ? getSubmission(selectedAssignment.id) : null

   return (
      <div className="space-y-8 animate-fade-in">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
               <h1 className="text-4xl font-black tracking-tight gradient-text mb-1">My Assignments</h1>
               <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Track your progress, deadlines, and submissions.</p>
            </div>

            <div className="flex items-center gap-4">
               <div className="relative group">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary-500 transition-colors" />
                  <input
                     type="text"
                     placeholder="Search assignments..."
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                     className="pl-10 pr-4 py-2.5 rounded-2xl text-sm border focus:ring-4 focus:ring-primary-500/10 outline-none transition-all w-full md:w-64"
                     style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
               </div>
               <div className="flex p-1 rounded-2xl glass border border-slate-200 dark:border-slate-800" style={{ background: 'var(--bg-tertiary)' }}>
                  <button onClick={() => setView('grid')} className={clsx('p-1.5 rounded-xl transition-all duration-300', view === 'grid' ? 'bg-white dark:bg-slate-700 shadow-lg text-primary-600 scale-110' : 'text-slate-400 hover:text-slate-600')}><LayoutGrid size={18} /></button>
                  <button onClick={() => setView('list')} className={clsx('p-1.5 rounded-xl transition-all duration-300', view === 'list' ? 'bg-white dark:bg-slate-700 shadow-lg text-primary-600 scale-110' : 'text-slate-400 hover:text-slate-600')}><List size={18} /></button>
               </div>
            </div>
         </div>

         {filteredAssignments.length === 0 ? (
            <EmptyState title="No assignments found" description="You don't have any assignments matching your search criteria." />
         ) : view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredAssignments.map((a: Assignment) => {
                  const sub = getSubmission(a.id)
                  const late = isPast(a.deadline) && !sub
                  return (
                     <motion.div
                        key={a.id}
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        onClick={() => handleAssignmentClick(a)}
                        className="card p-7 cursor-pointer group flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
                     >
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-2">
                              <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                                 <FileText size={18} />
                              </div>
                              <span className="text-xs font-bold uppercase tracking-widest text-primary-500">{a.subject}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              {sub?.aiScore !== undefined && (
                                 <div className={clsx(
                                    "px-2 py-0.5 rounded text-[10px] font-bold border",
                                    sub.aiScore < 40 ? "bg-green-50 text-green-700 border-green-200" : 
                                    sub.aiScore < 70 ? "bg-amber-50 text-amber-700 border-amber-200" : 
                                    "bg-red-50 text-red-700 border-red-200"
                                 )}>
                                    AI: {sub.aiScore}%
                                 </div>
                              )}
                              <Badge status={sub?.status || (late ? 'late' : 'pending')} />
                           </div>
                        </div>

                        <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors" style={{ color: 'var(--text-primary)' }}>{a.title}</h3>
                        <p className="text-sm mb-6 flex-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{a.description}</p>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                           <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: late ? '#ef4444' : 'var(--text-muted)' }}>
                              <Clock size={14} className={late ? 'text-red-500' : ''} />
                              {isPast(a.deadline) ? `Due ${formatDistanceToNow(a.deadline, { addSuffix: true })}` : `Due in ${formatDistanceToNow(a.deadline)}`}
                           </div>
                           {a.driveLink && <ExternalLink size={14} className="text-slate-400" />}
                        </div>
                     </motion.div>
                  )
               })}
            </div>
         ) : (
            <div className="card overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 dark:bg-slate-800/50 border-b" style={{ borderColor: 'var(--border-color)' }}>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Assignment</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Subject</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Deadline</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                        <th className="px-6 py-4"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                     {filteredAssignments.map((a: Assignment) => {
                        const sub = getSubmission(a.id)
                        const late = isPast(a.deadline) && !sub
                        return (
                           <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer group" onClick={() => handleAssignmentClick(a)}>
                              <td className="px-6 py-4">
                                 <span className="text-sm font-bold block" style={{ color: 'var(--text-primary)' }}>{a.title}</span>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="text-xs font-semibold text-slate-500">{a.subject}</span>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={clsx('text-xs font-medium', late ? 'text-red-500' : 'text-slate-600')}>{formatDistanceToNow(a.deadline, { addSuffix: true })}</span>
                              </td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                     {sub?.aiScore !== undefined && (
                                        <div className={clsx(
                                           "px-2 py-0.5 rounded text-[10px] font-bold border",
                                           sub.aiScore < 40 ? "bg-green-50 text-green-700 border-green-200" : 
                                           sub.aiScore < 70 ? "bg-amber-50 text-amber-700 border-amber-200" : 
                                           "bg-red-50 text-red-700 border-red-200"
                                        )}>
                                           {sub.aiScore}% AI
                                        </div>
                                     )}
                                     <Badge status={sub?.status || (late ? 'late' : 'pending')} />
                                  </div>
                               </td>
                              <td className="px-6 py-4 text-right">
                                 <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight size={16} className="text-slate-400" />
                                 </button>
                              </td>
                           </tr>
                        )
                     })}
                  </tbody>
               </table>
            </div>
         )}

         {/* Assignment Detail / Upload Modal */}
         <AnimatePresence>
            {showUpload && selectedAssignment && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                     onClick={() => setShowUpload(false)}
                  />

                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9, y: 20 }}
                     className="relative w-full max-w-[1100px] h-full max-h-[85vh] glass-card overflow-hidden flex flex-col lg:flex-row shadow-2xl"
                  >
                     {/* Left Sidebar Info */}
                     <div className="lg:w-[320px] p-8 border-b lg:border-b-0 lg:border-r overflow-y-auto" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                        <button onClick={() => setShowUpload(false)} className="lg:hidden absolute top-4 right-4 p-2 rounded-xl bg-white/20"><X size={20} /></button>

                        <div className="flex items-center gap-2 mb-6">
                           <div className="w-10 h-10 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-glow">
                              <FileText size={20} />
                           </div>
                           <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-600">Assignment</span>
                        </div>

                        <h2 className="text-2xl font-black mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>{selectedAssignment.title}</h2>
                        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>{selectedAssignment.description}</p>

                        <div className="space-y-6">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Subject</p>
                              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{selectedAssignment.subject}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Deadline</p>
                              <p className="text-sm font-bold flex items-center gap-2" style={{ color: isPast(selectedAssignment.deadline) ? '#ef4444' : 'var(--text-primary)' }}>
                                 <Clock size={14} />
                                 {formatDistanceToNow(selectedAssignment.deadline, { addSuffix: true })}
                              </p>
                           </div>
                           {selectedAssignment.driveLink && (
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Resources</p>
                                 <a href={selectedAssignment.driveLink} target="_blank" className="text-sm font-bold text-primary-500 underline flex items-center gap-2">
                                    <ExternalLink size={14} /> Google Drive Folder
                                 </a>
                              </div>
                           )}
                        </div>
                     </div>

                     {/* Right Side Workflow & Upload */}
                     <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
                        <div className="p-8 border-b flex items-center justify-between gap-4" style={{ borderColor: 'var(--border-color)' }}>
                           <h3 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
                              {submission ? 'Submission Status' : 'Upload Submission'}
                           </h3>
                           <div className="flex items-center gap-3">
                              {submission && <Badge status={submission.status} className="px-4 py-1.5" />}
                              <button onClick={() => setShowUpload(false)} className="hidden lg:flex p-2 rounded-xl btn-ghost border border-slate-200 dark:border-slate-800"><X size={20} /></button>
                           </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                           <div className="grid lg:grid-cols-12 gap-12">
                              <div className="lg:col-span-7 space-y-10">
                                 {/* Team Setup Section */}
                                 {selectedAssignment.isTeamProject && !assignmentTeam && (
                                    <div className="p-6 rounded-3xl bg-primary-50 dark:bg-primary-950/20 border border-primary-100 flex flex-col gap-4">
                                       <h4 className="font-black text-primary-700 flex items-center gap-2"><Users size={18} className="flex-shrink-0" /> Team Setup Required</h4>
                                       <p className="text-xs text-primary-600/80">This is a team project (Max {selectedAssignment.maxTeamSize} members). You must create or join a team before submitting.</p>

                                       {!teamAction ? (
                                          <div className="flex gap-3">
                                             <button onClick={() => setTeamAction('create')} className="btn-primary flex-1 py-2 text-xs h-10">Create Team</button>
                                             <button onClick={() => setTeamAction('join')} className="btn-ghost border border-primary-200 dark:border-primary-900 flex-1 py-2 text-xs h-10 hover:bg-primary-100 dark:hover:bg-primary-900/40">Join Team</button>
                                          </div>
                                       ) : teamAction === 'create' ? (
                                          <div className="flex items-center gap-2">
                                             <input type="text" placeholder="Team Name..." value={teamName} onChange={e => setTeamName(e.target.value)} className="input-field flex-1 text-sm h-10 border-primary-200" style={{ background: 'var(--bg-tertiary)' }} />
                                             <button onClick={() => { if (user && teamName) { createTeam(selectedAssignment.id, teamName, user.id); setTeamAction(null); setTeamName(''); } }} className="btn-primary px-4 h-10 text-xs">Create</button>
                                             <button onClick={() => setTeamAction(null)} className="p-2 text-slate-400 hover:text-slate-600"><X size={16} /></button>
                                          </div>
                                       ) : (
                                          <div className="flex items-center gap-2 text-sm">
                                             <select value={joinTeamId} onChange={e => setJoinTeamId(e.target.value)} className="input-field flex-1 h-10 border-primary-200 text-xs text-slate-700 bg-white dark:bg-slate-900">
                                                <option value="">Select a team...</option>
                                                {teams.filter(t => t.assignmentId === selectedAssignment.id && t.memberIds.length < (selectedAssignment.maxTeamSize || 2)).map(t => (
                                                   <option key={t.id} value={t.id}>{t.name} ({t.memberIds.length} members)</option>
                                                ))}
                                             </select>
                                             <button onClick={() => { if (user && joinTeamId) { joinTeam(joinTeamId, user.id); setTeamAction(null); setJoinTeamId(''); } }} className="btn-primary px-4 h-10 text-xs">Join</button>
                                             <button onClick={() => setTeamAction(null)} className="p-2 text-slate-400 hover:text-slate-600"><X size={16} /></button>
                                          </div>
                                       )}
                                    </div>
                                 )}

                                 {/* Submission Details */}
                                 {(!selectedAssignment.isTeamProject || assignmentTeam) && (
                                    submission ? (
                                       <div className="space-y-10">
                                          <div className="p-6 rounded-3xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 flex items-start gap-4">
                                             <div className="w-12 h-12 rounded-2xl bg-green-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                                                <Upload size={24} />
                                             </div>
                                             <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                   <p className="font-black text-green-700 dark:text-green-400">Successfully Submitted</p>
                                                   <span className="text-[10px] font-bold text-slate-400">version {submission.versions.length}</span>
                                                </div>
                                                <p className="text-sm font-bold truncate mb-3" style={{ color: 'var(--text-primary)' }}>{submission.fileName}</p>
                                                <div className="flex gap-2">
                                                   <button className="text-[11px] font-black uppercase text-primary-600 hover:underline">View File</button>
                                                   {submission.status === 'rejected' && <button className="text-[11px] font-black uppercase text-primary-600 hover:underline">Resubmit</button>}
                                                </div>
                                             </div>
                                          </div>

                                          {/* AI Score Display */}
                                          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-4">
                                             <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                   <div className={clsx(
                                                      "w-2 h-2 rounded-full",
                                                      submission.aiScore < 40 ? "bg-green-500" : submission.aiScore < 70 ? "bg-amber-500" : "bg-red-500"
                                                   )} />
                                                   <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">AI Content Analysis</h4>
                                                </div>
                                                <span className={clsx(
                                                   "text-lg font-black",
                                                   submission.aiScore < 40 ? "text-green-600" : submission.aiScore < 70 ? "text-amber-600" : "text-red-600"
                                                )}>
                                                   {submission.aiScore}%
                                                </span>
                                             </div>
                                             
                                             <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <motion.div 
                                                   initial={{ width: 0 }}
                                                   animate={{ width: `${submission.aiScore}%` }}
                                                   className={clsx(
                                                      "h-full rounded-full",
                                                      submission.aiScore < 40 ? "bg-green-500" : submission.aiScore < 70 ? "bg-amber-500" : "bg-red-500"
                                                   )}
                                                />
                                             </div>
                                             
                                             <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                                                {submission.aiScore < 40 
                                                   ? "Low AI probability. Content appears mostly human-written." 
                                                   : submission.aiScore < 70 
                                                      ? "Moderate AI probability detected. May require manual review." 
                                                      : "High AI probability detected. Strong patterns of AI-generated content."}
                                             </p>
                                          </div>

                                          <div>
                                             <div className="flex items-center gap-2 mb-6 text-slate-400 uppercase tracking-[0.2em] text-[10px] font-black">
                                                <History size={14} /> Version History
                                             </div>
                                             <div className="space-y-3">
                                                {submission.versions.map((v: any) => (
                                                   <div key={v.version} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10">
                                                      <div className="flex items-center gap-3">
                                                         <div className="text-xs font-black w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center">v{v.version}</div>
                                                         <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{v.fileName}</span>
                                                      </div>
                                                      <span className="text-[10px] text-slate-400 font-bold">{formatDistanceToNow(v.uploadedAt, { addSuffix: true })}</span>
                                                   </div>
                                                ))}
                                             </div>
                                          </div>
                                       </div>
                                    ) : (
                                       canSubmit ? (
                                          <div className="space-y-8">
                                             <div className="space-y-4">
                                                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex items-start gap-3">
                                                   <AlertCircle className="text-amber-500 mt-0.5 flex-shrink-0" size={16} />
                                                   <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-tight">
                                                      ⚠️ Drive should be public and all the contents are mandatory. Please ensure your files are accessible to the reviewers.
                                                   </p>
                                                </div>

                                                <FileUpload
                                                   onFileSelect={(file) => setSelectedFile(file)}
                                                   maxSizeMB={5}
                                                   disabled={isSubmitting}
                                                />

                                                <div className="space-y-1.5">
                                                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Google Drive Submission Link *</label>
                                                   <input 
                                                      type="url" 
                                                      value={driveLink}
                                                      onChange={e => setDriveLink(e.target.value)}
                                                      className="input-field h-12 text-sm shadow-sm" 
                                                      placeholder="https://drive.google.com/drive/folders/..."
                                                      required
                                                   />
                                                </div>
                                             </div>

                                             <div className="flex items-center gap-4">
                                                <button 
                                                   onClick={handleSubmission}
                                                   disabled={isSubmitting || !selectedFile || !driveLink}
                                                   className="btn-primary flex-1 h-12 shadow-glow disabled:opacity-50"
                                                >
                                                   {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                                                </button>
                                             </div>
                                          </div>
                                       ) : (
                                          <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center">
                                             <Lock className="w-8 h-8 mx-auto text-slate-300 mb-3 flex-shrink-0" />
                                             <p className="text-sm font-bold text-slate-500">Waiting for team leader</p>
                                             <p className="text-xs mt-1 text-slate-400">Your team leader needs to upload the final submission.</p>
                                          </div>
                                       )
                                    )
                                 )}
                              </div>

                              {/* Workflow Tracker */}
                              <div className="lg:col-span-5 pt-4">
                                 <div className="flex items-center gap-2 mb-8 text-slate-400 uppercase tracking-[0.2em] text-[10px] font-black">
                                    Review Workflow
                                 </div>
                                 <WorkflowStepper
                                    steps={submission ? submission.workflowSteps : selectedAssignment.workflowSteps}
                                    currentStep={submission ? submission.currentStep : -1}
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         <div className="fixed bottom-8 right-8 z-[100] lg:hidden">
            <button onClick={() => setShowUpload(false)} className="w-14 h-14 rounded-full bg-primary-500 text-white shadow-glow flex items-center justify-center">
               <X size={24} />
            </button>
         </div>
      </div>
   )
}

