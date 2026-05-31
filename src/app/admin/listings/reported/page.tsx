'use client'

import { useState } from 'react'
import { Eye, Trash2, XCircle, MessageSquare, Flag } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'
import ConfirmDialog from '@/components/ConfirmDialog'

function InitAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-purple-500', 'bg-teal-500']
  const c = colors[name.charCodeAt(0) % colors.length]
  const dim = size === 'lg' ? 'w-12 h-12 text-base' : 'w-8 h-8 text-xs'
  return <div className={`${dim} rounded-full ${c} flex items-center justify-center text-white font-bold shrink-0`}>{initials}</div>
}

const reportedListings = [
  { id: 'R001', title: 'Fake UWI Scholarship 2026',      category: 'Scholarships & Awards', seller: 'Unknown User',   reason: 'Fraud',                 reportedBy: 'Khalil Brown',    date: 'May 31, 2026', status: 'Under Review', desc: 'This scholarship listing appears fraudulent — no official links or contact info provided.' },
  { id: 'R002', title: 'CSEC Chemistry Notes (Copied)',  category: 'Books',                 seller: 'Tony Alleyne',   reason: 'Intellectual Property',  reportedBy: 'Nadine Campbell', date: 'May 30, 2026', status: 'Under Review', desc: 'Notes appear to be copied directly from a published textbook without permission.' },
  { id: 'R003', title: 'Spam Tutoring Directory Entry',  category: 'E-Directory',           seller: 'Clive Robinson', reason: 'Spam',                   reportedBy: 'Rohan Clarke',    date: 'May 29, 2026', status: 'Resolved',     desc: 'Duplicate entry submitted 7 times. Listing flagged automatically and manually by user.' },
  { id: 'R004', title: 'Misleading Event Ticket Price',  category: 'Events',                seller: 'Simone Edwards', reason: 'Misleading Information', reportedBy: 'Andre Gordon',    date: 'May 28, 2026', status: 'Dismissed',    desc: 'Price shown as J$0 but actual event charges J$3,000 at door.' },
  { id: 'R005', title: 'Inappropriate Community Post',   category: 'E-Directory',           seller: 'Damion Jackson', reason: 'Inappropriate Content',  reportedBy: 'Tanya Harrison',  date: 'May 27, 2026', status: 'Under Review', desc: 'Content violates community guidelines regarding offensive language.' },
  { id: 'R006', title: 'Expired Scholarship Listed',     category: 'Scholarships & Awards', seller: 'Omar Powell',    reason: 'Outdated Information',   reportedBy: 'Keisha Lawrence', date: 'May 26, 2026', status: 'Resolved',     desc: 'Scholarship deadline was April 2025. Listing not updated despite expiry.' },
]

type Report = typeof reportedListings[0]

function reasonBadge(reason: string) {
  const map: Record<string, string> = {
    Fraud: 'bg-red-100 text-red-700',
    'Intellectual Property': 'bg-purple-100 text-purple-700',
    Spam: 'bg-orange-100 text-orange-700',
    'Misleading Information': 'bg-yellow-100 text-yellow-700',
    'Inappropriate Content': 'bg-red-100 text-red-700',
    'Outdated Information': 'bg-gray-100 text-gray-700',
  }
  return map[reason] ?? 'bg-slate-100 text-slate-700'
}

type ConfirmType = { type: 'remove' | 'dismiss' | 'warn'; report: Report }

