'use client'

import { useState } from 'react'
import {
  UploadCloud, FileText, AlertTriangle, CheckCircle, XCircle,
  Mail, Download,
} from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'
import DataTable from '@/components/DataTable'
import ConfirmDialog from '@/components/ConfirmDialog'

// ─── Types ────────────────────────────────────────────────────────────────────

type PendingInvoice = {
  inv: string
  user: string
  userId: string
  plan: string
  amount: number
  generated: string
  expiry: string
  status: string
}

type Exception = {
  inv: string
  issue: string
  details: string
  date: string
  status: string
}

type ImportRecord = {
  date: string
  file: string
  total: number
  matched: number
  activated: number
  exceptions: number
  uploadedBy: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const pendingInvoices: PendingInvoice[] = [
  { inv: 'INV-2050', user: 'Khalil Brown',    userId: 'USR-001', plan: 'Pro',     amount: 3000, generated: 'May 28, 2026', expiry: 'Jun 2, 2026',  status: 'Active' },
  { inv: 'INV-2049', user: 'Nadine Campbell', userId: 'USR-002', plan: 'Basic',   amount: 1500, generated: 'May 27, 2026', expiry: 'Jun 1, 2026',  status: 'Active' },
  { inv: 'INV-2048', user: 'Tanya Harrison',  userId: 'USR-006', plan: 'Free',    amount: 0,    generated: 'May 26, 2026', expiry: 'May 31, 2026', status: 'Expired' },
  { inv: 'INV-2047', user: 'Andre Gordon',    userId: 'USR-005', plan: 'Pro',     amount: 3000, generated: 'May 25, 2026', expiry: 'Jun 4, 2026',  status: 'Active' },
  { inv: 'INV-2046', user: 'Marcia Walker',   userId: 'USR-016', plan: 'Premium', amount: 5000, generated: 'May 24, 2026', expiry: 'Jun 3, 2026',  status: 'Active' },
  { inv: 'INV-2045', user: 'Damion Jackson',  userId: 'USR-007', plan: 'Premium', amount: 5000, generated: 'May 23, 2026', expiry: 'May 30, 2026', status: 'Paid' },
  { inv: 'INV-2044', user: 'Sharon Reid',     userId: 'USR-012', plan: 'Pro',     amount: 3000, generated: 'May 22, 2026', expiry: 'May 31, 2026', status: 'Expired' },
  { inv: 'INV-2043', user: 'Andrea Bailey',   userId: 'USR-021', plan: 'Pro',     amount: 3000, generated: 'May 21, 2026', expiry: 'Jun 5, 2026',  status: 'Active' },
  { inv: 'INV-2042', user: 'Simone Edwards',  userId: 'USR-014', plan: 'Basic',   amount: 1500, generated: 'May 20, 2026', expiry: 'May 29, 2026', status: 'Paid' },
  { inv: 'INV-2041', user: 'Devon Brown',     userId: 'USR-006', plan: 'Basic',   amount: 1500, generated: 'May 19, 2026', expiry: 'Jun 1, 2026',  status: 'Active' },
]

const exceptions: Exception[] = [
  { inv: 'INV-2044', issue: 'User Not Found',    details: 'USR-099 does not exist in the system',        date: 'May 31, 2026', status: 'Pending' },
  { inv: 'INV-2038', issue: 'Duplicate Payment', details: 'This invoice was already paid on May 20',     date: 'May 28, 2026', status: 'Pending' },
  { inv: 'INV-2031', issue: 'Partial Payment',   details: 'J$1,000 received but Pro plan costs J$3,000', date: 'May 25, 2026', status: 'Resolved' },
  { inv: 'INV-2027', issue: 'Amount Mismatch',   details: 'Expected J$5,000, received J$1,500',          date: 'May 22, 2026', status: 'Resolved' },
  { inv: 'INV-2019', issue: 'User Not Found',    details: 'USR-088 does not exist in the system',        date: 'May 18, 2026', status: 'Resolved' },
]

const importHistory: ImportRecord[] = [
  { date: 'May 31, 2026 09:00', file: 'bill_express_20260531.csv', total: 48, matched: 46, activated: 46, exceptions: 2, uploadedBy: 'Super Admin' },
  { date: 'May 30, 2026 08:45', file: 'bill_express_20260530.csv', total: 52, matched: 52, activated: 52, exceptions: 0, uploadedBy: 'Finance Admin' },
  { date: 'May 29, 2026 09:15', file: 'bill_express_20260529.csv', total: 39, matched: 38, activated: 38, exceptions: 1, uploadedBy: 'Super Admin' },
  { date: 'May 28, 2026 08:30', file: 'bill_express_20260528.csv', total: 61, matched: 59, activated: 59, exceptions: 2, uploadedBy: 'Finance Admin' },
  { date: 'May 27, 2026 09:00', file: 'bill_express_20260527.csv', total: 44, matched: 44, activated: 44, exceptions: 0, uploadedBy: 'Super Admin' },
  { date: 'May 26, 2026 08:15', file: 'bill_express_20260526.csv', total: 37, matched: 35, activated: 35, exceptions: 2, uploadedBy: 'Finance Admin' },
]

const PREVIEW_ROWS = [
  { inv: 'INV-2041', userId: 'USR-006', name: 'Devon Brown',    amount: 'J$1,500', date: 'May 31, 2026', match: 'Matched' },
  { inv: 'INV-2042', userId: 'USR-014', name: 'Simone Edwards', amount: 'J$1,500', date: 'May 31, 2026', match: 'Matched' },
  { inv: 'INV-2043', userId: 'USR-021', name: 'Andrea Bailey',  amount: 'J$3,000', date: 'May 31, 2026', match: 'Matched' },
  { inv: 'INV-2044', userId: 'USR-099', name: 'Unknown User',   amount: 'J$5,000', date: 'May 31, 2026', match: 'Exception' },
  { inv: 'INV-2045', userId: 'USR-007', name: 'Damion Jackson', amount: 'J$5,000', date: 'May 31, 2026', match: 'Matched' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PLAN_STYLES: Record<string, string> = {
  Basic:   'bg-blue-100 text-blue-700',
  Pro:     'bg-purple-100 text-purple-700',
  Premium: 'bg-amber-100 text-amber-700',
  Free:    'bg-slate-100 text-slate-600',
}

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PLAN_STYLES[plan] ?? 'bg-slate-100 text-slate-600'}`}>
      {plan}
    </span>
  )
}

const ISSUE_STYLES: Record<string, string> = {
  'User Not Found':    'bg-red-100 text-red-700',
  'Duplicate Payment': 'bg-orange-100 text-orange-700',
  'Partial Payment':   'bg-yellow-100 text-yellow-700',
  'Amount Mismatch':   'bg-purple-100 text-purple-700',
}

function IssueBadge({ issue }: { issue: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ISSUE_STYLES[issue] ?? 'bg-slate-100 text-slate-600'}`}>
      {issue}
    </span>
  )
}

