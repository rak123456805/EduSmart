import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, Reorder } from 'framer-motion'
import {
   ArrowLeft, Save, Plus, Trash2, GripVertical,
   MapPin, GraduationCap, Laptop, BookOpen,
   Settings, Link as LinkIcon, Calendar,
   CheckCircle2, Info, ChevronRight, Users
} from 'lucide-react'
import { useAssignmentStore, WorkflowStep } from '@/store/assignmentStore'
import { useToast } from '@/components/ui/Toast'

const ROLE_OPTIONS = ['Guide', 'HOD', 'Principal', 'External Reviewer', 'Class Teacher', 'Subject Expert']

export default function CreateAssignment() {
   const { addAssignment } = useAssignmentStore()
   const { toast } = useToast()
   const navigate = useNavigate()

   const [formData, setFormData] = useState({
      title: '',
      description: '',
      subject: '',
      class: 'CS-3A',
      deadline: '',
      driveLink: '',
      isTeamProject: false,
      maxTeamSize: 3,
   })

   const [steps, setSteps] = useState<WorkflowStep[]>([
      { id: '1', role: 'Guide', status: 'pending' },
      { id: '2', role: 'HOD', status: 'pending' },
   ])

   const handleAddStep = () => {
      const newId = (steps.length + 1).toString()
      setSteps([...steps, { id: newId, role: 'Principal', status: 'pending' }])
   }

   const handleRemoveStep = (id: string) => {
      if (steps.length <= 1) {
         toast('At least one approval step is required', 'error')
         return
      }
      setSteps(steps.filter((s: WorkflowStep) => s.id !== id))
   }

   const handleRoleChange = (id: string, role: string) => {
      setSteps(steps.map((s: WorkflowStep) => s.id === id ? { ...s, role } : s))
   }

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.title || !formData.deadline) {
         toast('Please fill in all required fields', 'error')
         return
      }

      addAssignment({
         ...formData,
         deadline: new Date(formData.deadline),
         workflowSteps: steps,
         createdBy: 'Dr. Sarah Wilson'
      })

      toast('Assignment created successfully with custom workflow!', 'success')
      navigate('/dashboard')
   }

   return (
      <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <Link to="/dashboard" className="p-2.5 rounded-xl btn-ghost border border-slate-200 dark:border-slate-800">
                  <ArrowLeft size={20} />
               </Link>
               <div>
                  <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>New Assignment</h1>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Configure details and approval workflow.</p>
               </div>
            </div>
            <button onClick={handleSubmit} className="btn-primary shadow-glow h-12 px-8">
               <Save size={20} /> Publish Assignment
            </button>
         </div>

         <div className="grid lg:grid-cols-12 gap-8">
            {/* Left: General Info */}
            <div className="lg:col-span-7 space-y-8">
               <div className="card p-8 bg-white dark:bg-slate-900">
                  <h2 className="text-lg font-black mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                     <Info size={18} className="text-primary-500 flex-shrink-0" /> General Information
                  </h2>

                  <div className="space-y-6">
                     <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Assignment Title</label>
                        <input
                           type="text"
                           placeholder="e.g. Operating Systems Phase 1"
                           value={formData.title}
                           onChange={e => setFormData({ ...formData, title: e.target.value })}
                           className="input-field"
                        />
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Description</label>
                        <textarea
                           rows={4}
                           placeholder="Provide detailed instructions for students..."
                           value={formData.description}
                           onChange={e => setFormData({ ...formData, description: e.target.value })}
                           className="input-field resize-none py-4"
                        />
                     </div>

                     <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                           <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Subject</label>
                           <div className="relative group">
                              <BookOpen size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                              <input
                                 type="text"
                                 placeholder="e.g. Computer Science"
                                 value={formData.subject}
                                 onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                 className="input-field pl-11"
                              />
                           </div>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Target Class</label>
                           <div className="relative group">
                              <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                              <select
                                 value={formData.class}
                                 onChange={e => setFormData({ ...formData, class: e.target.value })}
                                 className="input-field pl-11 appearance-none"
                              >
                                 <option value="CS-3A">CS-3A</option>
                                 <option value="CS-4B">CS-4B</option>
                                 <option value="IT-2C">IT-2C</option>
                              </select>
                           </div>
                        </div>
                     </div>

                     <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                           <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Submission Deadline</label>
                           <div className="relative group">
                              <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                              <input
                                 type="datetime-local"
                                 value={formData.deadline}
                                 onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                 className="input-field pl-11"
                              />
                           </div>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Google Drive Folder (Optional)</label>
                           <div className="relative group">
                              <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                              <input
                                 type="url"
                                 placeholder="https://drive.google.com/..."
                                 value={formData.driveLink}
                                 onChange={e => setFormData({ ...formData, driveLink: e.target.value })}
                                 className="input-field pl-11"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                           <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Team Project</label>
                           <div className="flex items-center gap-3 pt-2">
                              <button
                                 type="button"
                                 onClick={() => setFormData({ ...formData, isTeamProject: !formData.isTeamProject })}
                                 className={`relative w-12 h-6 rounded-full transition-colors flex items-center px-1 ${formData.isTeamProject ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                              >
                                 <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData.isTeamProject ? 'translate-x-6' : 'translate-x-0'}`} />
                              </button>
                              <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                                 {formData.isTeamProject ? 'Enabled' : 'Disabled'}
                              </span>
                           </div>
                        </div>
                        {formData.isTeamProject && (
                           <div className="space-y-1.5 animate-fade-in">
                              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Max Team Size</label>
                              <div className="relative group">
                                 <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                 <input
                                    type="number"
                                    min="2"
                                    max="10"
                                    value={formData.maxTeamSize}
                                    onChange={e => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) || 2 })}
                                    className="input-field pl-11"
                                 />
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* Right: Workflow Builder */}
            <div className="lg:col-span-5 space-y-8">
               <div className="card p-8 bg-white dark:bg-slate-900 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16" />

                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-lg font-black flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <MapPin size={18} className="text-primary-500 flex-shrink-0" /> Workflow Path Builder
                     </h2>
                     <button
                        type="button"
                        onClick={handleAddStep}
                        className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                        title="Add Step"
                     >
                        <Plus size={18} />
                     </button>
                  </div>

                  <p className="text-xs text-slate-500 mb-8 leading-relaxed">
                     Define the sequence of approvals required for student submissions. Drag to reorder steps.
                  </p>

                  <div className="space-y-4">
                     {/* Note: In a real app we'd use Reorder.Group from Framer Motion, 
                   but since I can't check if the package is fully installed, I'll use a clean UI list */}
                     <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-4">
                        {steps.map((step: WorkflowStep, index: number) => (
                           <Reorder.Item
                              key={step.id}
                              value={step}
                              className="relative p-4 rounded-2xl border bg-slate-50 dark:bg-slate-800/20 group hover:border-primary-500/50 transition-colors"
                              style={{ borderColor: 'var(--border-color)' }}
                           >
                              <div className="flex items-center gap-4">
                                 <div className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-primary-500 transition-colors">
                                    <GripVertical size={20} />
                                 </div>

                                 <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 border shadow-sm flex items-center justify-center text-xs font-black" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                                    {index + 1}
                                 </div>

                                  <div className="flex-1 relative">
                                    <div className="flex items-center gap-2">
                                       <select
                                          value={step.role}
                                          onChange={e => handleRoleChange(step.id, e.target.value)}
                                          className="flex-1 bg-transparent text-sm font-bold outline-none cursor-pointer appearance-none pr-8"
                                          style={{ color: 'var(--text-primary)' }}
                                       >
                                          {ROLE_OPTIONS.map(role => (
                                             <option key={role} value={role} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium py-2">
                                                {role}
                                             </option>
                                          ))}
                                       </select>
                                       <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary-500 transition-colors">
                                          <ChevronRight size={14} className="rotate-90" />
                                       </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Level {index + 1} Approver</p>
                                 </div>

                                 <button
                                    onClick={() => handleRemoveStep(step.id)}
                                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>

                              {index !== steps.length - 1 && (
                                 <div className="absolute top-full left-[60px] w-[2px] h-4 bg-slate-200 dark:bg-slate-700 -ml-[1px]" />
                              )}
                           </Reorder.Item>
                        ))}
                     </Reorder.Group>
                  </div>

                  {/* Workflow Preview Sticky */}
                  <div className="mt-12 p-6 rounded-3xl bg-primary-600 shadow-glow relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12" />
                     <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                        <CheckCircle2 size={16} className="flex-shrink-0" /> Workflow Preview
                     </h3>
                     <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {steps.map((s: WorkflowStep, i: number) => (
                           <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
                              <div className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md text-[10px] font-black text-white border border-white/10">
                                 {s.role}
                              </div>
                              {i !== steps.length - 1 && <ChevronRight size={12} className="text-white/40" />}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="card p-8 bg-slate-50 dark:bg-slate-900 border-dashed border-2">
                  <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Workflow Best Practices</h3>
                  <ul className="space-y-3">
                     {[
                        'Ensure high-level roles are at the end of the path.',
                        'Add at least 2 approvers for major projects.',
                        'Each stage can provide independent feedback.',
                        'Automatic notifications are sent to students per stage.'
                     ].map(item => (
                        <li key={item} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                           <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                           {item}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </div>
   )
}

