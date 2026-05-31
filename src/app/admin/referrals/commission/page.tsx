'use client'

import { useState } from 'react'
import { Save, ToggleLeft, ToggleRight, Search, History, Percent } from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'

function InitAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-purple-500', 'bg-teal-500']
  const c = colors[name.charCodeAt(0) % colors.length]
  const dim = size === 'lg' ? 'w-12 h-12 text-base' : 'w-8 h-8 text-xs'
  return <div className={`${dim} rounded-full ${c} flex items-center justify-center text-white font-bold shrink-0`}>{initials}</div>
}

const auditLog = [
  { by: 'Super Admin',   field: 'Premium Commission Rate', oldVal: '10%', newVal: '12%', date: 'May 15, 2026 10:30' },
  { by: 'Super Admin',   field: 'Commission on Renewal',   oldVal: 'OFF', newVal: 'ON',  date: 'May 10, 2026 14:22' },
  { by: 'Finance Admin', field: 'Max Referrals/Month',     oldVal: '15',  newVal: '20',  date: 'Apr 28, 2026 09:15' },
  { by: 'Super Admin',   field: 'Global Commission Rate',  oldVal: '8%',  newVal: '10%', date: 'Apr 15, 2026 11:00' },
]

const initialPlanRates = [
  { plan: 'Free',    price: 0,    rate: 0,  color: 'bg-slate-100 text-slate-600' },
  { plan: 'Basic',   price: 1500, rate: 10, color: 'bg-blue-100 text-blue-700'   },
  { plan: 'Pro',     price: 3000, rate: 10, color: 'bg-purple-100 text-purple-700'},
  { plan: 'Premium', price: 5000, rate: 12, color: 'bg-amber-100 text-amber-700' },
]

const ruleDefaults = [
  { label: 'Self-referral allowed', desc: 'Allow users to refer themselves using another account', enabled: false },
  { label: 'Commission on plan renewal', desc: 'Pay commission when a referred user renews their subscription', enabled: true },
]

