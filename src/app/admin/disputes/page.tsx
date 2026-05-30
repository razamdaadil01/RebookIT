'use client'

import { useState } from 'react'
import { Search, Eye, AlertTriangle, ChevronLeft, ChevronRight, X, MessageSquare } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'

const disputes = [
  { id: 'DIS-1047', reporter: 'Alicia Mohammed', reportedUser: 'Marcus Williams', listing: 'iPhone 14 Pro', reason: 'Item Not as Described', date: 'May 28, 2026', status: 'Open',
    statement: 'The phone was advertised as "Excellent condition" but arrived with a cracked screen on the bottom edge and missing the original charger.', evidence: true },
  { id: 'DIS-1046', reporter: 'Christopher Paul', reportedUser: 'Simone Baptiste', listing: 'Nike Sneakers', reason: 'Counterfeit Item', date: 'May 27, 2026', status: 'Under Review',
    statement: 'I purchased these sneakers and they appear to be counterfeit. The Nike logo placement is off and the box has spelling errors.', evidence: true },
  { id: 'DIS-1045', reporter: 'Sandra Hernandez', reportedUser: 'David Ramoutar', listing: 'Samsung TV', reason: 'Fraud', date: 'May 25, 2026', status: 'Open',
    statement: 'I paid TTD $6,800 via bank transfer but the seller stopped responding after receiving payment. The listing has been removed.', evidence: false },
  { id: 'DIS-1044', reporter: 'Kezia Phillip', reportedUser: 'James Crichlow', listing: 'PS5 Console', reason: 'Spam', date: 'May 23, 2026', status: 'Resolved',
    statement: 'This seller has multiple duplicate listings for the same item, inflating prices.', evidence: false },
  { id: 'DIS-1043', reporter: 'Devon Rampersad', reportedUser: 'Vikram Singh', listing: 'MacBook Air M2', reason: 'Item Not as Described', date: 'May 20, 2026', status: 'Closed',
    statement: 'Resolved after seller provided full refund.', evidence: true },
  { id: 'DIS-1042', reporter: 'Natasha Beckles', reportedUser: 'Tony Alleyne', listing: 'Dining Table', reason: 'Inappropriate Content', date: 'May 18, 2026', status: 'Closed',
    statement: 'Listing contained inappropriate images that violated community guidelines.', evidence: true },
  { id: 'DIS-1041', reporter: 'Candice Fraser', reportedUser: 'Omar Abdullah', listing: '2BR Apartment', reason: 'Fraud', date: 'May 15, 2026', status: 'Resolved',
    statement: 'Landlord charged a deposit for a property that was not available for rent.', evidence: false },
]

const TABS = ['Open Disputes', 'Under Review', 'Resolved', 'Closed']
const PAGE_SIZE = 10

