'use client'

import { useState } from 'react'
import { Search, Filter, Eye, RefreshCw, ChevronLeft, ChevronRight, X, DollarSign, TrendingUp, Clock } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'

const transactions = [
  { id: 'TXN-10481', buyer: 'Alicia Mohammed', seller: 'Marcus Williams', item: 'iPhone 14 Pro', amount: 4500, gateway: 'Powertranz', date: 'May 28, 2026', status: 'Successful' },
  { id: 'TXN-10480', buyer: 'Christopher Paul', seller: 'Rajesh Persad', item: '2020 Toyota Corolla', amount: 78000, gateway: 'Powertranz', date: 'May 27, 2026', status: 'Pending' },
  { id: 'TXN-10479', buyer: 'Sandra Hernandez', seller: 'Kerri-Ann Joseph', item: 'L-shaped Sofa', amount: 3200, gateway: 'Powertranz', date: 'May 27, 2026', status: 'Successful' },
  { id: 'TXN-10478', buyer: 'Kezia Phillip', seller: 'Devon Rampersad', item: 'Air Jordan 1', amount: 850, gateway: 'Powertranz', date: 'May 26, 2026', status: 'Successful' },
  { id: 'TXN-10477', buyer: 'Michelle Narine', seller: 'Omar Abdullah', item: '2BR Apartment (deposit)', amount: 4200, gateway: 'Powertranz', date: 'May 26, 2026', status: 'Successful' },
  { id: 'TXN-10476', buyer: 'Natasha Beckles', seller: 'Vikram Singh', item: 'Samsung 65" TV', amount: 6800, gateway: 'Powertranz', date: 'May 25, 2026', status: 'Failed' },
  { id: 'TXN-10475', buyer: 'Anil Kumar', seller: 'Tricia Clarke', item: 'Honda Civic 2019', amount: 65000, gateway: 'Powertranz', date: 'May 25, 2026', status: 'Pending' },
  { id: 'TXN-10474', buyer: 'Candice Fraser', seller: 'Priya Ramkissoon', item: 'King Bed Frame', amount: 2800, gateway: 'Powertranz', date: 'May 24, 2026', status: 'Refunded' },
  { id: 'TXN-10473', buyer: 'James Crichlow', seller: 'Tony Alleyne', item: 'MacBook Air M2', amount: 6200, gateway: 'Powertranz', date: 'May 24, 2026', status: 'Successful' },
  { id: 'TXN-10472', buyer: 'Devon Rampersad', seller: 'Simone Baptiste', item: 'PS5 Console', amount: 3800, gateway: 'Powertranz', date: 'May 23, 2026', status: 'Successful' },
  { id: 'TXN-10471', buyer: 'Priya Ramkissoon', seller: 'Marcus Williams', item: 'AirPods Pro', amount: 1200, gateway: 'Powertranz', date: 'May 22, 2026', status: 'Successful' },
  { id: 'TXN-10470', buyer: 'Tony Alleyne', seller: 'Kerri-Ann Joseph', item: 'Evening Gown', amount: 380, gateway: 'Powertranz', date: 'May 22, 2026', status: 'Successful' },
  { id: 'TXN-10469', buyer: 'Marcus Williams', seller: 'Rajesh Persad', item: 'Honda Fit 2018', amount: 52000, gateway: 'Powertranz', date: 'May 21, 2026', status: 'Failed' },
  { id: 'TXN-10468', buyer: 'Kerri-Ann Joseph', seller: 'Omar Abdullah', item: 'Office Desk', amount: 1400, gateway: 'Powertranz', date: 'May 20, 2026', status: 'Successful' },
  { id: 'TXN-10467', buyer: 'Rajesh Persad', seller: 'Vikram Singh', item: 'Nikon D7500', amount: 4100, gateway: 'Powertranz', date: 'May 19, 2026', status: 'Refunded' },
]

const TABS = ['All Transactions', 'Successful', 'Pending', 'Failed', 'Refunded']
const PAGE_SIZE = 10

