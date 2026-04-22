import { create } from 'zustand'

export type AssignmentStatus = 'pending' | 'submitted' | 'review' | 'rejected' | 'approved'

export interface WorkflowStep {
  id: string
  role: string
  status: 'pending' | 'approved' | 'rejected' | 'current'
  comment?: string
  actor?: string
  timestamp?: Date
}

export interface Team {
  id: string
  assignmentId: string
  name: string
  leaderId: string
  memberIds: string[]
}

export interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  class: string
  deadline: Date
  driveLink?: string
  workflowSteps: WorkflowStep[]
  createdBy: string
  createdAt: Date
  isLate?: boolean
  isTeamProject?: boolean
  maxTeamSize?: number
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  studentName: string
  fileName: string
  fileSize: number
  versions: { version: number; fileName: string; uploadedAt: Date }[]
  status: AssignmentStatus
  currentStep: number
  workflowSteps: WorkflowStep[]
  aiScore: number
  submittedAt: Date
  class: string
  teamId?: string
}

interface AssignmentState {
  assignments: Assignment[]
  submissions: Submission[]
  teams: Team[]
  addAssignment: (a: Omit<Assignment, 'id' | 'createdAt'>) => void
  updateSubmissionStatus: (id: string, status: AssignmentStatus) => void
  addSubmission: (s: Submission) => void
  createTeam: (assignmentId: string, name: string, leaderId: string) => void
  joinTeam: (teamId: string, studentId: string) => void
}

const DEMO_WORKFLOW: WorkflowStep[] = [
  { id: 's1', role: 'Guide', status: 'approved', actor: 'Dr. Sharma', timestamp: new Date(Date.now() - 86400000) },
  { id: 's2', role: 'HOD', status: 'current' },
  { id: 's3', role: 'Principal', status: 'pending' },
]

const DEMO_ASSIGNMENTS: Assignment[] = [
  {
    id: 'e62c7d9b-8f3b-4c5a-b9d1-3e4f5a6b7c8d', title: 'Operating Systems Lab Report', description: 'Write a detailed report on process scheduling algorithms including Round Robin, SJF, and Priority Scheduling. Include diagrams and analysis.', subject: 'Operating Systems', class: 'CS-3A',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 48), driveLink: 'https://drive.google.com', createdBy: 'Dr. Smith',
    workflowSteps: [{ id: 's1', role: 'Guide', status: 'pending' }, { id: 's2', role: 'HOD', status: 'pending' }, { id: 's3', role: 'Principal', status: 'pending' }],
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', title: 'Machine Learning Project - Image Classification', description: 'Build and train a CNN model for image classification using the CIFAR-10 dataset. Submit Jupyter notebook with results.', subject: 'Machine Learning', class: 'CS-4B',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), driveLink: 'https://drive.google.com', createdBy: 'Dr. Patel',
    workflowSteps: [{ id: 's1', role: 'Guide', status: 'pending' }, { id: 's2', role: 'HOD', status: 'pending' }],
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d', title: 'Data Structures Assignment #4', description: 'Implement AVL trees with insertion, deletion, and rotation operations. Write test cases for all edge cases.', subject: 'Data Structures', class: 'CS-2A',
    deadline: new Date(Date.now() - 1000 * 60 * 60 * 24), createdBy: 'Prof. Kumar',
    workflowSteps: [{ id: 's1', role: 'HOD', status: 'pending' }],
    createdAt: new Date(Date.now() - 86400000 * 7), isLate: true,
  },
  {
    id: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e', title: 'Database Management Systems Project', description: 'Design and implement a relational database for a hospital management system. Include ER diagram and normalized tables.', subject: 'DBMS', class: 'CS-3B',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), driveLink: 'https://drive.google.com', createdBy: 'Dr. Rao',
    workflowSteps: [{ id: 's1', role: 'Guide', status: 'pending' }, { id: 's2', role: 'HOD', status: 'pending' }, { id: 's3', role: 'Principal', status: 'pending' }],
    createdAt: new Date(Date.now() - 86400000 * 2),
    isTeamProject: true, maxTeamSize: 4
  },
]

