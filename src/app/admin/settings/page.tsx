'use client'

import { useState } from 'react'
import { Save, Plus, Eye, EyeOff, Shield, User, AlertCircle } from 'lucide-react'

const adminUsers = [
  { id: 1, name: 'Super Admin', email: 'admin@rebookit.tt', role: 'Super Admin', lastLogin: 'May 28, 2026' },
  { id: 2, name: 'Kavita Sharma', email: 'kavita@rebookit.tt', role: 'Moderator', lastLogin: 'May 27, 2026' },
  { id: 3, name: 'Dylan Peters', email: 'dylan@rebookit.tt', role: 'Finance', lastLogin: 'May 26, 2026' },
  { id: 4, name: 'Renée Augustin', email: 'renee@rebookit.tt', role: 'Moderator', lastLogin: 'May 25, 2026' },
]

const auditLog = [
  { id: 1, admin: 'Super Admin', action: 'Suspended user: Simone Baptiste', timestamp: 'May 28, 2026 09:41', ip: '192.168.1.1' },
  { id: 2, admin: 'Kavita Sharma', action: 'Approved listing: iPhone 14 Pro (#1001)', timestamp: 'May 28, 2026 09:12', ip: '192.168.1.2' },
  { id: 3, admin: 'Dylan Peters', action: 'Processed payout: PAY-2040 (TTD $8,700)', timestamp: 'May 27, 2026 15:33', ip: '192.168.1.3' },
  { id: 4, admin: 'Renée Augustin', action: 'Removed flagged listing: Fake Rolex #MOD-4021', timestamp: 'May 27, 2026 14:18', ip: '192.168.1.4' },
  { id: 5, admin: 'Super Admin', action: 'Updated commission rate to 5%', timestamp: 'May 27, 2026 10:05', ip: '192.168.1.1' },
  { id: 6, admin: 'Kavita Sharma', action: 'Resolved dispute: DIS-1044', timestamp: 'May 26, 2026 16:47', ip: '192.168.1.2' },
  { id: 7, admin: 'Super Admin', action: 'Sent broadcast notification: "New Feature: Instant Chat"', timestamp: 'May 25, 2026 10:00', ip: '192.168.1.1' },
  { id: 8, admin: 'Dylan Peters', action: 'Rejected payout: PAY-2037 (insufficient bank info)', timestamp: 'May 25, 2026 09:22', ip: '192.168.1.3' },
]

const TABS = ['General', 'Payment Gateway', 'Commission Rules', 'Admin Roles', 'Audit Log']