export default function PaymentsPage() {
  const [tab, setTab] = useState('All Transactions')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<typeof transactions[0] | null>(null)

  const filtered = transactions.filter(t => {
    const matchTab = tab === 'All Transactions' ? true : t.status.toLowerCase() === tab.toLowerCase().replace(' transactions', '')
    const matchSearch = search === '' || t.id.toLowerCase().includes(search.toLowerCase()) || t.buyer.toLowerCase().includes(search.toLowerCase()) || t.seller.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)
  const totalRevenue = transactions.filter(t => t.status === 'Successful').reduce((a, t) => a + t.amount, 0)
  const monthRevenue = transactions.filter(t => t.status === 'Successful').slice(0, 8).reduce((a, t) => a + t.amount, 0)
  const pendingAmount = transactions.filter(t => t.status === 'Pending').reduce((a, t) => a + t.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Payment & Transactions</h1>
        <p className="text-text-secondary text-sm mt-1">Monitor all payment transactions across the platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center"><DollarSign size={22} className="text-success" /></div>
          <div><p className="text-xs text-text-secondary font-medium">Total Revenue</p><p className="text-xl font-bold text-text-primary">TTD ${totalRevenue.toLocaleString()}</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center"><TrendingUp size={22} className="text-primary" /></div>
          <div><p className="text-xs text-text-secondary font-medium">This Month</p><p className="text-xl font-bold text-text-primary">TTD ${monthRevenue.toLocaleString()}</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-yellow-100 rounded-xl flex items-center justify-center"><Clock size={22} className="text-warning" /></div>
          <div><p className="text-xs text-text-secondary font-medium">Pending Settlement</p><p className="text-xl font-bold text-text-primary">TTD ${pendingAmount.toLocaleString()}</p></div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map(t => (
          <button key={t} onClick={() => { setTab(t); setPage(1) }}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
              ${tab === t ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>{t}</button>
        ))}
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by transaction ID, buyer, or seller..." className="input pl-9" />
          </div>
          <button className="btn-secondary"><Filter size={15} />Date Range</button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                {['Transaction ID', 'Buyer', 'Seller', 'Item', 'Amount', 'Gateway', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(txn => (
                <tr key={txn.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-xs text-primary font-medium">{txn.id}</td>
                  <td className="py-3 px-4 text-text-primary">{txn.buyer}</td>
                  <td className="py-3 px-4 text-text-secondary">{txn.seller}</td>
                  <td className="py-3 px-4 text-text-primary max-w-[150px] truncate">{txn.item}</td>
                  <td className="py-3 px-4 font-semibold text-text-primary">TTD ${txn.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-text-secondary text-xs">{txn.gateway}</td>
                  <td className="py-3 px-4 text-text-secondary text-xs whitespace-nowrap">{txn.date}</td>
                  <td className="py-3 px-4"><StatusBadge status={txn.status} /></td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button onClick={() => setSelected(txn)} title="View Details" className="p-1.5 rounded-md text-slate-500 hover:bg-blue-50 hover:text-primary"><Eye size={15} /></button>
                      {txn.status === 'Successful' && <button title="Refund" className="p-1.5 rounded-md text-slate-500 hover:bg-yellow-50 hover:text-yellow-600"><RefreshCw size={15} /></button>}
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
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-md border border-border bg-white text-slate-500 disabled:opacity-40"><ChevronLeft size={15} /></button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>setPage(p)} className={`w-7 h-7 rounded-md text-sm font-medium ${page===p?'bg-primary text-white':'border border-border bg-white text-slate-600 hover:bg-slate-50'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-md border border-border bg-white text-slate-500 disabled:opacity-40"><ChevronRight size={15} /></button>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold">Transaction Details</h3>
              <button onClick={() => setSelected(null)}><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-text-secondary">Transaction ID</span>
                <span className="font-mono text-sm font-bold text-primary">{selected.id}</span>
              </div>
              {[
                ['Buyer', selected.buyer],
                ['Seller', selected.seller],
                ['Item', selected.item],
                ['Amount', `TTD $${selected.amount.toLocaleString()}`],
                ['Gateway', selected.gateway],
                ['Date', selected.date],
                ['Gateway Ref', `PTZ-${Math.random().toString(36).substr(2,9).toUpperCase()}`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-text-secondary">{k}</span>
                  <span className="text-sm font-medium text-text-primary">{v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm text-text-secondary">Status</span>
                <StatusBadge status={selected.status} />
              </div>
            </div>
            {selected.status === 'Successful' && (
              <button className="w-full btn-secondary mt-5 justify-center text-yellow-600 border-yellow-200 bg-yellow-50 hover:bg-yellow-100">
                <RefreshCw size={15} />Issue Refund
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
