'use client'

import { useState } from 'react'
import { Bell, Mail, Smartphone, Send, CheckCircle, ToggleLeft, ToggleRight } from 'lucide-react'

const emailNotifs = [
  { key: 'new_user',      label: 'New user registered',                   desc: 'Alert when a new account is created',                 default: true  },
  { key: 'sub_activated', label: 'Subscription activated',                desc: 'Alert when a plan is activated (Fygaro or Manual)',   default: true  },
  { key: 'sub_expiring',  label: 'Subscription expiring (3 days before)', desc: 'Remind user 3 days before subscription expires',      default: true  },
  { key: 'pay_failed',    label: 'Payment failed',                        desc: 'Alert when a Fygaro payment fails',                   default: true  },
  { key: 'withdrawal',    label: 'Withdrawal request submitted',          desc: 'Alert admin when a referral withdrawal is requested', default: true  },
  { key: 'manual_act',    label: 'Manual activation done',                desc: 'Log and notify when admin manually activates a plan', default: true  },
  { key: 'listing_pend',  label: 'New listing pending approval',          desc: 'Alert admin when a listing needs review',             default: false },
  { key: 'listing_rep',   label: 'Listing reported',                      desc: 'Alert admin when a listing is reported by a user',    default: true  },
]

const notifHistory = [
  { title: 'Subscription Expiry Reminder', target: 'All Users',     sent: 'May 31, 2026 08:00', recipients: 284,  status: 'Delivered' },
  { title: 'New Feature: E-Directory',     target: 'All Users',     sent: 'May 28, 2026 10:00', recipients: 1284, status: 'Delivered' },
  { title: 'Payment Failed Alert',         target: 'Specific User', sent: 'May 27, 2026 14:30', recipients: 1,    status: 'Delivered' },
  { title: 'Bill Express Downtime Notice', target: 'Admins Only',   sent: 'May 25, 2026 09:15', recipients: 4,    status: 'Delivered' },
  { title: 'Withdrawal Processed',         target: 'Specific User', sent: 'May 24, 2026 16:45', recipients: 1,    status: 'Delivered' },
]

function buildDefaultToggles() {
  const obj: Record<string, boolean> = {}
  emailNotifs.forEach(n => { obj[n.key] = n.default })
  return obj
}

export default function NotificationsPage() {
  const [emailToggles, setEmailToggles] = useState<Record<string, boolean>>(buildDefaultToggles())
  const [pushToggles, setPushToggles] = useState<Record<string, boolean>>(buildDefaultToggles())
  const [testTarget, setTestTarget] = useState('All Users')
  const [testTitle, setTestTitle] = useState('')
  const [testMessage, setTestMessage] = useState('')

  function toggleEmail(key: string) {
    setEmailToggles(prev => ({ ...prev, [key]: !prev[key] }))
  }
  function togglePush(key: string) {
    setPushToggles(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Notifications Configuration</h1>
        <p className="text-text-secondary text-sm mt-1">Configure email and push notification rules</p>
      </div>

      {/* Email Notifications */}
      <div className="card">
        <div className="flex items-center gap-2 mb-1">
          <Mail size={18} className="text-primary" />
          <h3 className="font-semibold text-text-primary text-base">Email Notifications</h3>
        </div>
        <p className="text-xs text-text-secondary mb-4">Configure which events trigger email alerts to admins and users</p>
        <div>
          {emailNotifs.map(n => (
            <div key={n.key} className="flex justify-between items-start py-3 border-b border-border last:border-0">
              <div className="flex-1 mr-4">
                <p className="text-sm font-medium text-text-primary">{n.label}</p>
                <p className="text-xs text-text-secondary mt-0.5">{n.desc}</p>
              </div>
              <button onClick={() => toggleEmail(n.key)} className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
                {emailToggles[n.key] ? <ToggleRight size={26} className="text-success" /> : <ToggleLeft size={26} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="card">
        <div className="flex items-center gap-2 mb-1">
          <Smartphone size={18} className="text-primary" />
          <h3 className="font-semibold text-text-primary text-base">Push Notifications</h3>
        </div>
        <p className="text-xs text-text-secondary mb-4">Configure push notification events for mobile and web</p>
        <div>
          {emailNotifs.map(n => (
            <div key={n.key} className="flex justify-between items-start py-3 border-b border-border last:border-0">
              <div className="flex-1 mr-4">
                <p className="text-sm font-medium text-text-primary">{n.label}</p>
                <p className="text-xs text-text-secondary mt-0.5">{n.desc}</p>
              </div>
              <button onClick={() => togglePush(n.key)} className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
                {pushToggles[n.key] ? <ToggleRight size={26} className="text-success" /> : <ToggleLeft size={26} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Send Test Notification */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-primary" />
          <h3 className="font-semibold text-text-primary text-base">Send Test Notification</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-text-secondary mb-1">Target</label>
            <select className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none" value={testTarget} onChange={e => setTestTarget(e.target.value)}>
              {['All Users', 'Specific User', 'Admins Only'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1">Title</label>
            <input className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Notification title..." value={testTitle} onChange={e => setTestTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1">Message</label>
            <textarea rows={3} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Notification message..." value={testMessage} onChange={e => setTestMessage(e.target.value)} />
          </div>
          <button className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
            <Send size={15} /> Send Test
          </button>
        </div>
      </div>

      {/* Notification History */}
      <div className="card p-0">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Bell size={16} className="text-primary" />
          <h3 className="font-semibold text-text-primary text-base">Recent Notifications Sent</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Title</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Target</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Sent At</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Recipients</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {notifHistory.map((n, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-text-primary">{n.title}</td>
                <td className="px-5 py-3 text-text-secondary">{n.target}</td>
                <td className="px-5 py-3 text-text-secondary">{n.sent}</td>
                <td className="px-5 py-3 text-text-secondary">{n.recipients.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <CheckCircle size={11} /> {n.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors mt-6">
        Save Changes
      </button>
    </div>
  )
}
