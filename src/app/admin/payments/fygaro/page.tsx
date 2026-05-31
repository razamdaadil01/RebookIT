'use client'

import { useState } from 'react'
import {
  Activity, DollarSign, XCircle, Clock, Eye, Zap, Search, X,
  CheckCircle,
} from 'lucide-react'
import StatCard from '@/components/StatCard'
import StatusBadge from '@/components/StatusBadge'
import DataTable from '@/components/DataTable'
import ConfirmDialog from '@/components/ConfirmDialog'

// ─── Types ────────────────────────────────────────────────────────────────────

type Transaction = {
  id: string
  user: string
  email: string
  plan: string
  amount: number
  ref: string
  datetime: string
  status: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const transactions: Transaction[] = [
  { id: 'FYG-001', user: 'Khalil Brown',      email: 'khalil@email.com',    plan: 'Pro',     amount: 3000, ref: 'FYG-TXN-8821', datetime: 'May 31, 2026 09:14', status: 'Success' },
  { id: 'FYG-002', user: 'Nadine Campbell',   email: 'nadine@email.com',    plan: 'Basic',   amount: 1500, ref: 'FYG-TXN-8822', datetime: 'May 31, 2026 09:32', status: 'Success' },
  { id: 'FYG-003', user: 'Rohan Clarke',      email: 'rohan@email.com',     plan: 'Premium', amount: 5000, ref: 'FYG-TXN-8823', datetime: 'May 31, 2026 10:01', status: 'Failed' },
  { id: 'FYG-004', user: 'Simone Edwards',    email: 'simone@email.com',    plan: 'Basic',   amount: 1500, ref: 'FYG-TXN-8824', datetime: 'May 31, 2026 10:15', status: 'Pending' },
  { id: 'FYG-005', user: 'Andre Gordon',      email: 'andre@email.com',     plan: 'Pro',     amount: 3000, ref: 'FYG-TXN-8825', datetime: 'May 31, 2026 10:44', status: 'Success' },
  { id: 'FYG-006', user: 'Tanya Harrison',    email: 'tanya@email.com',     plan: 'Free',    amount: 0,    ref: 'FYG-TXN-8826', datetime: 'May 31, 2026 11:02', status: 'Success' },
  { id: 'FYG-007', user: 'Damion Jackson',    email: 'damion@email.com',    plan: 'Premium', amount: 5000, ref: 'FYG-TXN-8827', datetime: 'May 31, 2026 11:20', status: 'Failed' },
  { id: 'FYG-008', user: 'Keisha Lawrence',   email: 'keisha@email.com',    plan: 'Basic',   amount: 1500, ref: 'FYG-TXN-8828', datetime: 'May 31, 2026 12:05', status: 'Refunded' },
  { id: 'FYG-009', user: 'Michael Morgan',    email: 'michael@email.com',   plan: 'Pro',     amount: 3000, ref: 'FYG-TXN-8829', datetime: 'May 31, 2026 12:33', status: 'Success' },
  { id: 'FYG-010', user: 'Patricia Nelson',   email: 'patricia@email.com',  plan: 'Basic',   amount: 1500, ref: 'FYG-TXN-8830', datetime: 'May 31, 2026 13:14', status: 'Pending' },
  { id: 'FYG-011', user: 'Omar Powell',       email: 'omar@email.com',      plan: 'Premium', amount: 5000, ref: 'FYG-TXN-8831', datetime: 'May 30, 2026 08:45', status: 'Success' },
  { id: 'FYG-012', user: 'Sharon Reid',       email: 'sharon@email.com',    plan: 'Pro',     amount: 3000, ref: 'FYG-TXN-8832', datetime: 'May 30, 2026 09:10', status: 'Success' },
  { id: 'FYG-013', user: 'Clive Robinson',    email: 'clive@email.com',     plan: 'Basic',   amount: 1500, ref: 'FYG-TXN-8833', datetime: 'May 30, 2026 10:22', status: 'Failed' },
  { id: 'FYG-014', user: 'Beverley Scott',    email: 'bev@email.com',       plan: 'Free',    amount: 0,    ref: 'FYG-TXN-8834', datetime: 'May 30, 2026 11:00', status: 'Success' },
  { id: 'FYG-015', user: 'Fabian Thomas',     email: 'fabian@email.com',    plan: 'Pro',     amount: 3000, ref: 'FYG-TXN-8835', datetime: 'May 30, 2026 13:45', status: 'Pending' },
  { id: 'FYG-016', user: 'Marcia Walker',     email: 'marcia@email.com',    plan: 'Premium', amount: 5000, ref: 'FYG-TXN-8836', datetime: 'May 29, 2026 09:30', status: 'Success' },
  { id: 'FYG-017', user: 'Duane Williams',    email: 'duane@email.com',     plan: 'Basic',   amount: 1500, ref: 'FYG-TXN-8837', datetime: 'May 29, 2026 10:15', status: 'Refunded' },
  { id: 'FYG-018', user: 'Natalie Wright',    email: 'natalie@email.com',   plan: 'Pro',     amount: 3000, ref: 'FYG-TXN-8838', datetime: 'May 29, 2026 14:20', status: 'Success' },
  { id: 'FYG-019', user: 'Errol Young',       email: 'errol@email.com',     plan: 'Free',    amount: 0,    ref: 'FYG-TXN-8839', datetime: 'May 28, 2026 08:00', status: 'Success' },
  { id: 'FYG-020', user: 'Claudette Hylton',  email: 'claudette@email.com', plan: 'Premium', amount: 5000, ref: 'FYG-TXN-8840', datetime: 'May 28, 2026 16:45', status: 'Pending' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-teal-500',
]

function avatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function InitAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-12 h-12 text-base' : size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'
  return (
    <div className={`${sizeClass} ${avatarColor(name)} rounded-full flex items-center justify-center font-bold text-white shrink-0`}>
      {getInitials(name)}
    </div>
  )
}

const PLAN_STYLES: Record<string, string> = {
  Free:    'bg-slate-100 text-slate-600',
  Basic:   'bg-blue-100 text-blue-700',
  Pro:     'bg-purple-100 text-purple-700',
  Premium: 'bg-amber-100 text-amber-700',
}

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PLAN_STYLES[plan] ?? 'bg-slate-100 text-slate-600'}`}>
      {plan}
    </span>
  )
}

// ─── Slide-over Drawer ────────────────────────────────────────────────────────

type DrawerProps = {
  txn: Transaction | null
  onClose: () => void
  onManualActivate: (txn: Transaction) => void
}

function TransactionDrawer({ txn, onClose, onManualActivate }: DrawerProps) {
  if (!txn) return null

  type Step = { label: string; done: boolean }
  const steps: Step[] = [
    { label: 'Payment Initiated',      done: true },
    { label: 'Payment Processed',      done: txn.status !== 'Pending' },
    { label: 'Subscription Activated', done: txn.status === 'Success' },
  ]

  const getStepIcon = (step: Step, index: number) => {
    if (txn.status === 'Failed' && index === 2) {
      return (
        <div className="w-6 h-6 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center">
          <X size={12} className="text-red-500" />
        </div>
      )
    }
    if (txn.status === 'Pending' && index === 2) {
      return <div className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 bg-white" />
    }
    if (step.done) {
      return (
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={14} className="text-green-600" />
        </div>
      )
    }
    return <div className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 bg-white" />
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-[#1a6bbf] px-6 pt-5 pb-6 shrink-0">
          <div className="flex items-start justify-between mb-5">
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Transaction Detail</p>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <X size={14} className="text-white" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="ring-4 ring-white/30 rounded-full">
              <InitAvatar name={txn.user} size="lg" />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-bold text-lg leading-tight">{txn.user}</h2>
              <p className="text-white/70 text-sm mt-0.5">{txn.email}</p>
              <div className="mt-2">
                <StatusBadge status={txn.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Transaction Info */}
          <div className="card">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Transaction Info</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Reference ID</span>
                <span className="font-medium text-text-primary font-mono">{txn.ref}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Date & Time</span>
                <span className="font-medium text-text-primary">{txn.datetime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Gateway</span>
                <span className="font-medium text-text-primary">Fygaro</span>
              </div>
            </div>
          </div>

          {/* Plan Details */}
          <div className="card">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Plan Details</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm items-center">
                <span className="text-text-secondary">Plan Name</span>
                <PlanBadge plan={txn.plan} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Amount</span>
                <span className="font-medium text-text-primary">J${txn.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Billing Period</span>
                <span className="font-medium text-text-primary">Monthly</span>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="card">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-4">Status Timeline</p>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  {getStepIcon(step, i)}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${step.done && !(txn.status === 'Failed' && i === 2) ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {step.label}
                    </p>
                  </div>
                  {step.done && !(txn.status === 'Failed' && i === 2) && (
                    <CheckCircle size={14} className="text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border bg-white p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          {txn.status === 'Failed' && (
            <button
              onClick={() => onManualActivate(txn)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              <Zap size={14} /> Activate Manually
            </button>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FygaroPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [planFilter, setPlanFilter] = useState('All Plans')
  const [drawerTxn, setDrawerTxn] = useState<Transaction | null>(null)
  const [confirmTxn, setConfirmTxn] = useState<Transaction | null>(null)

  const filtered = transactions.filter(t => {
    const matchSearch = !search || t.user.toLowerCase().includes(search.toLowerCase()) || t.ref.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || t.status === statusFilter
    const matchPlan = planFilter === 'All Plans' || t.plan === planFilter
    return matchSearch && matchStatus && matchPlan
  })

  const failedTxns = transactions.filter(t => t.status === 'Failed')

  type Col = { header: string; accessor: (row: Transaction) => React.ReactNode; className?: string }

  const columns: Col[] = [
    {
      header: 'User',
      accessor: (row) => (
        <div className="flex items-center gap-2.5">
          <InitAvatar name={row.user} size="sm" />
          <div className="min-w-0">
            <p className="font-medium text-text-primary text-sm truncate">{row.user}</p>
            <p className="text-xs text-text-secondary truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Plan',
      accessor: (row) => <PlanBadge plan={row.plan} />,
    },
    {
      header: 'Amount',
      accessor: (row) => (
        <span className="font-semibold text-text-primary">
          {row.amount === 0 ? 'Free' : `J$${row.amount.toLocaleString()}`}
        </span>
      ),
    },
    {
      header: 'Reference ID',
      accessor: (row) => <span className="font-mono text-xs text-text-secondary">{row.ref}</span>,
    },
    {
      header: 'Date & Time',
      accessor: (row) => <span className="text-sm text-text-secondary whitespace-nowrap">{row.datetime}</span>,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDrawerTxn(row)}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors"
            title="View Details"
          >
            <Eye size={15} />
          </button>
          {row.status === 'Failed' && (
            <button
              onClick={() => setConfirmTxn(row)}
              className="p-1.5 rounded-md text-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              title="Manual Activate"
            >
              <Zap size={15} />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Fygaro Payment Transactions</h1>
        <p className="text-text-secondary mt-1">Monitor all transactions processed through Fygaro</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Transactions Today"
          value={18}
          change="+4 from yesterday"
          changeType="up"
          icon={<Activity size={20} className="text-primary" />}
          color="bg-primary/10"
        />
        <StatCard
          title="Revenue This Month"
          value="J$284,500"
          change="+12.3%"
          changeType="up"
          icon={<DollarSign size={20} className="text-green-600" />}
          color="bg-green-100"
        />
        {/* Failed Payments — custom card with badge */}
        <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle size={20} className="text-danger" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-danger/10 text-danger">Needs Attention</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">3</p>
            <p className="text-sm text-text-secondary mt-0.5">Failed Payments</p>
          </div>
        </div>
        <StatCard
          title="Pending Activations"
          value={5}
          change="Awaiting action"
          changeType="down"
          icon={<Clock size={20} className="text-warning" />}
          color="bg-yellow-100"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or reference..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="input w-auto"
        >
          {['All', 'Success', 'Failed', 'Pending', 'Refunded'].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={planFilter}
          onChange={e => setPlanFilter(e.target.value)}
          className="input w-auto"
        >
          {['All Plans', 'Free', 'Basic', 'Pro', 'Premium'].map(p => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <button className="px-3 py-2 rounded-lg border border-border text-sm text-text-secondary bg-white hover:bg-slate-50 transition-colors flex items-center gap-2">
          <Clock size={14} /> Last 7 Days
        </button>
      </div>

      {/* Main Table */}
      <div className="card">
        <DataTable
          columns={columns as Parameters<typeof DataTable>[0]['columns']}
          data={filtered as unknown as Record<string, unknown>[]}
          pageSize={10}
        />
      </div>

      {/* Failed Payments Section */}
      <div className="card border-l-4 border-l-danger">
        <div className="flex items-center gap-2 mb-4">
          <XCircle size={18} className="text-danger" />
          <h3 className="font-semibold text-danger">Failed Payments — Requires Attention</h3>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                {['User', 'Plan', 'Amount', 'Reference ID', 'Date & Time', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {failedTxns.map(t => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <InitAvatar name={t.user} size="sm" />
                      <div>
                        <p className="font-medium text-text-primary">{t.user}</p>
                        <p className="text-xs text-text-secondary">{t.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><PlanBadge plan={t.plan} /></td>
                  <td className="px-4 py-3 font-semibold">J${t.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">{t.ref}</td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{t.datetime}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setConfirmTxn(t)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-orange-600 transition-colors"
                    >
                      <Zap size={12} /> Activate Manually
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Drawer */}
      <TransactionDrawer
        txn={drawerTxn}
        onClose={() => setDrawerTxn(null)}
        onManualActivate={(t) => { setDrawerTxn(null); setConfirmTxn(t) }}
      />

      {/* Confirm Manual Activation */}
      <ConfirmDialog
        open={!!confirmTxn}
        onClose={() => setConfirmTxn(null)}
        onConfirm={() => setConfirmTxn(null)}
        title="Manual Activation"
        message={confirmTxn ? `Are you sure you want to manually activate the ${confirmTxn.plan} plan for ${confirmTxn.user}?` : ''}
        confirmLabel="Activate"
        danger={false}
      />
    </div>
  )
}
