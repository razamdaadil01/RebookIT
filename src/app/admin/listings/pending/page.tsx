'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'
import Modal from '@/components/Modal'

const pendingListings = [
  { id: 'L003', title: 'Kingston Tech Summit 2026',        category: 'Events',      sub: 'Education Industry', seller: 'Rohan Clarke',   parish: 'Kingston',   price: 3000, date: 'May 26, 2026', desc: 'Annual tech conference for students and professionals in Kingston.' },
  { id: 'L007', title: 'UWI Graduation Gala 2026',         category: 'Events',      sub: 'Education Industry', seller: 'Damion Jackson', parish: 'St. Andrew', price: 2500, date: 'May 22, 2026', desc: 'Annual graduation celebration with awards, dinner and networking.' },
  { id: 'L014', title: 'Caribbean Diet & Nutrition Clinic', category: 'E-Directory', sub: 'Dieticians',         seller: 'Beverley Scott', parish: 'Clarendon',  price: 3500, date: 'May 16, 2026', desc: 'Registered dietician offering consultations for weight management.' },
  { id: 'L016', title: 'Mandeville Science Fair 2026',     category: 'Events',      sub: 'Education Industry', seller: 'Errol Young',    parish: 'Manchester', price: 0,    date: 'May 30, 2026', desc: 'Regional science fair for secondary school students in Manchester.' },
]

type PendingListing = typeof pendingListings[0]

const REJECTION_REASONS = ['Inappropriate content', 'Spam or duplicate', 'Incomplete information', 'Misleading or false', 'Other']

export default function PendingPage() {
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [rejectModal, setRejectModal] = useState<PendingListing | null>(null)
  const [rejectReason, setRejectReason] = useState(REJECTION_REASONS[0])
  const [rejectNotes, setRejectNotes] = useState('')
  const [confirmBulkApprove, setConfirmBulkApprove] = useState(false)
  const [confirmBulkReject, setConfirmBulkReject] = useState(false)
  const [confirmApprove, setConfirmApprove] = useState<PendingListing | null>(null)

  const filtered = pendingListings.filter(l => {
    const q = search.toLowerCase()
    return !q || l.title.toLowerCase().includes(q) || l.seller.toLowerCase().includes(q)
  })

  const allSelected = filtered.length > 0 && filtered.every(l => selectedIds.includes(l.id))

  function toggleAll() {
    if (allSelected) setSelectedIds([])
    else setSelectedIds(filtered.map(l => l.id))
  }

  function toggleOne(id: string) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Pending Approval</h1>
        <p className="text-text-secondary text-sm mt-1">Listings awaiting review before going live</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle size={18} className="text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800 font-medium">4 listings are awaiting your review. Please approve or reject each listing.</p>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
          <span className="text-sm font-medium text-primary">{selectedIds.length} selected</span>
          <div className="flex gap-2">
            <button onClick={() => setConfirmBulkApprove(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-success text-white text-xs rounded-lg font-medium hover:bg-green-600 transition-colors">
              <CheckCircle size={13} /> Approve Selected
            </button>
            <button onClick={() => setConfirmBulkReject(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-danger text-white text-xs rounded-lg font-medium hover:bg-red-600 transition-colors">
              <XCircle size={13} /> Reject Selected
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="relative w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Search listings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              <th className="px-5 py-3 w-10">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded" />
              </th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Listing</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Seller</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Parish</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Price</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Date</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className={`border-b border-border last:border-0 hover:bg-slate-50 transition-colors ${selectedIds.includes(l.id) ? 'bg-primary/3' : ''}`}>
                <td className="px-5 py-3">
                  <input type="checkbox" checked={selectedIds.includes(l.id)} onChange={() => toggleOne(l.id)} className="rounded" />
                </td>
                <td className="px-5 py-3">
                  <p className="font-medium text-text-primary">{l.title}</p>
                  <p className="text-xs text-text-secondary">{l.category} · {l.sub}</p>
                </td>
                <td className="px-5 py-3 text-text-secondary">{l.seller}</td>
                <td className="px-5 py-3 text-text-secondary">{l.parish}</td>
                <td className="px-5 py-3 font-medium text-text-primary">{l.price === 0 ? 'Free' : `J$${l.price.toLocaleString()}`}</td>
                <td className="px-5 py-3 text-text-secondary">{l.date}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConfirmApprove(l)}
                      className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button
                      onClick={() => { setRejectModal(l); setRejectReason(REJECTION_REASONS[0]); setRejectNotes('') }}
                      className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rejection Modal */}
      <Modal open={!!rejectModal} onClose={() => setRejectModal(null)} title="Reject Listing">
        {rejectModal && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-text-secondary mb-0.5">Listing</p>
              <p className="font-medium text-text-primary">{rejectModal.title}</p>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Rejection Reason</label>
              <select className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none" value={rejectReason} onChange={e => setRejectReason(e.target.value)}>
                {REJECTION_REASONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Admin Notes <span className="text-text-secondary">(optional)</span></label>
              <textarea rows={3} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Additional notes for the record..." value={rejectNotes} onChange={e => setRejectNotes(e.target.value)} />
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setRejectModal(null)} className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-text-secondary hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => setRejectModal(null)} className="flex-1 bg-danger text-white rounded-lg py-2 text-sm font-medium hover:bg-red-600 transition-colors">Reject Listing</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Approve single */}
      <ConfirmDialog
        open={!!confirmApprove}
        onClose={() => setConfirmApprove(null)}
        onConfirm={() => setConfirmApprove(null)}
        title="Approve Listing"
        message={`Approve "${confirmApprove?.title}"? It will go live immediately.`}
        confirmLabel="Approve"
        danger={false}
      />

      {/* Bulk Approve */}
      <ConfirmDialog
        open={confirmBulkApprove}
        onClose={() => setConfirmBulkApprove(false)}
        onConfirm={() => { setSelectedIds([]); setConfirmBulkApprove(false) }}
        title="Approve Selected Listings"
        message={`Approve ${selectedIds.length} selected listing(s)? They will go live immediately.`}
        confirmLabel="Approve All"
        danger={false}
      />

      {/* Bulk Reject */}
      <ConfirmDialog
        open={confirmBulkReject}
        onClose={() => setConfirmBulkReject(false)}
        onConfirm={() => { setSelectedIds([]); setConfirmBulkReject(false) }}
        title="Reject Selected Listings"
        message={`Reject ${selectedIds.length} selected listing(s)? This cannot be undone.`}
        confirmLabel="Reject All"
      />
    </div>
  )
}
