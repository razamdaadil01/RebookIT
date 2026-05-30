'use client'

import { Menu, Search, Bell, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface TopbarProps {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 lg:left-60 right-0 h-14 bg-white border-b border-border z-20 flex items-center px-4 gap-3">
      {/* Menu button (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search users, listings, transactions..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            5
          </span>
        </button>
        {notifOpen && (
          <div className="absolute right-0 mt-1 w-80 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-text-primary">Notifications</p>
            </div>
            {[
              { text: 'New dispute filed by Marcus Williams', time: '2 min ago', dot: 'bg-danger' },
              { text: '3 new listings pending review', time: '15 min ago', dot: 'bg-warning' },
              { text: 'Payout approved for Kerri-Ann Joseph', time: '1 hr ago', dot: 'bg-success' },
              { text: 'New seller registration: Priya Ramkissoon', time: '2 hr ago', dot: 'bg-primary' },
              { text: 'System: Backup completed successfully', time: '3 hr ago', dot: 'bg-slate-400' },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-border last:border-0">
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary leading-snug">{n.text}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin profile */}
      <div className="flex items-center gap-2 pl-2 cursor-pointer group">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white text-xs font-bold">SA</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-text-primary leading-tight">Super Admin</p>
          <p className="text-xs text-text-secondary leading-tight">Administrator</p>
        </div>
        <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600" />
      </div>
    </header>
  )
}