export default function ReportedListingsPage() {
  const [viewReport, setViewReport] = useState<Report | null>(null)
  const [confirmAction, setConfirmAction] = useState<ConfirmType | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Reported Listings</h1>
        <p className="text-text-secondary text-sm mt-1">Listings flagged by users for review</p>
      </div>

      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Listing Title</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Category</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Seller</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Reason</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Reported By</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Date</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Status</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reportedListings.map(r => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-text-primary max-w-[180px]">
                  <div className="flex items-center gap-2">
                    <Flag size={13} className="text-danger shrink-0" />
                    <span className="line-clamp-1">{r.title}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-text-secondary text-xs">{r.category}</td>
                <td className="px-5 py-3 text-text-secondary">{r.seller}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${reasonBadge(r.reason)}`}>{r.reason}</span>
                </td>
                <td className="px-5 py-3 text-text-secondary">{r.reportedBy}</td>
                <td className="px-5 py-3 text-text-secondary">{r.date}</td>
                <td className="px-5 py-3"><StatusBadge status={r.status.toLowerCase()} /></td>
                <td className="px-5 py-3">
                  {r.status === 'Under Review' && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setViewReport(r); setAdminNotes('') }} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors" title="Review">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => setConfirmAction({ type: 'remove', report: r })} className="p-1.5 rounded-md hover:bg-red-50 text-danger transition-colors" title="Remove Listing">
                        <Trash2 size={15} />
                      </button>
                      <button onClick={() => setConfirmAction({ type: 'dismiss', report: r })} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors" title="Dismiss">
                        <XCircle size={15} />
                      </button>
                      <button onClick={() => setConfirmAction({ type: 'warn', report: r })} className="p-1.5 rounded-md hover:bg-orange-50 text-orange-500 transition-colors" title="Warn Seller">
                        <MessageSquare size={15} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-over Drawer */}
      {viewReport && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setViewReport(null)} />
          <div className="fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col">
            <div className="bg-gradient-to-r from-[#0F4C81] to-[#1a6ab8] p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs opacity-75 mb-1">{viewReport.id}</p>
                  <h2 className="font-bold text-base leading-tight">{viewReport.title}</h2>
                </div>
                <button onClick={() => setViewReport(null)} className="p-1.5 rounded-md hover:bg-white/20 transition-colors shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div>
                <h3 className="font-semibold text-text-primary mb-3">Listing Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-text-secondary">Title</span><span className="font-medium">{viewReport.title}</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Category</span><span className="font-medium">{viewReport.category}</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Seller</span><span className="font-medium">{viewReport.seller}</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Price</span><span className="font-medium">N/A</span></div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-3">Report Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <InitAvatar name={viewReport.reportedBy} />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{viewReport.reportedBy}</p>
                      <p className="text-xs text-text-secondary">Reporter</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-text-secondary">Reason:</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${reasonBadge(viewReport.reason)}`}>{viewReport.reason}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Date Reported</span>
                    <span className="font-medium">{viewReport.date}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Reporter&apos;s Statement</h3>
                <p className="text-sm text-text-secondary bg-slate-50 rounded-lg p-3">{viewReport.desc}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Admin Notes</label>
                <textarea rows={3} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Add investigation notes..." value={adminNotes} onChange={e => setAdminNotes(e.target.value)} />
              </div>
            </div>
            <div className="p-5 border-t border-border flex gap-2">
              <button onClick={() => { setConfirmAction({ type: 'remove', report: viewReport }); setViewReport(null) }} className="flex-1 bg-danger text-white rounded-lg py-2.5 text-sm font-medium hover:bg-red-600 transition-colors">
                Remove Listing
              </button>
              <button onClick={() => { setConfirmAction({ type: 'dismiss', report: viewReport }); setViewReport(null) }} className="flex-1 border border-border rounded-lg py-2.5 text-sm font-medium text-text-secondary hover:bg-slate-50 transition-colors">
                Dismiss
              </button>
              <button onClick={() => { setConfirmAction({ type: 'warn', report: viewReport }); setViewReport(null) }} className="flex-1 border border-orange-300 text-orange-600 rounded-lg py-2.5 text-sm font-medium hover:bg-orange-50 transition-colors">
                Warn Seller
              </button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => setConfirmAction(null)}
        title={
          confirmAction?.type === 'remove' ? 'Remove Listing' :
          confirmAction?.type === 'dismiss' ? 'Dismiss Report' :
          'Warn Seller'
        }
        message={
          confirmAction?.type === 'remove' ? `Remove "${confirmAction.report.title}" from the platform? This cannot be undone.` :
          confirmAction?.type === 'dismiss' ? `Dismiss the report for "${confirmAction?.report.title}"? No action will be taken.` :
          `Send a warning to ${confirmAction?.report.seller} regarding "${confirmAction?.report.title}"?`
        }
        confirmLabel={
          confirmAction?.type === 'remove' ? 'Remove' :
          confirmAction?.type === 'dismiss' ? 'Dismiss' :
          'Send Warning'
        }
        danger={confirmAction?.type === 'remove'}
      />
    </div>
  )
}
