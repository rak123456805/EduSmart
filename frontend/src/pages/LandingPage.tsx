import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Zap, Shield, Clock, Users, ChevronRight, 
  CheckCircle2, PlayCircle, BarChart3, Globe, 
  Mail, Twitter, Github, Linkedin
} from 'lucide-react'

const features = [
  {
    title: 'Smart Workflows',
    description: 'Define custom approval paths from Guide to Principal. Track every step visually.',
    icon: Zap,
    color: 'bg-blue-500',
  },
  {
    title: 'AI Insights',
    description: 'Advanced AI detection and probability scoring for all student submissions.',
    icon: Shield,
    color: 'bg-purple-500',
  },
  {
    title: 'Real-time Tracking',
    description: 'Get instant notifications for new assignments, approvals, and rejections.',
    icon: Clock,
    color: 'bg-amber-500',
  },
  {
    title: 'Version Control',
    description: 'Maintain complete history of submissions. Resubmit only when necessary.',
    icon: Users,
    color: 'bg-green-500',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 z-50 glass border-b border-white/10 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-glow">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-2xl font-display font-black tracking-tighter gradient-text">EduSmart</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Solutions', 'Pricing', 'Resources'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors">
            Login
          </Link>
          <Link to="/signup" className="btn-primary py-2 px-5 text-xs">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] -z-10 opacity-30 dark:opacity-20 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[150px] animate-pulse-slow" />
           <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-purple-400 rounded-full blur-[130px] animate-pulse-slow delay-700" />
        </div>

        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">v2.0 is now live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-8xl font-display font-black tracking-tight mb-8 max-w-5xl leading-[0.95] dark:text-white"
          >
            The Operating System for <span className="gradient-text">Academic Workflows.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed"
          >
            Streamline assignment creation, submission tracking, and multi-level approvals with the most advanced EduTech platform ever built.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/signup" className="btn-primary px-8 py-4 text-base group">
              Start Free Trial
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="btn-secondary px-8 py-4 text-base flex items-center gap-2">
              <PlayCircle size={20} className="text-slate-400" />
              Watch Demo
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-20 lg:mt-32 pt-10 border-t border-slate-100 dark:border-slate-900 w-full"
          >
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">Trusted by leading universities worldwide</p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale contrast-125">
              <div className="flex items-center gap-2 font-black text-2xl">MIT</div>
              <div className="flex items-center gap-2 font-black text-2xl tracking-tighter italic">Stanford</div>
              <div className="flex items-center gap-2 font-black text-2xl serif">Harvard</div>
              <div className="flex items-center gap-2 font-black text-2xl tracking-widest">OXFORD</div>
              <div className="flex items-center gap-2 font-black text-2xl">UPenn</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl font-black mb-6 leading-tight dark:text-white">
                Everything you need to <br /> <span className="text-blue-500">master</span> academic cycles.
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-md">
                EduSmart automates the heavy lifting of administrative tasks, so teachers can focus on teaching and students can focus on learning.
              </p>
              
              <div className="space-y-4">
                {[
                  'Multi-level approval workflows (Guide → HOD → Principal)',
                  'Real-time AI detection and probability analysis',
                  'Intelligent version control for resubmissions',
                  'Instant push notifications and email alerts'
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.div 
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-8 group hover:border-blue-500/50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-2xl ${f.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <f.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="card bg-blue-600 dark:bg-blue-600 p-12 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] -ml-48 -mb-48" />
           
           <div className="z-10 text-center lg:text-left">
             <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">Designed for scale.</h2>
             <p className="text-blue-100 max-w-md text-lg">Our infrastructure handles millions of submissions annually with 99.9% uptime.</p>
           </div>
           
           <div className="z-10 grid grid-cols-2 gap-8 lg:gap-16">
             <div className="text-center group">
                <p className="text-4xl lg:text-6xl font-black text-white mb-2 group-hover:scale-110 transition-transform">98%</p>
                <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Satisfaction</p>
             </div>
             <div className="text-center group">
                <p className="text-4xl lg:text-6xl font-black text-white mb-2 group-hover:scale-110 transition-transform">2.4M</p>
                <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Submissions</p>
             </div>
             <div className="text-center group">
                <p className="text-4xl lg:text-6xl font-black text-white mb-2 group-hover:scale-110 transition-transform">1.2s</p>
                <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Processing</p>
             </div>
             <div className="text-center group">
                <p className="text-4xl lg:text-6xl font-black text-white mb-2 group-hover:scale-110 transition-transform">100+</p>
                <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Institutions</p>
             </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="col-span-1 lg:col-span-1">
             <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600 shadow-glow">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="text-xl font-display font-black tracking-tighter gradient-text">EduSmart</span>
             </div>
             <p className="text-sm text-slate-500 leading-relaxed mb-8">
               Empowering students and teachers with smarter academic workflow tools. Built for the future of education.
             </p>
             <div className="flex items-center gap-4">
                <a href="#" className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-blue-500 transition-colors"><Twitter size={18} /></a>
                <a href="#" className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-blue-500 transition-colors"><Github size={18} /></a>
                <a href="#" className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-blue-500 transition-colors"><Linkedin size={18} /></a>
             </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 dark:text-white">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">AI Detection</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Workflow Builder</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">API & Integrations</a></li>
            </ul>
          </div>

          <div>
             <h4 className="font-bold mb-6 dark:text-white">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">University Program</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 dark:text-white">Newsletter</h4>
            <p className="text-sm text-slate-500 mb-4">Get the latest updates on academic tools.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="input-field py-2 rounded-lg" />
              <button className="btn-primary py-2 px-4 rounded-lg"><Mail size={16} /></button>
            </div>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-20 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
           <p className="text-xs text-slate-400">© 2026 EduSmart Platforms Inc. All rights reserved.</p>
           <div className="flex items-center gap-6 text-xs text-slate-400">
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600">Terms of Service</a>
              <a href="#" className="hover:text-slate-600">Cookie Settings</a>
           </div>
        </div>
      </footer>
    </div>
  )
}
