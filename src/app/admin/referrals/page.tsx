'use client'

import { useState } from 'react'
import { Search, Users, Gift, DollarSign, Clock, Save, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'

const referrals = [
  { id: 1, referrer: 'Marcus Williams', referred: 'Alicia Mohammed', date: 'May 20, 2026', status: 'Converted', commission: 125 },
  { id: 2, referrer: 'Kerri-Ann Joseph', referred: 'Devon Rampersad', date: 'May 18, 2026', status: 'Joined', commission: 50 },
  { id: 3, referrer: 'Rajesh Persad', referred: 'Sandra Hernandez', date: 'May 15, 2026', status: 'Converted', commission: 125 },
  { id: 4, referrer: 'Marcus Williams', referred: 'Christopher Paul', date: 'May 12, 2026', status: 'Joined', commission: 50 },
  { id: 5, referrer: 'Vikram Singh', referred: 'Candice Fraser', date: 'May 10, 2026', status: 'Joined', commission: 50 },
  { id: 6, referrer: 'Tricia Clarke', referred: 'Natasha Beckles', date: 'May 8, 2026', status: 'Converted', commission: 125 },
  { id: 7, referrer: 'Priya Ramkissoon', referred: 'James Crichlow', date: 'May 5, 2026', status: 'Joined', commission: 50 },
  { id: 8, referrer: 'Tony Alleyne', referred: 'Michelle Narine', date: 'May 3, 2026', status: 'Converted', commission: 125 },
  { id: 9, referrer: 'Omar Abdullah', referred: 'Kezia Phillip', date: 'May 1, 2026', status: 'Converted', commission: 125 },
  { id: 10, referrer: 'Kerri-Ann Joseph', referred: 'Anil Kumar', date: 'Apr 28, 2026', status: 'Joined', commission: 50 },
]

const commissionQueue = [
  { id: 1, seller: 'Marcus Williams', amount: 175, type: 'Referral Commission', date: 'May 25, 2026', status: 'Pending' },
  { id: 2, seller: 'Kerri-Ann Joseph', amount: 100, type: 'Referral Commission', date: 'May 24, 2026', status: 'Pending' },
  { id: 3, seller: 'Tricia Clarke', amount: 125, type: 'Referral Commission', date: 'May 22, 2026', status: 'Pending' },
]

const PAGE_SIZE = 10

export default function ReferralsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [commPct, setCommPct] = useState('5')
  const [minWithdraw, setMinWithdraw] = useState('50')
  const [programActive, setProgramActive] = useState(true)
  const [confirmAction, setConfirmAction] = useState<{action: string; item: typeof commissionQueue[0]} | null>(null)

  const filtered = referrals.filter(r =>
    search === '' || r.referrer.toLowerCase().includes(search.toLowerCase()) || r.referred.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Refer & Earn / Commissions</h1>
        <p className="text-text-secondary text-sm mt-1">Manage the referral program and commission payouts.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Referrals', value: '847', icon: <Users size={20} className="text-primary" />, bg: 'bg-primary/10' },
          { label: 'Active Referrers', value: '234', icon: <Gift size={20} className="text-purple-600" />, bg: 'bg-purple-100' },
          { label: 'Commission Paid', value: 'TTD $12,400', icon: <DollarSign size={20} className="text-success" />, bg: 'bg-green-100' },
          { label: 'Commission Pending', value: 'TTD $3,200', icon: <Clock size={20} className="text-warning" />, bg: 'bg-yellow-100' },
        ].map(stat => (
          <div key={stat.label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>{stat.icon}</div>
            <div><p className="text-xs text-text-secondary">{stat.label}</p><p className="text-lg font-bold text-text-primary">{stat.value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-4">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search referrals..." className="input pl-9" />
            </div>
          </div>
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">Referral History</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-slate-50">
                  {['Referrer', 'Referred User', 'Date', 'Status', 'Commission'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(r => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-text-primary">{r.referrer}</td>
                    <td className="py-3 px-4 text-text-secondary">{r.referred}</td>
                    <td className="py-3 px-4 text-text-secondary text-xs">{r.date}</td>
                    <td className="py-3 px-4"><StatusBadge status={r.status} /></td>
                    <td className="py-3 px-4 font-semibold text-success">TTD ${r.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-slate-50">
              <p className="text-sm text-text-secondary">{filtered.length} referrals</p>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-md border border-border bg-white disabled:opacity-40"><ChevronLeft size={15} /></button>
                <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-md border border-border bg-white disabled:opacity-40"><ChevronRight size={15} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings + Queue */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Commission Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Referral Program</p>
                  <p className="text-xs text-text-secondary mt-0.5">{programActive ? 'Currently active' : 'Currently disabled'}</p>
                </div>
                <button onClick={() => setProgramActive(!programActive)} className={`relative w-11 h-6 rounded-full transition-colors ${programActive ? 'bg-success' : 'bg-slate-300'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${programActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">Commission Rate (%)</label>
                <div className="relative">
                  <input value={commPct} onChange={e => setCommPct(e.target.value)} type="number" min="0" max="100" className="input pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">%</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">Min Withdrawal (TTD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">$</span>
                  <input value={minWithdraw} onChange={e => setMinWithdraw(e.target.value)} type="number" className="input pl-7" />
                </div>
              </div>
              <button className="w-full btn-primary justify-center"><Save size={15} />Save Settings</button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Pending Commission Payouts</h2>
            <div className="space-y-3">
              {commissionQueue.map(item => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-text-primary">{item.seller}</p>
                    <span className="text-sm font-bold text-accent">TTD ${item.amount}</span>
                  </div>
                  <p className="text-xs text-text-secondary mb-2">{item.type} · {item.date}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setConfirmAction({ action: 'Approve', item })} className="flex-1 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-medium hover:bg-green-100 flex items-center justify-center gap-1"><CheckCircle size={12} />Approve</button>
                    <button onClick={() => setConfirmAction({ action: 'Reject', item })} className="flex-1 py-1 bg-red-50 text-danger border border-red-200 rounded text-xs font-medium hover:bg-red-100 flex items-center justify-center gap-1"><XCircle size={12} />Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmAction(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-base font-semibold">{confirmAction.action} Commission</h3>
            <p className="text-sm text-text-secondary mt-2">Are you sure you want to {confirmAction.action.toLowerCase()} TTD ${confirmAction.item.amount} commission for {confirmAction.item.seller}?</p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setConfirmAction(null)} className="flex-1 btn-secondary justify-center">Cancel</button>
              <button onClick={() => setConfirmAction(null)} className={`flex-1 justify-center ${confirmAction.action === 'Reject' ? 'btn-danger' : 'btn-primary'}`}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