export default function CommissionPage() {
  const [globalRate, setGlobalRate] = useState(10)
  const [planRates, setPlanRates] = useState(initialPlanRates.map(p => ({ ...p })))
  const [rules, setRules] = useState(ruleDefaults.map(r => ({ ...r })))
  const [maxReferrals, setMaxReferrals] = useState(20)
  const [userSearch, setUserSearch] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmMsg, setConfirmMsg] = useState('')
  const [userPaused, setUserPaused] = useState<Record<string, boolean>>({ 'tricia': false, 'marcus': false })
  const [userRates, setUserRates] = useState<Record<string, number>>({ 'tricia': 10, 'marcus': 10 })

  const showConfirm = (msg: string) => {
    setConfirmMsg(msg)
    setConfirmOpen(true)
  }

  const dummyUsers = [
    { key: 'tricia', name: 'Tricia Clarke', email: 'tricia@email.com' },
    { key: 'marcus', name: 'Marcus Williams', email: 'marcus@email.com' },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Commission Configuration</h1>
        <p className="text-text-secondary text-sm mt-1">Set commission rates and program rules</p>
      </div>

      {/* Section 1: Global Rate */}
      <div className="card">
        <div className="flex items-center gap-2 mb-1">
          <Percent size={16} className="text-primary" />
          <h2 className="text-base font-semibold text-text-primary">Global Commission Rate</h2>
        </div>
        <p className="text-sm text-text-secondary mb-4">Default rate applied to all plans unless overridden</p>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="number"
              min={0}
              max={100}
              value={globalRate}
              onChange={e => setGlobalRate(Number(e.target.value))}
              className="input w-24 pr-8 text-center font-semibold"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">%</span>
          </div>
          <button
            onClick={() => showConfirm(`Save global commission rate as ${globalRate}%?`)}
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Save size={14} />
            Save
          </button>
        </div>
        <p className="text-xs text-text-secondary mt-3">Last changed by Super Admin on May 15, 2026 at 10:30 AM</p>
      </div>

      {/* Section 2: Per Plan Commission */}
      <div className="card">
        <h2 className="text-base font-semibold text-text-primary mb-4">Commission by Plan</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="pb-3 text-left font-medium">Plan</th>
                <th className="pb-3 text-right font-medium">Subscription (J$)</th>
                <th className="pb-3 text-center font-medium">Commission Rate</th>
                <th className="pb-3 text-right font-medium">Commission Amount</th>
                <th className="pb-3 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {planRates.map((p, i) => (
                <tr key={p.plan} className="border-b border-border/50">
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.color}`}>{p.plan}</span>
                  </td>
                  <td className="py-3 text-right font-medium">J${p.price.toLocaleString()}</td>
                  <td className="py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={p.rate}
                          onChange={e => {
                            const updated = [...planRates]
                            updated[i] = { ...updated[i], rate: Number(e.target.value) }
                            setPlanRates(updated)
                          }}
                          className="input w-20 pr-7 text-center"
                          disabled={p.plan === 'Free'}
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary text-xs">%</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right font-semibold text-primary">
                    J${Math.round(p.price * p.rate / 100).toLocaleString()}
                  </td>
                  <td className="py-3 text-center">
                    {p.plan !== 'Free' && (
                      <button
                        onClick={() => showConfirm(`Save ${p.plan} commission rate as ${p.rate}%?`)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-slate-50 transition-colors mx-auto text-text-secondary"
                      >
                        <Save size={12} />
                        Save
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Rules */}
      <div className="card">
        <h2 className="text-base font-semibold text-text-primary mb-4">Program Rules</h2>
        <div className="space-y-4">
          {rules.map((rule, i) => (
            <div key={rule.label} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-sm font-medium text-text-primary">{rule.label}</p>
                <p className="text-xs text-text-secondary mt-0.5">{rule.desc}</p>
              </div>
              <button
                onClick={() => {
                  const updated = [...rules]
                  updated[i] = { ...updated[i], enabled: !updated[i].enabled }
                  setRules(updated)
                }}
                className="ml-4 shrink-0"
              >
                {rule.enabled
                  ? <ToggleRight size={28} className="text-primary" />
                  : <ToggleLeft size={28} className="text-slate-400" />
                }
              </button>
            </div>
          ))}
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Max referrals per user per month</p>
              <p className="text-xs text-text-secondary mt-0.5">Limit how many referrals a single user can submit monthly</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="number"
                min={1}
                value={maxReferrals}
                onChange={e => setMaxReferrals(Number(e.target.value))}
                className="input w-20 text-center"
              />
              <button
                onClick={() => showConfirm(`Save max referrals per month as ${maxReferrals}?`)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-medium btn-primary rounded-lg"
              >
                <Save size={12} />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Per User Override */}
      <div className="card">
        <h2 className="text-base font-semibold text-text-primary mb-4">User Commission Override</h2>
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            className="input pl-9 w-full sm:w-80"
            placeholder="Search user by name or email..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
          />
        </div>
        {userSearch.length > 2 && (
          <div className="space-y-3">
            {dummyUsers.map(u => (
              <div key={u.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-slate-50">
                <div className="flex items-center gap-3">
                  <InitAvatar name={u.name} size="lg" />
                  <div>
                    <p className="font-medium text-text-primary">{u.name}</p>
                    <p className="text-xs text-text-secondary">{u.email}</p>
                    <p className="text-xs text-text-secondary mt-0.5">Current Rate: <span className="font-semibold">{userRates[u.key]}%</span></p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${userPaused[u.key] ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {userPaused[u.key] ? 'Paused' : 'Active'}
                  </span>
                  <button
                    onClick={() => setUserPaused(prev => ({ ...prev, [u.key]: !prev[u.key] }))}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-white transition-colors text-text-secondary"
                  >
                    {userPaused[u.key] ? 'Resume' : 'Pause'}
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={userRates[u.key]}
                        onChange={e => setUserRates(prev => ({ ...prev, [u.key]: Number(e.target.value) }))}
                        className="input w-20 pr-7 text-center text-sm"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary text-xs">%</span>
                    </div>
                    <button
                      onClick={() => showConfirm(`Override commission rate for ${u.name} to ${userRates[u.key]}%?`)}
                      className="btn-primary flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg"
                    >
                      <Save size={12} />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {userSearch.length > 0 && userSearch.length <= 2 && (
          <p className="text-sm text-text-secondary">Type at least 3 characters to search users.</p>
        )}
      </div>

      {/* Section 5: Audit Log */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <History size={16} className="text-text-secondary" />
          <h2 className="text-base font-semibold text-text-primary">Change History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="pb-3 text-left font-medium">Changed By</th>
                <th className="pb-3 text-left font-medium">Field</th>
                <th className="pb-3 text-left font-medium">Change</th>
                <th className="pb-3 text-left font-medium">Date &amp; Time</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((log, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-medium text-text-primary">{log.by}</td>
                  <td className="py-3 text-text-secondary">{log.field}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-2 text-xs">
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono">{log.oldVal}</span>
                      <span className="text-text-secondary">→</span>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-mono">{log.newVal}</span>
                    </span>
                  </td>
                  <td className="py-3 text-text-secondary text-xs">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
        title="Confirm Change"
        message={confirmMsg}
        confirmLabel="Save"
      />
    </div>
  )
}
