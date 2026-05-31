'use client'

import { Info, FileDown, FileText } from 'lucide-react'

const reports = [
  { date: 'May 25, 2026', period: '13th–25th May 2026', requests: 23, amount: 34200, status: 'Generated' },
  { date: 'May 12, 2026', period: '1st–12th May 2026',  requests: 19, amount: 28500, status: 'Downloaded' },
  { date: 'Apr 25, 2026', period: '13th–25th Apr 2026', requests: 21, amount: 31500, status: 'Downloaded' },
  { date: 'Apr 12, 2026', period: '1st–12th Apr 2026',  requests: 17, amount: 25500, status: 'Downloaded' },
  { date: 'Mar 25, 2026', period: '13th–25th Mar 2026', requests: 15, amount: 22500, status: 'Downloaded' },
  { date: 'Mar 12, 2026', period: '1st–12th Mar 2026',  requests: 14, amount: 21000, status: 'Downloaded' },
]

function StatusChip({ status }: { status: string }) {
  if (status === 'Generated') {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{status}</span>
  }
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{status}</span>
}

export default function ReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Bi-Monthly Payment Reports</h1>
        <p className="text-text-secondary text-sm mt-1">Auto-generated commission payment reports</p>
      </div>

      {/* Info Banner */}
      <div className="bg-slate-50 border border-border rounded-xl p-4 flex items-start gap-3">
        <Info size={18} className="text-slate-500 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-700">
          Reports are auto-generated on the <span className="font-semibold">12th and 25th</span> of each month at <span className="font-semibold">11:58 PM</span>
        </p>
      </div>

      {/* Countdown Card */}
      <div className="bg-primary rounded-2xl p-6 text-white text-center">
        <p className="text-sm font-medium text-white/70 mb-4 uppercase tracking-wide">Next Report Generates In</p>
        <div className="flex items-center justify-center gap-4">
          {[
            { val: '3', label: 'Days' },
            { val: '14', label: 'Hours' },
            { val: '22', label: 'Minutes' },
          ].map(({ val, label }) => (
            <div key={label} className="bg-white/20 rounded-xl px-4 py-3 min-w-[70px]">
              <p className="text-3xl font-bold text-white">{val}</p>
              <p className="text-xs text-white/70 mt-1">{label}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-white/70 mt-4">June 12, 2026 at 11:58 PM</p>
      </div>

      {/* Reports Table */}
      <div className="card p-0 overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">Generated Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                <th className="py-3 px-5 text-left text-text-secondary font-medium">Report Date</th>
                <th className="py-3 px-5 text-left text-text-secondary font-medium">Period</th>
                <th className="py-3 px-5 text-center text-text-secondary font-medium">Total Requests</th>
                <th className="py-3 px-5 text-right text-text-secondary font-medium">Total Amount</th>
                <th className="py-3 px-5 text-left text-text-secondary font-medium">Status</th>
                <th className="py-3 px-5 text-center text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-5 font-medium text-text-primary">{r.date}</td>
                  <td className="py-3.5 px-5 text-text-secondary">{r.period}</td>
                  <td className="py-3.5 px-5 text-center font-medium">{r.requests}</td>
                  <td className="py-3.5 px-5 text-right font-semibold text-text-primary">J${r.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-5"><StatusChip status={r.status} /></td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center justify-center gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-slate-100 transition-colors text-text-secondary">
                        <FileDown size={13} />
                        CSV
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-slate-100 transition-colors text-text-secondary">
                        <FileText size={13} />
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
