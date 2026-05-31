'use client'

import { useState } from 'react'
import { Users, CalendarDays, XCircle, DollarSign, Search, Eye, Calendar } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'
import StatCard from '@/components/StatCard'
import ConfirmDialog from '@/components/ConfirmDialog'
import Modal from '@/components/Modal'

function InitAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-purple-500', 'bg-teal-500']
  const c = colors[name.charCodeAt(0) % colors.length]
  const dim = size === 'lg' ? 'w-12 h-12 text-base' : 'w-8 h-8 text-xs'
  return <div className={`${dim} rounded-full ${c} flex items-center justify-center text-white font-bold shrink-0`}>{initials}</div>
}

const subscriptions = [
  { id: 'SUB-001', user: 'Khalil Brown',    email: 'khalil@email.com',   plan: 'Pro',     start: 'May 1, 2026',  end: 'May 31, 2026', method: 'Fygaro',       status: 'Expired'   },
  { id: 'SUB-002', user: 'Nadine Campbell', email: 'nadine@email.com',   plan: 'Basic',   start: 'May 15, 2026', end: 'Jun 14, 2026', method: 'Bill Express', status: 'Active'    },
  { id: 'SUB-003', user: 'Rohan Clarke',    email: 'rohan@email.com',    plan: 'Premium', start: 'May 20, 2026', end: 'Jun 4, 2026',  method: 'Fygaro',       status: 'Active'    },
  { id: 'SUB-004', user: 'Simone Edwards',  email: 'simone@email.com',   plan: 'Basic',   start: 'May 10, 2026', end: 'Jun 9, 2026',  method: 'Manual',       status: 'Active'    },
  { id: 'SUB-005', user: 'Andre Gordon',    email: 'andre@email.com',    plan: 'Pro',     start: 'Apr 15, 2026', end: 'May 15, 2026', method: 'Fygaro',       status: 'Expired'   },
  { id: 'SUB-006', user: 'Tanya Harrison',  email: 'tanya@email.com',    plan: 'Free',    start: 'May 1, 2026',  end: 'May 31, 2026', method: 'Manual',       status: 'Active'    },
  { id: 'SUB-007', user: 'Damion Jackson',  email: 'damion@email.com',   plan: 'Premium', start: 'May 25, 2026', end: 'Jun 6, 2026',  method: 'Fygaro',       status: 'Active'    },
  { id: 'SUB-008', user: 'Keisha Lawrence', email: 'keisha@email.com',   plan: 'Basic',   start: 'May 5, 2026',  end: 'Jun 4, 2026',  method: 'Bill Express', status: 'Suspended' },
  { id: 'SUB-009', user: 'Michael Morgan',  email: 'michael@email.com',  plan: 'Pro',     start: 'May 28, 2026', end: 'Jun 3, 2026',  method: 'Fygaro',       status: 'Active'    },
  { id: 'SUB-010', user: 'Patricia Nelson', email: 'patricia@email.com', plan: 'Basic',   start: 'May 20, 2026', end: 'Jun 1, 2026',  method: 'Manual',       status: 'Active'    },
]

type Sub = typeof subscriptions[0]

function planBadge(plan: string) {
  const map: Record<string, string> = {
    Free: 'bg-slate-100 text-slate-700',
    Basic: 'bg-blue-100 text-blue-700',
    Pro: 'bg-purple-100 text-purple-700',
    Premium: 'bg-amber-100 text-amber-700',
  }
  return map[plan] ?? 'bg-slate-100 text-slate-700'
}

function methodBadge(method: string) {
  const map: Record<string, string> = {
    Fygaro: 'bg-indigo-100 text-indigo-700',
    'Bill Express': 'bg-teal-100 text-teal-700',
    Manual: 'bg-orange-100 text-orange-700',
  }
  return map[method] ?? 'bg-slate-100 text-slate-700'
}

function endDateClass(status: string, end: string) {
  if (status === 'Expired') return 'text-danger font-medium'
  const monthMap: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
  const parts = end.replace(',', '').split(' ')
  if (parts.length < 2) return 'text-text-primary'
  const mo = monthMap[parts[0]]
  const day = parseInt(parts[1])
  if (isNaN(mo) || isNaN(day)) return 'text-text-primary'
  const d = new Date(2026, mo, day)
  const today = new Date(2026, 5, 1)
  const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  if (diff >= 0 && diff <= 7) return 'text-orange-600 font-medium'
  return 'text-text-primary'
}

