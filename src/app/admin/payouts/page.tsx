'use client'

import { useState } from 'react'
import { Search, CheckCircle, XCircle, ChevronLeft, ChevronRight, X, Banknote } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'

const payouts = [
  { id: 'PAY-2041', seller: 'Marcus Williams', bank: 'First Citizens Bank', account: '****4821', amount: 12400, requested: 'May 25, 2026', processed: '—', status: 'Pending' },
  { id: 'PAY-2040', seller: 'Kerri-Ann Joseph', bank: 'RBL Bank', account: '****3312', amount: 8700, requested: 'May 24, 2026', processed: 'May 27, 2026', status: 'Processed' },
  { id: 'PAY-2039', seller: 'Rajesh Persad', bank: 'Scotia Bank', account: '****7654', amount: 6200, requested: 'May 23, 2026', processed: '—', status: 'Pending' },
  { id: 'PAY-2038', seller: 'Vikram Singh', bank: 'First Citizens Bank', account: '****9087', amount: 5400, requested: 'May 22, 2026', processed: 'May 24, 2026', status: 'Processed' },
  { id: 'PAY-2037', seller: 'Tony Alleyne', bank: 'RBL Bank', account: '****2345', amount: 3100, requested: 'May 21, 2026', processed: '—', status: 'Failed' },
  { id: 'PAY-2036', seller: 'Priya Ramkissoon', bank: 'JMMB Bank', account: '****6789', amount: 2800, requested: 'May 20, 2026', processed: 'May 22, 2026', status: 'Processed' },
  { id: 'PAY-2035', seller: 'Omar Abdullah', bank: 'Scotia Bank', account: '****1234', amount: 4200, requested: 'May 19, 2026', processed: '—', status: 'Pending' },
  { id: 'PAY-2034', seller: 'Tricia Clarke', bank: 'First Citizens Bank', account: '****5678', amount: 1900, requested: 'May 18, 2026', processed: 'May 20, 2026', status: 'Processed' },
]

const TABS = ['Pending Payouts', 'Processed', 'Failed']
const PAGE_SIZE = 10

