'use client'

import { useState } from 'react'
import { Search, CheckCircle, XCircle, ArrowUpCircle, Filter, ChevronLeft, ChevronRight, Shield } from 'lucide-react'

const flaggedItems = [
  { id: 'MOD-4021', type: 'Listing', content: 'Rolex Daytona Watch — Brand New', reason: 'Suspected Counterfeit', confidence: 94, date: 'May 28, 2026 09:14', user: 'Marcus Williams' },
  { id: 'MOD-4020', type: 'Message', content: '"Send me your bank details directly..."', reason: 'Phishing Attempt', confidence: 88, date: 'May 28, 2026 08:42', user: 'Unknown_4421' },
  { id: 'MOD-4019', type: 'Listing', content: 'iPhone 13 Pro — $100 Only!!!', reason: 'Price Anomaly / Potential Scam', confidence: 82, date: 'May 27, 2026 16:33', user: 'Simone Baptiste' },
  { id: 'MOD-4018', type: 'Profile', content: 'Profile: Abdul Kareem — "WhatsApp only"', reason: 'Off-Platform Transaction Encouragement', confidence: 76, date: 'May 27, 2026 14:18', user: 'Abdul Kareem' },
  { id: 'MOD-4017', type: 'Listing', content: 'Authentic Louis Vuitton Bag (Copy)', reason: 'Counterfeit / IP Violation', confidence: 91, date: 'May 27, 2026 11:05', user: 'Candice Fraser' },
  { id: 'MOD-4016', type: 'Message', content: '"I can do this at half price outside the app"', reason: 'Off-Platform Transaction', confidence: 85, date: 'May 26, 2026 19:47', user: 'James Crichlow' },
  { id: 'MOD-4015', type: 'Listing', content: 'Land for Sale — Maracas Bay 5 acres', reason: 'Duplicate Listing', confidence: 67, date: 'May 26, 2026 13:22', user: 'Omar Abdullah' },
  { id: 'MOD-4014', type: 'Profile', content: 'Profile with adult content in bio', reason: 'Inappropriate Content', confidence: 95, date: 'May 25, 2026 10:11', user: 'User_9872' },
  { id: 'MOD-4013', type: 'Listing', content: 'CSEC Past Papers 2020-2024', reason: 'Copyright Violation', confidence: 72, date: 'May 25, 2026 08:30', user: 'Anil Kumar' },
  { id: 'MOD-4012', type: 'Message', content: 'Spam message sent to 50+ users', reason: 'Spam / Mass Messaging', confidence: 99, date: 'May 24, 2026 22:15', user: 'Spam_Bot_332' },
]

const PAGE_SIZE = 10

function ConfidenceBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-red-100 text-red-700' : score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>{score}%</span>
}

export default function ModerationPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [confirmAction, setConfirmAction] = useState<{action: string; item: typeof flaggedItems[0]} | null>(null)
  const [dismissed, setDismissed] = useState<string[]>([])

  const filtered = flaggedItems.filter(item => {
    if (dismissed.includes(item.id)) return false
    const matchType = typeFilter === 'All' || item.type === typeFilter
    const matchSearch = search === '' || item.content.toLowerCase().includes(search.toLowerCase()) || item.user.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Content Moderation</h1>
        <p className="text-text-secondary text-sm mt-1">Review AI-flagged content and take appropriate actions.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center p-4">
          <p className="text-2xl font-bold text-primary">42</p>
          <p className="text-xs text-text-secondary mt-1">Reviewed Today</p>
        </div>
        <div className="card text-center p-4">
          <p className="text-2xl font-bold text-success">78%</p>
          <p className="text-xs text-text-secondary mt-1">Approval Rate</p>
        </div>
        <div className="card text-center p-4">
          <p className="text-2xl font-bold text-danger">22%</p>
          <p className="text-xs text-text-secondary mt-1">Removal Rate</p>
        </div>
        <div className="card text-center p-4">
          <p className="text-2xl font-bold text-warning">{filtered.length}</p>
          <p className="text-xs text-text-secondary mt-1">Pending Review</p>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search flagged content..." className="input pl-9" />
          </div>
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }} className="input sm:w-36">
            <option value="All">All Types</option>
            <option value="Listing">Listings</option>
            <option value="Message">Messages</option>
            <option value="Profile">Profiles</option>
          </select>
          <button className="btn-secondary"><Filter size={15} />Confidence</button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                {['ID', 'Type', 'Content Preview', 'Flagged Reason', 'Confidence', 'User', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-text-secondary">
                    <Shield size={40} className="text-slate-200" />
                    <p className="font-medium">All clear! No items pending review.</p>
                  </div>
                </td></tr>
              ) : paginated.map(item => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-xs text-primary font-medium">{item.id}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                      ${item.type === 'Listing' ? 'bg-blue-100 text-blue-700' : item.type === 'Message' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-[180px]">
                    <p className="text-text-primary text-xs truncate">{item.content}</p>
                  </td>
                  <td className="py-3 px-4 text-xs text-text-secondary max-w-[150px] truncate">{item.reason}</td>
                  <td className="py-3 px-4"><ConfidenceBadge score={item.confidence} /></td>
                  <td className="py-3 px-4 text-text-secondary text-xs">{item.user}</td>
                  <td className="py-3 px-4 text-text-secondary text-xs whitespace-nowrap">{item.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button onClick={() => { setDismissed(prev => [...prev, item.id]) }} title="Approve (Keep)" className="p-1.5 rounded-md text-slate-500 hover:bg-green-50 hover:text-success"><CheckCircle size={15} /></button>
                      <button onClick={() => setConfirmAction({ action: 'Remove', item })} title="Remove Content" className="p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-danger"><XCircle size={15} /></button>
                      <button onClick={() => setConfirmAction({ action: 'Escalate', item })} title="Escalate to Senior Admin" className="p-1.5 rounded-md text-slate-500 hover:bg-orange-50 hover:text-orange-600"><ArrowUpCircle size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-slate-50">
          <p className="text-sm text-text-secondary">{filtered.length} items pending</p>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-md border border-border bg-white disabled:opacity-40"><ChevronLeft size={15} /></button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>setPage(p)} className={`w-7 h-7 rounded-md text-sm font-medium ${page===p?'bg-primary text-white':'border border-border bg-white hover:bg-slate-50'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-md border border-border bg-white disabled:opacity-40"><ChevronRight size={15} /></button>
          </div>
        </div>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmAction(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-base font-semibold">{confirmAction.action} Content</h3>
            <p className="text-sm text-text-secondary mt-2">
              Are you sure you want to <strong>{confirmAction.action.toLowerCase()}</strong> this {confirmAction.item.type.toLowerCase()} from <strong>{confirmAction.item.user}</strong>?
            </p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setConfirmAction(null)} className="flex-1 btn-secondary justify-center">Cancel</button>
              <button onClick={() => { setConfirmAction(null); setDismissed(prev => [...prev, confirmAction.item.id]) }}
                className={`flex-1 justify-center ${confirmAction.action === 'Remove' ? 'btn-danger' : 'btn-primary'}`}>
                Confirm {confirmAction.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
