import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Navbar onMenuClick={() => setMobileOpen(true)} />
      <main className="lg:pl-64 pt-16 min-h-screen">
        <div className="p-6 lg:p-8 max-w-[1440px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
