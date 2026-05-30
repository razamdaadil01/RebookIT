'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Tag, Grid3X3, CreditCard, Banknote,
  Gift, AlertTriangle, BarChart2, Shield, Bell, Settings, X
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/listings', label: 'Listings', icon: Tag },
  { href: '/admin/categories', label: 'Categories', icon: Grid3X3 },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/payouts', label: 'Payouts', icon: Banknote },
  { href: '/admin/referrals', label: 'Referrals', icon: Gift },
  { href: '/admin/disputes', label: 'Disputes', icon: AlertTriangle, badge: '3' },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/moderation', label: 'Moderation', icon: Shield, badge: '7' },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-border z-40 flex flex-col transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">RB</span>
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary leading-tight">Rebook It</p>
              <p className="text-xs text-text-secondary leading-tight">Admin Panel</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full
                    ${isActive ? 'bg-white/20 text-white' : 'bg-danger/10 text-danger'}`}>
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border">
          <p className="text-xs text-text-secondary">v1.0.0 — Caribbean Region</p>
        </div>
      </aside>
    </>
  )
}