const DEMO_SUBMISSIONS: Submission[] = [
  {
    id: 'sub1-uuid', assignmentId: 'e62c7d9b-8f3b-4c5a-b9d1-3e4f5a6b7c8d', studentId: 'stu1', studentName: 'Aanya Sharma', fileName: 'OS_Lab_Report_v2.pdf', fileSize: 2.4 * 1024 * 1024,
    versions: [{ version: 1, fileName: 'OS_Lab_Report_v1.pdf', uploadedAt: new Date(Date.now() - 86400000 * 2) }, { version: 2, fileName: 'OS_Lab_Report_v2.pdf', uploadedAt: new Date(Date.now() - 86400000) }],
    status: 'review', currentStep: 1, workflowSteps: DEMO_WORKFLOW, aiScore: 23, submittedAt: new Date(Date.now() - 86400000), class: 'CS-3A',
  },
  {
    id: 'sub2-uuid', assignmentId: 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', studentId: 'stu2', studentName: 'Rohan Mehta', fileName: 'ML_Project.pdf', fileSize: 3.1 * 1024 * 1024,
    versions: [{ version: 1, fileName: 'ML_Project.pdf', uploadedAt: new Date(Date.now() - 3600000) }],
    status: 'submitted', currentStep: 0, workflowSteps: [{ id: 's1', role: 'Guide', status: 'current' }, { id: 's2', role: 'HOD', status: 'pending' }],
    aiScore: 67, submittedAt: new Date(Date.now() - 3600000), class: 'CS-4B',
  },
  {
    id: 'sub3-uuid', assignmentId: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d', studentId: 'stu3', studentName: 'Priya Nair', fileName: 'DS_Assignment4.pdf', fileSize: 1.2 * 1024 * 1024,
    versions: [{ version: 1, fileName: 'DS_Assignment4.pdf', uploadedAt: new Date(Date.now() - 86400000 * 3) }],
    status: 'rejected', currentStep: 0, workflowSteps: [{ id: 's1', role: 'HOD', status: 'rejected', comment: 'Missing test cases for edge conditions. Please resubmit with complete test coverage.' }],
    aiScore: 45, submittedAt: new Date(Date.now() - 86400000 * 3), class: 'CS-2A',
  },
  {
    id: 'sub4-uuid', assignmentId: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e', studentId: 'stu4', studentName: 'Karan Singh', fileName: 'DBMS_Project.pdf', fileSize: 4.2 * 1024 * 1024,
    versions: [{ version: 1, fileName: 'DBMS_Project.pdf', uploadedAt: new Date(Date.now() - 86400000 * 5) }, { version: 2, fileName: 'DBMS_Project_v2.pdf', uploadedAt: new Date(Date.now() - 86400000 * 2) }, { version: 3, fileName: 'DBMS_Project_v3.pdf', uploadedAt: new Date(Date.now() - 86400000) }],
    status: 'approved',
    currentStep: 2,
    workflowSteps: [
      { id: 's1', role: 'Guide', status: 'approved', actor: 'Dr. Rao', timestamp: new Date(Date.now() - 86400000 * 3) },
      { id: 's2', role: 'HOD', status: 'approved', actor: 'Prof. Verma', timestamp: new Date(Date.now() - 86400000 * 2) },
      { id: 's3', role: 'Principal', status: 'approved', actor: 'Dr. Principal', timestamp: new Date(Date.now() - 86400000) },
    ],
    aiScore: 12, submittedAt: new Date(Date.now() - 86400000 * 5), class: 'CS-3B',
  },
]

const DEMO_TEAMS: Team[] = [
  { id: 't1', assignmentId: 'e62c7d9b-8f3b-4c5a-b9d1-3e4f5a6b7c8d', name: 'Alpha Squad', leaderId: 'stu1', memberIds: ['stu1', 'stu2'] }
]

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignments: DEMO_ASSIGNMENTS,
  submissions: DEMO_SUBMISSIONS,
  teams: DEMO_TEAMS,
  addAssignment: (a) => set((s) => ({ assignments: [{ ...a, id: Date.now().toString(), createdAt: new Date() }, ...s.assignments] })),
  updateSubmissionStatus: (id, status) => set((s) => ({ submissions: s.submissions.map(sub => sub.id === id ? { ...sub, status } : sub) })),
  addSubmission: (sub) => set((s) => ({ submissions: [sub, ...s.submissions] })),
  createTeam: (assignmentId, name, leaderId) => set((s) => ({
    teams: [...s.teams, { id: Date.now().toString(), assignmentId, name, leaderId, memberIds: [leaderId] }]
  })),
  joinTeam: (teamId, studentId) => set((s) => ({
    teams: s.teams.map(t => t.id === teamId ? { ...t, memberIds: [...t.memberIds, studentId] } : t)
  })),
}))