export default function SettingsPage() {
  const [tab, setTab] = useState('General')
  const [showApiKey, setShowApiKey] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Manage platform configuration and administration.</p>
      </div>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
              ${tab === t ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>{t}</button>
        ))}
      </div>

      {tab === 'General' && (
        <div className="card max-w-2xl space-y-5">
          <h2 className="text-sm font-semibold text-text-primary">General Settings</h2>
          {[
            { label: 'Platform Name', value: 'Rebook It', placeholder: 'Platform name' },
            { label: 'Contact Email', value: 'support@rebookit.tt', placeholder: 'Contact email' },
            { label: 'Support Phone', value: '+1 868-800-7326', placeholder: 'Support phone' },
          ].map(field => (
            <div key={field.label}>
              <label className="text-sm font-medium text-text-primary block mb-1.5">{field.label}</label>
              <input defaultValue={field.value} placeholder={field.placeholder} className="input" />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">Timezone</label>
            <select className="input" defaultValue="America/Port_of_Spain">
              <option value="America/Port_of_Spain">America/Port_of_Spain (AST, UTC-4)</option>
              <option value="America/New_York">America/New_York (EST)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">Platform Logo</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 cursor-pointer transition-colors">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl font-bold">RB</span>
              </div>
              <p className="text-sm font-medium text-text-primary">Click to upload new logo</p>
              <p className="text-xs text-text-secondary mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
          {saved ? (
            <div className="py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm text-center rounded-lg font-medium">✓ Settings saved successfully!</div>
          ) : (
            <button onClick={handleSave} className="btn-primary"><Save size={15} />Save Changes</button>
          )}
        </div>
      )}

      {tab === 'Payment Gateway' && (
        <div className="card max-w-2xl space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-sm font-semibold text-text-primary">Powertranz Payment Gateway</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Connected</span>
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">API Key</label>
            <div className="relative">
              <input type={showApiKey ? 'text' : 'password'} defaultValue="ptz_live_sk_caribbean_8f2a1b3c4d5e6f" className="input pr-10" />
              <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">API Secret</label>
            <input type="password" defaultValue="ptz_secret_8a7b6c5d4e3f2g1h" className="input" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">Webhook URL</label>
            <input defaultValue="https://rebookit.tt/api/webhooks/powertranz" className="input" />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-sm font-medium">Enable Payments</p>
              <p className="text-xs text-text-secondary mt-0.5">Accept payments on the platform</p>
            </div>
            <button className="relative w-11 h-6 rounded-full bg-success">
              <span className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow" />
            </button>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <AlertCircle size={16} />
            <span>Test mode is disabled. All transactions are live.</span>
          </div>
          {saved ? (
            <div className="py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm text-center rounded-lg font-medium">✓ Gateway settings saved!</div>
          ) : (
            <button onClick={handleSave} className="btn-primary"><Save size={15} />Save Gateway Settings</button>
          )}
        </div>
      )}

      {tab === 'Commission Rules' && (
        <div className="card max-w-2xl space-y-5">
          <h2 className="text-sm font-semibold text-text-primary">Commission & Fee Rules</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-primary block mb-1.5">Platform Fee (%)</label>
              <div className="relative"><input type="number" defaultValue="3" min="0" max="20" className="input pr-8" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">%</span></div>
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary block mb-1.5">Referral Commission (%)</label>
              <div className="relative"><input type="number" defaultValue="5" min="0" max="20" className="input pr-8" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">%</span></div>
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary block mb-1.5">Min Payout (TTD)</label>
              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">$</span><input type="number" defaultValue="100" className="input pl-7" /></div>
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary block mb-1.5">Min Withdrawal — Referral</label>
              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">$</span><input type="number" defaultValue="50" className="input pl-7" /></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div><p className="text-sm font-medium">Auto-Approve Payouts</p><p className="text-xs text-text-secondary mt-0.5">Auto-approve payouts under TTD $500</p></div>
            <button className="relative w-11 h-6 rounded-full bg-slate-300"><span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow" /></button>
          </div>
          {saved ? (
            <div className="py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm text-center rounded-lg font-medium">✓ Commission rules saved!</div>
          ) : (
            <button onClick={handleSave} className="btn-primary"><Save size={15} />Save Rules</button>
          )}
        </div>
      )}

      {tab === 'Admin Roles' && (
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">{adminUsers.length} administrators</p>
            <button onClick={() => setShowModal(true)} className="btn-primary"><Plus size={15} />Add Admin</button>
          </div>
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-slate-50">
                  {['Name', 'Email', 'Role', 'Last Login', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adminUsers.map(admin => (
                  <tr key={admin.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"><User size={14} className="text-primary" /></div>
                        <span className="font-medium text-text-primary">{admin.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-secondary text-sm">{admin.email}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                        ${admin.role === 'Super Admin' ? 'bg-primary/10 text-primary' : admin.role === 'Finance' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary text-xs">{admin.lastLogin}</td>
                    <td className="py-3 px-4">
                      {admin.role !== 'Super Admin' && (
                        <div className="flex gap-1">
                          <button className="px-2.5 py-1 text-xs bg-slate-50 border border-border rounded text-text-secondary hover:bg-slate-100">Edit</button>
                          <button className="px-2.5 py-1 text-xs bg-red-50 border border-red-200 rounded text-danger hover:bg-red-100">Remove</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
                <h3 className="text-base font-semibold mb-4">Add Administrator</h3>
                <div className="space-y-3">
                  <input placeholder="Full Name" className="input" />
                  <input placeholder="Email Address" type="email" className="input" />
                  <select className="input"><option>Moderator</option><option>Finance</option><option>Super Admin</option></select>
                </div>
                <div className="flex gap-2 mt-5">
                  <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary justify-center">Cancel</button>
                  <button onClick={() => setShowModal(false)} className="flex-1 btn-primary justify-center">Add Admin</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'Audit Log' && (
        <div className="card p-0 overflow-hidden max-w-4xl">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-text-primary">Admin Audit Log</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                {['Admin', 'Action', 'Timestamp', 'IP Address'].map(h => (
                  <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLog.map(entry => (
                <tr key={entry.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center"><User size={12} className="text-primary" /></div>
                      <span className="font-medium text-text-primary text-xs">{entry.admin}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-text-primary text-sm">{entry.action}</td>
                  <td className="py-3 px-5 text-text-secondary text-xs whitespace-nowrap">{entry.timestamp}</td>
                  <td className="py-3 px-5 font-mono text-xs text-text-secondary">{entry.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