export default function SubscriptionsPage() {
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('All Plans')
  const [statusFilter, setStatusFilter] = useState('All')
  const [methodFilter, setMethodFilter] = useState('All')
  const [extendModal, setExtendModal] = useState<Sub | null>(null)
  const [newEndDate, setNewEndDate] = useState('')
  const [extendReason, setExtendReason] = useState('')
  const [deactivateTarget, setDeactivateTarget] = useState<Sub | null>(null)

  const filtered = subscriptions.filter(s => {
    const q = search.toLowerCase()
    if (q && !s.user.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q)) return false
    if (planFilter !== 'All Plans' && s.plan !== planFilter) return false
    if (statusFilter !== 'All' && s.status !== statusFilter) return false
    if (methodFilter !== 'All' && s.method !== methodFilter) return false
    return true
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Active Subscriptions</h1>
        <p className="text-text-secondary text-sm mt-1">Manage user subscription plans and billing</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Active" value="1,284" change="+5.1% vs last month" changeType="up" icon={<Users size={20} className="text-primary" />} color="bg-primary/10" />
        <StatCard title="Expiring This Week" value="47" change="Next 7 days" changeType="down" icon={<CalendarDays size={20} className="text-orange-500" />} color="bg-orange-100" />
        <StatCard title="Expired / Unpaid" value="23" change="Needs attention" changeType="down" icon={<XCircle size={20} className="text-danger" />} color="bg-red-100" />
        <StatCard title="Revenue This Month" value="J$284,500" change="+18% vs last month" changeType="up" icon={<DollarSign size={20} className="text-success" />} color="bg-green-100" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none" value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
              {['All Plans', 'Free', 'Basic', 'Pro', 'Premium'].map(p => <option key={p}>{p}</option>)}
            </select>
            <select className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {['All', 'Active', 'Expired', 'Suspended'].map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none" value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
              {['All', 'Fygaro', 'Bill Express', 'Manual'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              <th className="text-left px-5 py-3 text-text-secondary font-medium">User</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Plan</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Start Date</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">End Date</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Payment Method</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Status</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(sub => (
              <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <InitAvatar name={sub.user} />
                    <div>
                      <p className="font-medium text-text-primary">{sub.user}</p>
                      <p className="text-xs text-text-secondary">{sub.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${planBadge(sub.plan)}`}>{sub.plan}</span>
                </td>
                <td className="px-5 py-3 text-text-secondary">{sub.start}</td>
                <td className={`px-5 py-3 ${endDateClass(sub.status, sub.end)}`}>{sub.end}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${methodBadge(sub.method)}`}>{sub.method}</span>
                </td>
                <td className="px-5 py-3"><StatusBadge status={sub.status.toLowerCase()} /></td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setExtendModal(sub); setNewEndDate(''); setExtendReason('') }}
                      className="flex items-center gap-1 px-2.5 py-1.5 border border-primary text-primary text-xs rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <Calendar size={12} /> Extend
                    </button>
                    <button
                      onClick={() => setDeactivateTarget(sub)}
                      className="flex items-center gap-1 px-2.5 py-1.5 border border-danger text-danger text-xs rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <XCircle size={12} /> Deactivate
                    </button>
                    <a href="/admin/users" className="flex items-center gap-1 px-2.5 py-1.5 text-slate-500 text-xs rounded-lg hover:bg-slate-100 transition-colors">
                      <Eye size={12} /> View
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!extendModal} onClose={() => setExtendModal(null)} title="Extend Subscription">
        {extendModal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-secondary mb-1">User</label>
                <input className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-slate-50" value={extendModal.user} readOnly />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">Current Plan</label>
                <input className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-slate-50" value={extendModal.plan} readOnly />
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Current End Date</label>
              <input className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-slate-50" value={extendModal.end} readOnly />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">New End Date</label>
              <input type="date" className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Reason</label>
              <input className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. payment delay, grace period" value={extendReason} onChange={e => setExtendReason(e.target.value)} />
            </div>
            <button onClick={() => setExtendModal(null)} className="w-full bg-primary text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-800 transition-colors mt-2">
              Confirm Extension
            </button>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={() => setDeactivateTarget(null)}
        title="Deactivate Subscription"
        message={`Are you sure you want to deactivate the subscription for ${deactivateTarget?.user}? This action cannot be undone.`}
        confirmLabel="Deactivate"
      />
    </div>
  )
}
