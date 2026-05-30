'use client'

import { useState } from 'react'
import { Send, Search, Bell, Users, User, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'

const notifHistory = [
  { id: 1, title: 'New Feature: Instant Chat', target: 'All Users', sent: 'May 25, 2026 10:00', recipients: 12847, status: 'Sent' },
  { id: 2, title: 'Seller Tip: Add More Photos', target: 'Sellers Only', sent: 'May 22, 2026 09:00', recipients: 4231, status: 'Sent' },
  { id: 3, title: 'Weekend Deals Alert!', target: 'Buyers Only', sent: 'May 18, 2026 08:00', recipients: 8616, status: 'Sent' },
  { id: 4, title: 'Verify Your Account', target: 'Unverified Users', sent: 'May 15, 2026 11:30', recipients: 347, status: 'Sent' },
  { id: 5, title: 'Monthly Digest — May 2026', target: 'All Users', sent: 'May 1, 2026 09:00', recipients: 12104, status: 'Sent' },
  { id: 6, title: 'Summer Promotion Blast', target: 'All Users', sent: 'Jun 1, 2026 08:00', recipients: 0, status: 'Scheduled' },
]

const PAGE_SIZE = 10

export default function NotificationsPage() {
  const [target, setTarget] = useState('All Users')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [scheduled, setScheduled] = useState(false)
  const [schedDate, setSchedDate] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sent, setSent] = useState(false)

  const filtered = notifHistory.filter(n => search === '' || n.title.toLowerCase().includes(search.toLowerCase()) || n.target.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  const handleSend = () => {
    if (title && message) { setSent(true); setTimeout(() => { setSent(false); setTitle(''); setMessage('') }, 3000) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Notifications & Broadcasts</h1>
        <p className="text-text-secondary text-sm mt-1">Send push notifications to platform users.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Form */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2"><Bell size={16} className="text-primary" />New Notification</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide block mb-1.5">Target Audience</label>
                <select value={target} onChange={e => setTarget(e.target.value)} className="input">
                  <option>All Users</option>
                  <option>Buyers Only</option>
                  <option>Sellers Only</option>
                  <option>Unverified Users</option>
                  <option>Specific User</option>
                </select>
              </div>
              {target === 'Specific User' && (
                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide block mb-1.5">Search User</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input placeholder="Search by name or email..." className="input pl-9" />
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide block mb-1.5">Notification Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., New Feature Available!" className="input" maxLength={60} />
                <p className="text-xs text-text-secondary mt-1 text-right">{title.length}/60</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide block mb-1.5">Message</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Write your notification message here..." className="input resize-none" maxLength={200} />
                <p className="text-xs text-text-secondary mt-1 text-right">{message.length}/200</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-medium">Schedule</p>
                    <p className="text-xs text-text-secondary">{scheduled ? 'Send at a later time' : 'Send immediately'}</p>
                  </div>
                </div>
                <button onClick={() => setScheduled(!scheduled)} className={`relative w-10 h-5 rounded-full transition-colors ${scheduled ? 'bg-primary' : 'bg-slate-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${scheduled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              {scheduled && (
                <input type="datetime-local" value={schedDate} onChange={e => setSchedDate(e.target.value)} className="input" />
              )}
              {sent ? (
                <div className="py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm text-center rounded-lg font-medium">✓ Notification sent successfully!</div>
              ) : (
                <button onClick={handleSend} disabled={!title || !message} className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send size={15} />{scheduled ? 'Schedule Notification' : 'Send Now'}
                </button>
              )}
            </div>
          </div>

          {/* Preview */}
          {(title || message) && (
            <div className="card mt-4">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Preview</p>
              <div className="bg-slate-800 text-white rounded-xl p-4 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center"><span className="text-white text-xs font-bold">RB</span></div>
                  <span className="text-xs opacity-60">Rebook It · now</span>
                </div>
                <p className="font-semibold text-sm">{title || 'Notification Title'}</p>
                <p className="text-xs opacity-80 mt-1">{message || 'Your message will appear here...'}</p>
              </div>
            </div>
          )}
        </div>

        {/* History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-4">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search notifications..." className="input pl-9" />
            </div>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">Notification History</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-slate-50">
                  {['Title', 'Target', 'Sent At', 'Recipients', 'Status'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(notif => (
                  <tr key={notif.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-text-primary max-w-[200px]">
                      <p className="truncate">{notif.title}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {notif.target.includes('All') ? <Users size={13} className="text-slate-400" /> : <User size={13} className="text-slate-400" />}
                        <span className="text-xs text-text-secondary">{notif.target}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-secondary text-xs whitespace-nowrap">{notif.sent}</td>
                    <td className="py-3 px-4 font-medium text-text-primary">{notif.recipients > 0 ? notif.recipients.toLocaleString() : '—'}</td>
                    <td className="py-3 px-4"><StatusBadge status={notif.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-slate-50">
              <p className="text-sm text-text-secondary">{filtered.length} notifications</p>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-md border border-border bg-white disabled:opacity-40"><ChevronLeft size={15} /></button>
                <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-md border border-border bg-white disabled:opacity-40"><ChevronRight size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