export default function DisputesPage() {
  const [tab, setTab] = useState('Open Disputes')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<typeof disputes[0] | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [confirmAction, setConfirmAction] = useState<string | null>(null)

  const filtered = disputes.filter(d => {
    const matchTab = tab === 'Open Disputes' ? d.status === 'Open'
      : tab === 'Under Review' ? d.status === 'Under Review'
      : tab === 'Resolved' ? d.status === 'Resolved'
      : d.status === 'Closed'
    const matchSearch = search === '' || d.id.toLowerCase().includes(search.toLowerCase()) || d.reporter.toLowerCase().includes(search.toLowerCase()) || d.reportedUser.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Reports & Disputes</h1>
        <p className="text-text-secondary text-sm mt-1">Handle user disputes and content reports.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Open', value: disputes.filter(d=>d.status==='Open').length, color: 'text-danger', bg: 'bg-red-100' },
          { label: 'Under Review', value: disputes.filter(d=>d.status==='Under Review').length, color: 'text-warning', bg: 'bg-yellow-100' },
          { label: 'Resolved', value: disputes.filter(d=>d.status==='Resolved').length, color: 'text-success', bg: 'bg-green-100' },
          { label: 'Closed', value: disputes.filter(d=>d.status==='Closed').length, color: 'text-slate-600', bg: 'bg-slate-100' },
        ].map(s => (
          <div key={s.label} className="card text-center p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-text-secondary mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Tabs row */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search disputes..." className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); setPage(1) }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors
                ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
              {t}
              {t === 'Open Disputes' && <span className="ml-1.5 bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full">3</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                {['Dispute ID', 'Reporter', 'Reported User', 'Listing', 'Reason', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-text-secondary">
                  <div className="flex flex-col items-center gap-2"><AlertTriangle size={32} className="text-slate-300" /><p>No disputes found</p></div>
                </td></tr>
              ) : paginated.map(d => (
                <tr key={d.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-xs text-primary font-medium">{d.id}</td>
                  <td className="py-3 px-4 font-medium text-text-primary">{d.reporter}</td>
                  <td className="py-3 px-4 text-text-secondary">{d.reportedUser}</td>
                  <td className="py-3 px-4 text-text-primary max-w-[120px] truncate">{d.listing}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full">{d.reason}</span>
                  </td>
                  <td className="py-3 px-4 text-text-secondary text-xs whitespace-nowrap">{d.date}</td>
                  <td className="py-3 px-4"><StatusBadge status={d.status} /></td>
                  <td className="py-3 px-4">
                    <button onClick={() => { setSelected(d); setAdminNotes('') }} className="p-1.5 rounded-md text-slate-500 hover:bg-blue-50 hover:text-primary"><Eye size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-slate-50">
          <p className="text-sm text-text-secondary">{filtered.length} disputes</p>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-md border border-border bg-white disabled:opacity-40"><ChevronLeft size={15} /></button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>setPage(p)} className={`w-7 h-7 rounded-md text-sm font-medium ${page===p?'bg-primary text-white':'border border-border bg-white hover:bg-slate-50'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-md border border-border bg-white disabled:opacity-40"><ChevronRight size={15} /></button>
          </div>
        </div>
      </div>

      {/* Dispute Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg bg-white shadow-xl flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-base font-semibold text-text-primary">{selected.id}</h3>
                <p className="text-xs text-text-secondary">{selected.reason}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-md hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="card p-3">
                  <p className="text-xs text-text-secondary mb-1">Reporter</p>
                  <p className="text-sm font-semibold text-text-primary">{selected.reporter}</p>
                </div>
                <div className="card p-3">
                  <p className="text-xs text-text-secondary mb-1">Reported User</p>
                  <p className="text-sm font-semibold text-text-primary">{selected.reportedUser}</p>
                </div>
              </div>
              <div className="card p-4">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Listing</p>
                <p className="text-sm font-medium text-text-primary">{selected.listing}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Reporter Statement</p>
                <p className="text-sm text-text-primary leading-relaxed">{selected.statement}</p>
              </div>
              {selected.evidence ? (
                <div className="card p-4">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Evidence</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center text-2xl">🖼️</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg text-sm text-text-secondary">No evidence images provided.</div>
              )}
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide block mb-2">Admin Notes</label>
                <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={3} placeholder="Add internal notes about this dispute..." className="input resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setConfirmAction('Warn User')} className="py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-sm font-medium hover:bg-yellow-100 flex items-center justify-center gap-1.5"><AlertTriangle size={14} />Warn User</button>
                <button onClick={() => setConfirmAction('Remove Listing')} className="py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg text-sm font-medium hover:bg-orange-100 flex items-center justify-center gap-1.5"><X size={14} />Remove Listing</button>
                <button onClick={() => setConfirmAction('Suspend User')} className="py-2 bg-red-50 text-danger border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-1.5"><AlertTriangle size={14} />Suspend User</button>
                <button onClick={() => setConfirmAction('Mark Resolved')} className="py-2 bg-green-50 text-success border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 flex items-center justify-center gap-1.5"><MessageSquare size={14} />Mark Resolved</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmAction(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-base font-semibold">{confirmAction}</h3>
            <p className="text-sm text-text-secondary mt-2">Are you sure you want to <strong>{confirmAction.toLowerCase()}</strong>? This action will be logged.</p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setConfirmAction(null)} className="flex-1 btn-secondary justify-center">Cancel</button>
              <button onClick={() => { setConfirmAction(null); setSelected(null) }} className="flex-1 btn-primary justify-center">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
