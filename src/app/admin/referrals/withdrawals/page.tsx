'use client'

import { useState } from 'react'
import { Download, FileText, CheckCircle, Search, Info } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'
import ConfirmDialog from '@/components/ConfirmDialog'

function InitAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-purple-500', 'bg-teal-500']
  const c = colors[name.charCodeAt(0) % colors.length]
  const dim = size === 'lg' ? 'w-12 h-12 text-base' : 'w-8 h-8 text-xs'
  return <div className={`${dim} rounded-full ${c} flex items-center justify-center text-white font-bold shrink-0`}>{initials}</div>
}

const withdrawalRequests = [
  { id: 'W001', user: 'Tricia Clarke',   date: 'May 30, 2026', amount: 4500, bank: 'NCB Jamaica',  account: '****4821', status: 'Pending' },
  { id: 'W002', user: 'Marcus Williams', date: 'May 29, 2026', amount: 4000, bank: 'Scotiabank',   account: '****3312', status: 'Pending' },
  { id: 'W003', user: 'Khalil Brown',    date: 'May 28, 2026', amount: 3000, bank: 'JMMB Bank',    account: '****7654', status: 'Payment Done' },
  { id: 'W004', user: 'Nadine Campbell', date: 'May 27, 2026', amount: 3000, bank: 'First Global',  account: '****9087', status: 'Payment Done' },
  { id: 'W005', user: 'Sharon Reid',     date: 'May 26, 2026', amount: 2500, bank: 'NCB Jamaica',  account: '****2345', status: 'Pending' },
  { id: 'W006', user: 'Andre Gordon',    date: 'May 25, 2026', amount: 2000, bank: 'Scotiabank',   account: '****6789', status: 'Payment Done' },
  { id: 'W007', user: 'Beverley Scott',  date: 'May 24, 2026', amount: 1500, bank: 'JMMB Bank',    account: '****1234', status: 'Pending' },
  { id: 'W008', user: 'Michael Morgan',  date: 'May 23, 2026', amount: 2000, bank: 'First Global',  account: '****5678', status: 'Payment Done' },
]

type ConfirmAction = { type: 'csv' | 'pdf' | 'mark' | 'markSingle'; id?: string } | null

export default function WithdrawalsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [doneRows, setDoneRows] = useState<string[]>(['W003', 'W004', 'W006', 'W008'])

  const getStatus = (id: string, original: string) => doneRows.includes(id) ? 'Payment Done' : original

  const filtered = withdrawalRequests.filter(r => {
    const matchSearch = r.user.toLowerCase().includes(search.toLowerCase())
    const status = getStatus(r.id, r.status)
    const matchStatus = statusFilter === 'All' || status === statusFilter
    return matchSearch && matchStatus
  })

  const allSelected = filtered.length > 0 && filtered.every(r => selectedRows.includes(r.id))

  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleAll = () => {
    if (allSelected) setSelectedRows([])
    else setSelectedRows(filtered.map(r => r.id))
  }

  const handleConfirm = () => {
    if (!confirmAction) return
    if (confirmAction.type === 'mark') {
      setDoneRows(prev => [...prev, ...selectedRows.filter(r => !prev.includes(r))])
      setSelectedRows([])
    } else if (confirmAction.type === 'markSingle' && confirmAction.id) {
      setDoneRows(prev => prev.includes(confirmAction.id!) ? prev : [...prev, confirmAction.id!])
    }
    setConfirmAction(null)
  }

  const confirmMessages: Record<string, string> = {
    csv: `Export ${selectedRows.length} selected rows as CSV?`,
    pdf: `Export ${selectedRows.length} selected rows as PDF?`,
    mark: `Mark ${selectedRows.length} selected withdrawal requests as Payment Done?`,
    markSingle: 'Mark this withdrawal request as Payment Done?',
  }

  const confirmLabels: Record<string, string> = {
    csv: 'Export CSV',
    pdf: 'Export PDF',
    mark: 'Mark as Done',
    markSingle: 'Mark as Done',
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Withdrawal Requests</h1>
        <p className="text-text-secondary text-sm mt-1">Commission payouts to referrers</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          Payouts are processed on the <span className="font-semibold">12th and 25th</span> of each month.
          Next payout cutoff: <span className="font-semibold">June 12, 2026</span>
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            className="input pl-9 w-full"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="input text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Payment Done">Payment Done</option>
          </select>
          <button className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2 font-medium">
            <Download size={15} />
            Date Range
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-primary">{selectedRows.length} row{selectedRows.length > 1 ? 's' : ''} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setConfirmAction({ type: 'csv' })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-white transition-colors"
            >
              <FileText size={13} />
              Export CSV
            </button>
            <button
              onClick={() => setConfirmAction({ type: 'pdf' })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-white transition-colors"
            >
              <FileText size={13} />
              Export PDF
            </button>
            <button
              onClick={() => setConfirmAction({ type: 'mark' })}
              className="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg"
            >
              <CheckCircle size={13} />
              Mark Selected as Done
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded"
                  />
                </th>
                <th className="py-3 px-4 text-left text-text-secondary font-medium">User</th>
                <th className="py-3 px-4 text-left text-text-secondary font-medium">Request Date</th>
                <th className="py-3 px-4 text-right text-text-secondary font-medium">Amount (J$)</th>
                <th className="py-3 px-4 text-left text-text-secondary font-medium">Bank Account</th>
                <th className="py-3 px-4 text-left text-text-secondary font-medium">Status</th>
                <th className="py-3 px-4 text-center text-text-secondary font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const status = getStatus(r.id, r.status)
                return (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(r.id)}
                        onChange={() => toggleRow(r.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <InitAvatar name={r.user} />
                        <div>
                          <p className="font-medium text-text-primary">{r.user}</p>
                          <p className="text-xs text-text-secondary">{r.bank}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{r.date}</td>
                    <td className="py-3 px-4 text-right font-semibold text-text-primary">J${r.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-text-secondary font-mono text-xs">{r.account}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={status} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      {status === 'Pending' ? (
                        <button
                          onClick={() => setConfirmAction({ type: 'markSingle', id: r.id })}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-success text-success rounded-lg hover:bg-success/10 transition-colors mx-auto"
                        >
                          <CheckCircle size={13} />
                          Mark Done
                        </button>
                      ) : (
                        <span className="text-xs text-text-secondary">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-text-secondary text-sm">No withdrawal requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={confirmAction ? (confirmAction.type === 'mark' || confirmAction.type === 'markSingle' ? 'Confirm Payment Done' : 'Confirm Export') : ''}
        message={confirmAction ? confirmMessages[confirmAction.type] : ''}
        confirmLabel={confirmAction ? confirmLabels[confirmAction.type] : 'Confirm'}
      />
    </div>
  )
}
