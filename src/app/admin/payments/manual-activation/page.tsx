'use client'

import { useState } from 'react'
import { Info, Search, CheckCircle } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'
import DataTable from '@/components/DataTable'
import Modal from '@/components/Modal'

// ─── Types ────────────────────────────────────────────────────────────────────

type UserResult = {
  name: string
  email: string
  currentPlan: string
  status: string
  parish: string
}

type Activation = {
  user: string
  plan: string
  activatedBy: string
  datetime: string
  ref: string
  reason: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const userResults: UserResult[] = [
  { name: 'Simone Edwards',  email: 'simone@email.com',   currentPlan: 'Basic', status: 'Expired', parish: 'Kingston' },
  { name: 'Fabian Thomas',   email: 'fabian@email.com',   currentPlan: 'Free',  status: 'Active',  parish: 'St. Andrew' },
  { name: 'Patricia Nelson', email: 'patricia@email.com', currentPlan: 'Pro',   status: 'Active',  parish: 'Clarendon' },
]

const recentActivations: Activation[] = [
  { user: 'Damion Jackson',  plan: 'Pro',     activatedBy: 'Super Admin',   datetime: 'May 31, 2026 11:45', ref: 'FYG-TXN-8827', reason: 'Fygaro webhook failed' },
  { user: 'Rohan Clarke',    plan: 'Premium', activatedBy: 'Super Admin',   datetime: 'May 31, 2026 10:30', ref: 'FYG-TXN-8823', reason: 'Fygaro webhook failed' },
  { user: 'Devon Brown',     plan: 'Basic',   activatedBy: 'Finance Admin', datetime: 'May 30, 2026 15:20', ref: 'INV-2041',     reason: 'Bill Express payment confirmed' },
  { user: 'Sandra Francis',  plan: 'Pro',     activatedBy: 'Super Admin',   datetime: 'May 29, 2026 09:15', ref: 'INV-2038',     reason: 'Bill Express payment confirmed' },
  { user: 'Clive Robinson',  plan: 'Basic',   activatedBy: 'Finance Admin', datetime: 'May 29, 2026 14:00', ref: 'FYG-TXN-8833', reason: 'Fygaro webhook failed' },
  { user: 'Andrea Bailey',   plan: 'Premium', activatedBy: 'Super Admin',   datetime: 'May 28, 2026 10:00', ref: 'INV-2035',     reason: 'Bill Express payment confirmed' },
  { user: 'Marcus Gordon',   plan: 'Pro',     activatedBy: 'Finance Admin', datetime: 'May 27, 2026 16:30', ref: 'SYS-ERR-014',  reason: 'System error — subscription not created' },
  { user: 'Pauline Stewart', plan: 'Basic',   activatedBy: 'Super Admin',   datetime: 'May 26, 2026 11:00', ref: 'INV-2030',     reason: 'Admin override' },
]

const PLAN_OPTIONS = [
  { label: 'Basic — J$1,500/month',   value: 'Basic',   amount: 1500 },
  { label: 'Pro — J$3,000/month',     value: 'Pro',     amount: 3000 },
  { label: 'Premium — J$5,000/month', value: 'Premium', amount: 5000 },
]

const REASONS = [
  'Fygaro webhook failed',
  'Bill Express payment confirmed',
  'System error — subscription not created',
  'Admin override',
  'Other',
]

const PLAN_STYLES: Record<string, string> = {
  Basic:   'bg-blue-100 text-blue-700',
  Pro:     'bg-purple-100 text-purple-700',
  Premium: 'bg-amber-100 text-amber-700',
  Free:    'bg-slate-100 text-slate-600',
}

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PLAN_STYLES[plan] ?? 'bg-slate-100 text-slate-600'}`}>
      {plan}
    </span>
  )
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500']

function avatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function InitAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'
  return (
    <div className={`${sizeClass} ${avatarColor(name)} rounded-full flex items-center justify-center font-bold text-white shrink-0`}>
      {getInitials(name)}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManualActivationPage() {
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null)
  const [planType, setPlanType] = useState<'Subscription' | 'Ad Boost'>('Subscription')
  const [selectedPlan, setSelectedPlan] = useState('Basic')
  const [startDate, setStartDate] = useState('2026-05-31')
  const [endDate, setEndDate] = useState('2026-06-30')
  const [paymentRef, setPaymentRef] = useState('')
  const [reason, setReason] = useState(REASONS[0])
  const [notes, setNotes] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const showResults = search.length > 2

  const planAmount = PLAN_OPTIONS.find(p => p.value === selectedPlan)?.amount ?? 0

  type Col = { header: string; accessor: (row: Activation) => React.ReactNode }
  const activationCols: Col[] = [
    {
      header: 'User',
      accessor: (row) => (
        <div className="flex items-center gap-2.5">
          <InitAvatar name={row.user} size="sm" />
          <span className="font-medium text-text-primary text-sm">{row.user}</span>
        </div>
      ),
    },
    { header: 'Plan',         accessor: (row) => <PlanBadge plan={row.plan} /> },
    { header: 'Activated By', accessor: (row) => <span className="text-sm text-text-secondary">{row.activatedBy}</span> },
    { header: 'Date & Time',  accessor: (row) => <span className="text-sm text-text-secondary whitespace-nowrap">{row.datetime}</span> },
    { header: 'Reference',    accessor: (row) => <span className="font-mono text-xs text-text-secondary">{row.ref}</span> },
    { header: 'Reason',       accessor: (row) => <span className="text-sm text-text-secondary">{row.reason}</span> },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Manual Plan Activation</h1>
        <p className="text-text-secondary mt-1">Manually activate subscriptions when automated flow fails</p>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          Use this for fail-safe activation when Fygaro webhook fails or Bill Express payment is confirmed but account not activated.
        </p>
      </div>

      {/* Section 1 — Find User */}
      <div className="card">
        <h2 className="text-base font-semibold text-text-primary mb-4">Find User</h2>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name / email / phone / User ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>

        {showResults && (
          <div className="mt-3 space-y-2">
            {userResults.map((u, i) => (
              <div
                key={i}
                onClick={() => { setSelectedUser(u); setSearch('') }}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors
                  ${selectedUser?.email === u.email ? 'border-primary bg-primary/5' : 'border-border hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <InitAvatar name={u.name} size="sm" />
                  <div>
                    <p className="font-medium text-text-primary text-sm">{u.name}</p>
                    <p className="text-xs text-text-secondary">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-xs text-text-secondary">Current Plan</p>
                    <PlanBadge plan={u.currentPlan} />
                  </div>
                  <div>
                    <StatusBadge status={u.status} />
                    <p className="text-xs text-text-secondary mt-1">{u.parish}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2 — Activation Form */}
      {selectedUser && (
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-base font-semibold text-text-primary">Activating plan for:</h2>
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              <InitAvatar name={selectedUser.name} size="sm" />
              {selectedUser.name}
            </div>
          </div>

          <div className="space-y-5">
            {/* Plan Type */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Plan Type</label>
              <div className="flex gap-4">
                {(['Subscription', 'Ad Boost'] as const).map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="planType"
                      value={type}
                      checked={planType === type}
                      onChange={() => setPlanType(type)}
                      className="text-primary"
                    />
                    <span className="text-sm text-text-primary">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Select Plan */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Select Plan</label>
              <select
                value={selectedPlan}
                onChange={e => setSelectedPlan(e.target.value)}
                className="input w-full"
              >
                {PLAN_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">End Date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input w-full" />
              </div>
            </div>

            {/* Payment Reference */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Payment Reference</label>
              <input
                type="text"
                placeholder="e.g. FYG-TXN-8823 or INV-2041"
                value={paymentRef}
                onChange={e => setPaymentRef(e.target.value)}
                className="input w-full"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Reason</label>
              <select value={reason} onChange={e => setReason(e.target.value)} className="input w-full">
                {REASONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Notes <span className="text-text-secondary font-normal">(optional)</span></label>
              <textarea
                rows={3}
                placeholder="Add any additional context..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="input w-full resize-none"
              />
            </div>

            <button
              onClick={() => setConfirmOpen(true)}
              className="btn-primary w-full py-3 text-sm font-semibold"
            >
              Confirm Activation
            </button>
          </div>
        </div>
      )}

      {/* Recent Manual Activations */}
      <div className="card">
        <h2 className="text-base font-semibold text-text-primary mb-4">Recent Manual Activations</h2>
        <DataTable
          columns={activationCols as Parameters<typeof DataTable>[0]['columns']}
          data={recentActivations as unknown as Record<string, unknown>[]}
          pageSize={10}
        />
      </div>

      {/* Confirmation Modal */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Manual Activation">
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">User</span>
              <span className="font-medium text-text-primary">{selectedUser?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Plan</span>
              <PlanBadge plan={selectedPlan} />
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Amount</span>
              <span className="font-medium text-text-primary">J${planAmount.toLocaleString()}/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Start Date</span>
              <span className="font-medium text-text-primary">{startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">End Date</span>
              <span className="font-medium text-text-primary">{endDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Reference</span>
              <span className="font-mono text-xs text-text-primary">{paymentRef || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Reason</span>
              <span className="font-medium text-text-primary text-right max-w-[60%]">{reason}</span>
            </div>
          </div>

          <p className="text-sm text-danger font-medium flex items-center gap-2">
            <span>⚠</span> This action will immediately activate the plan and send a confirmation email.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setConfirmOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { setConfirmOpen(false); setSelectedUser(null) }}
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={15} /> Confirm Activation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