// Expiry check: within 3 days of May 31, 2026
function isExpiringSoon(expiryStr: string): boolean {
  const today = new Date('2026-05-31')
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
  const parts = expiryStr.split(' ')
  if (parts.length < 3) return false
  const month = months[parts[0]] ?? 0
  const day = parseInt(parts[1].replace(',', ''), 10)
  const year = parseInt(parts[2], 10)
  const expiry = new Date(year, month, day)
  const diffMs = expiry.getTime() - today.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= 3
}

const TABS = ['Upload CSV', 'Pending Invoices', 'Exception Queue', 'Import History']

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillExpressPage() {
  const [activeTab, setActiveTab] = useState('Upload CSV')
  const [fileSelected, setFileSelected] = useState(false)
  const [processed, setProcessed] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ label: string; message: string } | null>(null)

  // Invoice action states
  const [cancelInv, setCancelInv] = useState<string | null>(null)
  const [resendInv, setResendInv] = useState<string | null>(null)

  type InvCol = { header: string; accessor: (row: PendingInvoice) => React.ReactNode }
  const invoiceCols: InvCol[] = [
    { header: 'Invoice #',      accessor: (r) => <span className="font-mono text-xs font-medium text-text-primary">{r.inv}</span> },
    {
      header: 'User Name',
      accessor: (r) => <span className="font-medium text-text-primary">{r.user}</span>,
    },
    { header: 'User ID',       accessor: (r) => <span className="font-mono text-xs text-text-secondary">{r.userId}</span> },
    { header: 'Plan',          accessor: (r) => <PlanBadge plan={r.plan} /> },
    { header: 'Amount',        accessor: (r) => <span className="font-semibold">{r.amount === 0 ? 'Free' : `J$${r.amount.toLocaleString()}`}</span> },
    { header: 'Generated',     accessor: (r) => <span className="text-sm text-text-secondary whitespace-nowrap">{r.generated}</span> },
    {
      header: 'Expiry Date',
      accessor: (r) => (
        <div>
          <span className={`text-sm whitespace-nowrap ${isExpiringSoon(r.expiry) ? 'text-danger font-semibold' : 'text-text-secondary'}`}>{r.expiry}</span>
          {isExpiringSoon(r.expiry) && <p className="text-xs text-danger mt-0.5">⚠ Expiring soon</p>}
        </div>
      ),
    },
    { header: 'Status',        accessor: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      accessor: (r) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCancelInv(r.inv)}
            className="px-2 py-1 rounded text-xs font-medium border border-danger text-danger hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => setResendInv(r.inv)}
            className="p-1 rounded text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors"
            title="Resend Email"
          >
            <Mail size={14} />
          </button>
        </div>
      ),
    },
  ]

  type ExcCol = { header: string; accessor: (row: Exception) => React.ReactNode }
  const exceptionCols: ExcCol[] = [
    { header: 'Invoice #',   accessor: (r) => <span className="font-mono text-xs font-medium text-text-primary">{r.inv}</span> },
    { header: 'Issue Type',  accessor: (r) => <IssueBadge issue={r.issue} /> },
    { header: 'Details',     accessor: (r) => <span className="text-sm text-text-secondary">{r.details}</span> },
    { header: 'Date',        accessor: (r) => <span className="text-sm text-text-secondary whitespace-nowrap">{r.date}</span> },
    { header: 'Status',      accessor: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      accessor: (r) => r.status === 'Pending' ? (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setConfirmAction({ label: 'Resolve', message: `Mark ${r.inv} as resolved?` })}
            className="px-2.5 py-1 rounded text-xs font-medium border border-green-500 text-green-600 hover:bg-green-50 transition-colors"
          >
            Resolve
          </button>
          <button
            onClick={() => setConfirmAction({ label: 'Contact Bill Express', message: `Contact Bill Express about ${r.inv}?` })}
            className="px-2.5 py-1 rounded text-xs font-medium border border-blue-400 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Contact
          </button>
        </div>
      ) : (
        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
          <CheckCircle size={13} /> Resolved
        </span>
      ),
    },
  ]

  type ImpCol = { header: string; accessor: (row: ImportRecord) => React.ReactNode }
  const importCols: ImpCol[] = [
    { header: 'Upload Date',  accessor: (r) => <span className="text-sm text-text-secondary whitespace-nowrap">{r.date}</span> },
    { header: 'File Name',    accessor: (r) => (
      <div className="flex items-center gap-1.5">
        <FileText size={14} className="text-slate-400" />
        <span className="text-sm text-text-primary font-mono">{r.file}</span>
      </div>
    )},
    { header: 'Total',        accessor: (r) => <span className="font-semibold">{r.total}</span> },
    { header: 'Matched',      accessor: (r) => <span className="text-green-600 font-semibold">{r.matched}</span> },
    { header: 'Activated',    accessor: (r) => <span className="text-green-600 font-semibold">{r.activated}</span> },
    {
      header: 'Exceptions',
      accessor: (r) => r.exceptions > 0 ? (
        <span className="flex items-center gap-1 text-danger font-semibold">
          <AlertTriangle size={13} /> {r.exceptions}
        </span>
      ) : (
        <span className="flex items-center gap-1 text-green-600 font-semibold">
          <CheckCircle size={13} /> 0
        </span>
      ),
    },
    { header: 'Uploaded By',  accessor: (r) => <span className="text-sm text-text-secondary">{r.uploadedBy}</span> },
    {
      header: 'Actions',
      accessor: () => (
        <div className="flex items-center gap-1.5">
          <button className="px-2.5 py-1 rounded text-xs font-medium border border-border text-text-secondary hover:bg-slate-50 transition-colors">
            View
          </button>
          <button className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-primary transition-colors">
            <Download size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Bill Express Offline Payments</h1>
        <p className="text-text-secondary mt-1">Manage offline payments collected via Bill Express agents</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
              ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1 — Upload CSV */}
      {activeTab === 'Upload CSV' && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Expected CSV columns: Invoice#, UserID, Name, Amount (J$), Date</p>

          {/* Drop Zone */}
          <div
            onClick={() => setFileSelected(true)}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
              ${fileSelected ? 'border-green-400 bg-green-50' : 'border-border hover:border-primary/50 hover:bg-primary/5'}`}
          >
            <UploadCloud size={40} className={`mx-auto mb-3 ${fileSelected ? 'text-green-500' : 'text-slate-400'}`} />
            <p className="font-medium text-text-primary">Drag & drop your Bill Express CSV here</p>
            <p className="text-sm text-text-secondary mt-1">or click to browse — .csv files only</p>
          </div>

          {/* File Preview */}
          {fileSelected && (
            <div className="card space-y-4">
              {/* File chip */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-sm font-medium">
                  <CheckCircle size={14} />
                  bill_express_20260531.csv
                </div>
              </div>

              {/* Preview table */}
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-border">
                      {['Invoice #', 'User ID', 'Name', 'Amount', 'Date', 'Status'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PREVIEW_ROWS.map((row, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono text-xs font-medium">{row.inv}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-secondary">{row.userId}</td>
                        <td className="px-4 py-3 font-medium">{row.name}</td>
                        <td className="px-4 py-3 font-semibold">{row.amount}</td>
                        <td className="px-4 py-3 text-text-secondary">{row.date}</td>
                        <td className="px-4 py-3">
                          {row.match === 'Exception' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <XCircle size={11} /> Exception
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle size={11} /> Matched
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => setProcessed(true)}
                className="btn-primary w-full py-3 text-sm font-semibold"
              >
                Process CSV
              </button>

              {/* Results Summary */}
              {processed && (
                <div className="bg-slate-50 rounded-xl border border-border p-5">
                  <h3 className="font-semibold text-text-primary mb-4">Processing Results</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-2xl font-bold text-blue-600">5</p>
                      <p className="text-xs text-blue-700 mt-0.5">Total Records</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="text-2xl font-bold text-green-600">4</p>
                      <p className="text-xs text-green-700 mt-0.5">Matched</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="text-2xl font-bold text-green-600">4</p>
                      <p className="text-xs text-green-700 mt-0.5">Activated</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                      <p className="text-2xl font-bold text-danger">1</p>
                      <button
                        onClick={() => setActiveTab('Exception Queue')}
                        className="text-xs text-danger underline mt-0.5 hover:no-underline"
                      >
                        View Exception Queue
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2 — Pending Invoices */}
      {activeTab === 'Pending Invoices' && (
        <div className="card">
          <DataTable
            columns={invoiceCols as Parameters<typeof DataTable>[0]['columns']}
            data={pendingInvoices as unknown as Record<string, unknown>[]}
            pageSize={10}
          />
        </div>
      )}

      {/* Tab 3 — Exception Queue */}
      {activeTab === 'Exception Queue' && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 font-medium">⚠ 2 exceptions require manual review</p>
          </div>
          <div className="card">
            <DataTable
              columns={exceptionCols as Parameters<typeof DataTable>[0]['columns']}
              data={exceptions as unknown as Record<string, unknown>[]}
              pageSize={10}
            />
          </div>
        </div>
      )}

      {/* Tab 4 — Import History */}
      {activeTab === 'Import History' && (
        <div className="card">
          <DataTable
            columns={importCols as Parameters<typeof DataTable>[0]['columns']}
            data={importHistory as unknown as Record<string, unknown>[]}
            pageSize={10}
          />
        </div>
      )}

      {/* Cancel Invoice Confirm */}
      <ConfirmDialog
        open={!!cancelInv}
        onClose={() => setCancelInv(null)}
        onConfirm={() => setCancelInv(null)}
        title="Cancel Invoice"
        message={`Are you sure you want to cancel invoice ${cancelInv}? This action cannot be undone.`}
        confirmLabel="Cancel Invoice"
        danger={true}
      />

      {/* Resend Email Confirm */}
      <ConfirmDialog
        open={!!resendInv}
        onClose={() => setResendInv(null)}
        onConfirm={() => setResendInv(null)}
        title="Resend Invoice Email"
        message={`Resend the invoice email for ${resendInv}?`}
        confirmLabel="Resend"
        danger={false}
      />

      {/* Exception Action Confirm */}
      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => setConfirmAction(null)}
        title={confirmAction?.label ?? ''}
        message={confirmAction?.message ?? ''}
        confirmLabel={confirmAction?.label ?? 'Confirm'}
        danger={false}
      />
    </div>
  )
}
