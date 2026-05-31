'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle, XCircle, Eye, Shield } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'
import ConfirmDialog from '@/components/ConfirmDialog'

function InitAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-purple-500', 'bg-teal-500']
  const c = colors[name.charCodeAt(0) % colors.length]
  const dim = size === 'lg' ? 'w-12 h-12 text-base' : 'w-8 h-8 text-xs'
  return <div className={`${dim} rounded-full ${c} flex items-center justify-center text-white font-bold shrink-0`}>{initials}</div>
}

const flaggedReferrals = [
  { id: 'FR-001', referrer: 'Tony Alleyne',    referred: 'Tony A. Brown',  reason: 'Self-referral attempt',      date: 'May 31, 2026', status: 'Pending' },
  { id: 'FR-002', referrer: 'Damion Jackson',  referred: 'D. Jackson Jr.', reason: 'Duplicate account detected', date: 'May 30, 2026', status: 'Pending' },
  { id: 'FR-003', referrer: 'Clive Robinson',  referred: 'Kevin Robinson', reason: 'Rate limit exceeded',        date: 'May 30, 2026', status: 'Pending' },
  { id: 'FR-004', referrer: 'Unknown User',    referred: 'Sandra Francis', reason: 'Suspicious signup pattern',  date: 'May 29, 2026', status: 'Pending' },
  { id: 'FR-005', referrer: 'Omar Powell',     referred: 'Peter Powell',   reason: 'Self-referral attempt',      date: 'May 28, 2026', status: 'Resolved' },
  { id: 'FR-006', referrer: 'Beverley Scott',  referred: 'B. Scott-Brown', reason: 'Duplicate account detected', date: 'May 27, 2026', status: 'Resolved' },
  { id: 'FR-007', referrer: 'Errol Young',     referred: 'E. Young Jr.',   reason: 'Suspicious signup pattern',  date: 'May 26, 2026', status: 'Resolved' },
  { id: 'FR-008', referrer: 'Patricia Nelson', referred: 'Pat Nelson II',  reason: 'Rate limit exceeded',        date: 'May 25, 2026', status: 'Resolved' },
]

const reasonBadgeClass: Record<string, string> = {
  'Self-referral attempt':      'bg-red-100 text-red-700',
  'Rate limit exceeded':        'bg-orange-100 text-orange-700',
  'Suspicious signup pattern':  'bg-yellow-100 text-yellow-700',
  'Duplicate account detected': 'bg-red-100 text-red-700',
}

type ActionType = 'approve' | 'reject' | 'investigate'

interface ConfirmAction {
  type: ActionType
  id: string
}

export default function FraudPage() {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null)
  const [resolvedIds, setResolvedIds] = useState<string[]>(['FR-005', 'FR-006', 'FR-007', 'FR-008'])

  const getStatus = (id: string, original: string) => resolvedIds.includes(id) ? 'Resolved' : original

  const handleConfirm = () => {
    if (!confirmAction) return
    if (confirmAction.type === 'approve' || confirmAction.type === 'reject') {
      setResolvedIds(prev => [...prev, confirmAction.id])
    }
    setConfirmAction(null)
  }

  const confirmDetails: Record<ActionType, { title: string; message: string; label: string }> = {
    approve: {
      title: 'Approve Referral',
      message: 'Are you sure you want to approve this flagged referral? Commission will be processed.',
      label: 'Approve',
    },
    reject: {
      title: 'Reject Referral',
      message: 'Are you sure you want to reject this flagged referral? This action cannot be undone.',
      label: 'Reject',
    },
    investigate: {
      title: 'Mark for Investigation',
      message: 'Mark this referral for further investigation by the compliance team?',
      label: 'Mark for Investigation',
    },
  }

  const pendingCount = flaggedReferrals.filter(r => getStatus(r.id, r.status) === 'Pending').length

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Shield size={24} className="text-danger" />
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Flagged Referrals</h1>
          <p className="text-text-secondary text-sm mt-0.5">Review suspicious referral activity</p>
        </div>
      </div>

      {/* Warning Banner */}
      {pendingCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 font-medium">
            {pendingCount} referral{pendingCount > 1 ? 's' : ''} flagged for suspicious activity and require immediate review
          </p>
        </div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                <th className="py-3 px-4 text-left text-text-secondary font-medium">Flag ID</th>
                <th className="py-3 px-4 text-left text-text-secondary font-medium">Referrer</th>
                <th className="py-3 px-4 text-left text-text-secondary font-medium">Referred User</th>
                <th className="py-3 px-4 text-left text-text-secondary font-medium">Flag Reason</th>
                <th className="py-3 px-4 text-left text-text-secondary font-medium">Date Flagged</th>
                <th className="py-3 px-4 text-left text-text-secondary font-medium">Status</th>
                <th className="py-3 px-4 text-center text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flaggedReferrals.map(r => {
                const status = getStatus(r.id, r.status)
                return (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-text-secondary">{r.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <InitAvatar name={r.referrer} />
                        <span className="font-medium text-text-primary">{r.referrer}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{r.referred}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${reasonBadgeClass[r.reason] ?? 'bg-slate-100 text-slate-600'}`}>
                        {r.reason}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{r.date}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={status} />
                    </td>
                    <td className="py-3 px-4">
                      {status === 'Pending' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setConfirmAction({ type: 'approve', id: r.id })}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-success text-success rounded-lg hover:bg-success/10 transition-colors"
                            title="Approve Referral"
                          >
                            <CheckCircle size={12} />
                            Approve
                          </button>
                          <button
                            onClick={() => setConfirmAction({ type: 'reject', id: r.id })}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-danger text-danger rounded-lg hover:bg-danger/10 transition-colors"
                            title="Reject Referral"
                          >
                            <XCircle size={12} />
                            Reject
                          </button>
                          <button
                            onClick={() => setConfirmAction({ type: 'investigate', id: r.id })}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Mark for Investigation"
                          >
                            <Eye size={12} />
                            Investigate
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-text-secondary flex items-center justify-center gap-1">
                          <CheckCircle size={12} className="text-success" />
                          Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={confirmAction ? confirmDetails[confirmAction.type].title : ''}
        message={confirmAction ? confirmDetails[confirmAction.type].message : ''}
        confirmLabel={confirmAction ? confirmDetails[confirmAction.type].label : 'Confirm'}
      />
    </div>
  )
}
