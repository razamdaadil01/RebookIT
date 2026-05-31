'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Users, ActivitySquare, Tag, Clock, Flag,
  Grid3X3, Layers, FormInput, CreditCard, Zap, Receipt,
  Gift, TrendingUp, Wallet, FileBarChart, Sliders, AlertOctagon,
  BadgePercent, PackageCheck, Settings, Bell, ShieldCheck,
  ChevronDown, ChevronRight, X,
} from 'lucide-react'

// ─── Nav structure ────────────────────────────────────────────────────────────

type NavItem = {
  href: string
  label: string
  icon: React.ElementType
  badge?: string
  badgeVariant?: 'danger' | 'success'
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'DASHBOARD',
    items: [
      { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    ],
  },
  {
    label: 'USERS',
    items: [
      { href: '/admin/users',          label: 'All Users',          icon: Users },
      { href: '/admin/users/activity', label: 'User Activity Logs', icon: ActivitySquare },
    ],
  },
  {
    label: 'LISTINGS',
    items: [
      { href: '/admin/listings',          label: 'All Listings',     icon: Tag },
      { href: '/admin/listings/pending',  label: 'Pending Approval', icon: Clock },
      { href: '/admin/listings/reported', label: 'Reported Listings', icon: Flag },
    ],
  },
  {
    label: 'CATEGORIES',
    items: [
      { href: '/admin/categories',                 label: 'Category Management',    icon: Grid3X3 },
      { href: '/admin/categories/subcategories',   label: 'Subcategory Management', icon: Layers },
      { href: '/admin/categories/form-builder',    label: 'Form Field Builder',     icon: FormInput, badge: 'NEW', badgeVariant: 'success' },
    ],
  },
  {
    label: 'PAYMENTS',
    items: [
      { href: '/admin/payments/fygaro',           label: 'Fygaro Transactions', icon: CreditCard },
      { href: '/admin/payments/manual-activation', label: 'Manual Activation',  icon: Zap },
      { href: '/admin/payments/bill-express',     label: 'Bill Express',        icon: Receipt },
    ],
  },
  {
    label: 'REFER & EARN',
    items: [
      { href: '/admin/referrals/analytics',   label: 'Analytics Dashboard',    icon: TrendingUp },
      { href: '/admin/referrals/withdrawals', label: 'Withdrawal Requests',    icon: Wallet },
      { href: '/admin/referrals/reports',     label: 'Payment Reports',        icon: FileBarChart },
      { href: '/admin/referrals/commission',  label: 'Commission Settings',    icon: BadgePercent },
      { href: '/admin/referrals/fraud',       label: 'Fraud Review',           icon: AlertOctagon, badge: '4', badgeVariant: 'danger' },
    ],
  },
  {
    label: 'SUBSCRIPTIONS',
    items: [
      { href: '/admin/subscriptions',        label: 'Active Plans',             icon: PackageCheck },
      { href: '/admin/subscriptions/config', label: 'Subscription Plans Config', icon: Sliders },
    ],
  },
  {
    label: 'REPORTS',
    items: [
      { href: '/admin/reports/revenue',   label: 'Revenue Reports',  icon: TrendingUp },
      { href: '/admin/reports/users',     label: 'User Reports',     icon: Users },
      { href: '/admin/reports/referrals', label: 'Referral Reports', icon: Gift },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { href: '/admin/settings',                label: 'General Settings',    icon: Settings },
      { href: '/admin/settings/roles',          label: 'RBAC / Roles',        icon: ShieldCheck },
      { href: '/admin/settings/notifications',  label: 'Notifications Config', icon: Bell },
    ],
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  // All groups open by default; track which are collapsed
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const toggleGroup = (label: string) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(href + '/')

  const groupHasActive = (items: NavItem[]) => items.some(i => isActive(i.href))

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-border z-40 flex flex-col transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border shrink-0">
          <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
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
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {NAV_GROUPS.map(group => {
            const isCollapsed = collapsed.has(group.label)
            const hasActive = groupHasActive(group.items)

            return (
              <div key={group.label} className="mb-1">
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md mb-0.5 group transition-colors
                    ${hasActive && isCollapsed ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <span className="text-[10px] font-bold tracking-widest">{group.label}</span>
                  {isCollapsed
                    ? <ChevronRight size={12} className="shrink-0" />
                    : <ChevronDown size={12} className="shrink-0" />}
                </button>

                {/* Items */}
                {!isCollapsed && (
                  <div className="space-y-0.5 mb-2">
                    {group.items.map(({ href, label, icon: Icon, badge, badgeVariant }) => {
                      const active = isActive(href)
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={onClose}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                            ${active
                              ? 'bg-primary text-white'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                        >
                          <Icon size={15} className="shrink-0" />
                          <span className="flex-1 leading-tight">{label}</span>
                          {badge && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0
                              ${active
                                ? 'bg-white/25 text-white'
                                : badgeVariant === 'success'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-danger/10 text-danger'}`}>
                              {badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border shrink-0">
          <p className="text-xs text-text-secondary">v2.0.0 — Jamaica Region</p>
        </div>
      </aside>
    </>
  )
}