export default function PayoutsPage() {
  const [tab, setTab] = useState('Pending Payouts')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [markPaid, setMarkPaid] = useState<typeof payouts[0] | null>(null)
  const [refNum, setRefNum] = useState('')
  const [confirmAction, setConfirmAction] = useState<{action: string; payout: typeof payouts[0]} | null>(null)
  const [selected, setSelected] = useState<number[]>([])

  const filtered = payouts.filter(p => {
    const matchTab = tab === 'Pending Payouts' ? p.status === 'Pending' : tab === 'Processed' ? p.status === 'Processed' : p.status === 'Failed'
    const matchSearch = search === '' || p.seller.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)
  const pendingTotal = payouts.filter(p => p.status === 'Pending').reduce((a, p) => a + p.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Payout Management</h1>
          <p className="text-text-secondary text-sm mt-1">Approve and manage seller payout requests.</p>
        </div>
        {selected.length > 0 && (
          <button className="btn-primary"><CheckCircle size={16} />Bulk Approve ({selected.length})</button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-yellow-100 rounded-xl flex items-center justify-center"><Banknote size={22} className="text-warning" /></div>
          <div><p className="text-xs text-text-secondary">Pending Payouts</p><p className="text-xl font-bold text-text-primary">TTD ${pendingTotal.toLocaleString()}</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle size={22} className="text-success" /></div>
          <div><p className="text-xs text-text-secondary">Processed This Month</p><p className="text-xl font-bold text-text-primary">TTD $21,400</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center"><XCircle size={22} className="text-danger" /></div>
          <div><p className="text-xs text-text-secondary">Failed Payouts</p><p className="text-xl font-bold text-text-primary">1 payout</p></div>
        </div>
      </div>

      {/* Search + Tabs row */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by seller or payout ID..." className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); setPage(1) }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors
                ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
              {t}
              {t === 'Pending Payouts' && <span className="ml-1.5 bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0.5 rounded-full">3</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                {tab === 'Pending Payouts' && <th className="py-3 px-4 w-10"><input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(p => parseInt(p.id.split('-')[1])) : [])} className="rounded" /></th>}
                {['Payout ID', 'Seller', 'Bank / Account', 'Amount', 'Requested', 'Processed Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(payout => (
                <tr key={payout.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                  {tab === 'Pending Payouts' && (
                    <td className="py-3 px-4">
                      <input type="checkbox" checked={selected.includes(parseInt(payout.id.split('-')[1]))}
                        onChange={e => setSelected(prev => e.target.checked ? [...prev, parseInt(payout.id.split('-')[1])] : prev.filter(i => i !== parseInt(payout.id.split('-')[1])))}
                        className="rounded" />
                    </td>
                  )}
                  <td className="py-3 px-4 font-mono text-xs text-primary font-medium">{payout.id}</td>
                  <td className="py-3 px-4 font-medium text-text-primary">{payout.seller}</td>
                  <td className="py-3 px-4 text-text-secondary text-xs">{payout.bank} · {payout.account}</td>
                  <td className="py-3 px-4 font-semibold text-text-primary">TTD ${payout.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-text-secondary text-xs">{payout.requested}</td>
                  <td className="py-3 px-4 text-text-secondary text-xs">{payout.processed}</td>
                  <td className="py-3 px-4"><StatusBadge status={payout.status} /></td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {payout.status === 'Pending' && (
                        <>
                          <button onClick={() => setMarkPaid(payout)} className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-xs font-medium hover:bg-green-100">Mark Paid</button>
                          <button onClick={() => setConfirmAction({ action: 'Reject', payout })} className="px-2.5 py-1 bg-red-50 text-danger border border-red-200 rounded-md text-xs font-medium hover:bg-red-100">Reject</button>
                        </>
                      )}
                      {payout.status === 'Failed' && (
                        <button onClick={() => setConfirmAction({ action: 'Retry', payout })} className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-xs font-medium hover:bg-primary/20">Retry</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-slate-50">
          <p className="text-sm text-text-secondary">Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</p>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-md border border-border bg-white disabled:opacity-40"><ChevronLeft size={15} /></button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>setPage(p)} className={`w-7 h-7 rounded-md text-sm font-medium ${page===p?'bg-primary text-white':'border border-border bg-white hover:bg-slate-50'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-md border border-border bg-white disabled:opacity-40"><ChevronRight size={15} /></button>
          </div>
        </div>
      </div>

      {/* Mark as Paid Modal */}
      {markPaid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMarkPaid(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Mark as Paid</h3>
              <button onClick={() => setMarkPaid(null)}><X size={18} /></button>
            </div>
            <p className="text-sm text-text-secondary mb-4">Confirm payment of <strong>TTD ${markPaid.amount.toLocaleString()}</strong> to <strong>{markPaid.seller}</strong> ({markPaid.bank} {markPaid.account})</p>
            <label className="text-sm font-medium block mb-1.5">Bank Reference Number</label>
            <input value={refNum} onChange={e => setRefNum(e.target.value)} placeholder="e.g., BK20260528-001234" className="input mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setMarkPaid(null)} className="flex-1 btn-secondary justify-center">Cancel</button>
              <button onClick={() => { setMarkPaid(null); setRefNum('') }} className="flex-1 btn-primary justify-center"><CheckCircle size={15} />Confirm Payment</button>
            </div>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmAction(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-base font-semibold">{confirmAction.action} Payout</h3>
            <p className="text-sm text-text-secondary mt-2">Are you sure you want to <strong>{confirmAction.action.toLowerCase()}</strong> payout of TTD ${confirmAction.payout.amount.toLocaleString()} for {confirmAction.payout.seller}?</p>
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
