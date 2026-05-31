'use client'

import { useState } from 'react'
import { Copy, Eye, EyeOff, ToggleLeft, ToggleRight, Upload, Save, Globe, Phone, Mail, Clock } from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function GeneralSettingsPage() {
  const [platformName, setPlatformName] = useState('Rebook It')
  const [contactEmail, setContactEmail] = useState('admin@rebookit.com')
  const [supportPhone, setSupportPhone] = useState('+1-876-555-0100')
  const [timezone, setTimezone] = useState('(GMT-5) Jamaica Standard Time')
  const [showFygaroKey, setShowFygaroKey] = useState(false)
  const [showBECode, setShowBECode] = useState(false)
  const [enableFygaro, setEnableFygaro] = useState(true)
  const [enableBE, setEnableBE] = useState(true)
  const [maxImages, setMaxImages] = useState(8)
  const [maxDuration, setMaxDuration] = useState(60)
  const [autoExpire, setAutoExpire] = useState(true)
  const [requireApproval, setRequireApproval] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">General Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Configure platform-wide settings and integrations</p>
      </div>

      {/* Section 1: Platform Information */}
      <div className="card space-y-5">
        <h3 className="font-semibold text-text-primary text-base flex items-center gap-2"><Globe size={16} className="text-primary" /> Platform Information</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0">Platform Name</label>
            <input className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" value={platformName} onChange={e => setPlatformName(e.target.value)} />
          </div>
          <div className="flex items-start gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0 pt-2">Logo</label>
            <div className="flex-1 border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-text-secondary hover:border-primary/40 transition-colors cursor-pointer">
              <Upload size={20} />
              <p className="text-sm">Upload logo (PNG, SVG)</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0 flex items-center gap-1.5"><Mail size={14} /> Contact Email</label>
            <input type="email" className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0 flex items-center gap-1.5"><Phone size={14} /> Support Phone</label>
            <input className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" value={supportPhone} onChange={e => setSupportPhone(e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0 flex items-center gap-1.5"><Clock size={14} /> Timezone</label>
            <select className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none" value={timezone} onChange={e => setTimezone(e.target.value)}>
              {['(GMT-5) Jamaica Standard Time', '(GMT-5) Eastern Standard Time', '(GMT+0) UTC'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0">Region</label>
            <span className="bg-slate-100 text-slate-600 text-sm px-3 py-1.5 rounded-lg font-medium">Jamaica</span>
          </div>
        </div>
      </div>

      {/* Section 2: Payment Gateway */}
      <div className="card space-y-5">
        <h3 className="font-semibold text-text-primary text-base">Payment Gateway Configuration</h3>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-text-primary bg-indigo-50 px-3 py-2 rounded-lg">Fygaro</h4>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0">Fygaro API Key</label>
            <div className="flex-1 flex items-center gap-2">
              <input
                type={showFygaroKey ? 'text' : 'password'}
                className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none font-mono"
                defaultValue="fygaro_key_prod_live_abc123xyz"
              />
              <button onClick={() => setShowFygaroKey(v => !v)} className="p-2 border border-border rounded-lg hover:bg-slate-50 transition-colors text-text-secondary">
                {showFygaroKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button onClick={() => copyToClipboard('fygaro_key_prod_live_abc123xyz')} className="p-2 border border-border rounded-lg hover:bg-slate-50 transition-colors text-text-secondary">
                <Copy size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0">Webhook URL</label>
            <div className="flex-1 flex items-center gap-2">
              <input type="text" className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none bg-slate-50 font-mono text-xs" value="https://api.rebookit.com/webhooks/fygaro" readOnly />
              <button onClick={() => copyToClipboard('https://api.rebookit.com/webhooks/fygaro')} className="p-2 border border-border rounded-lg hover:bg-slate-50 transition-colors text-text-secondary">
                <Copy size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0">Enable Fygaro</label>
            <button onClick={() => setEnableFygaro(v => !v)} className="text-slate-400 hover:text-slate-600 transition-colors">
              {enableFygaro ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} />}
            </button>
          </div>
        </div>

        <hr className="border-border" />

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-text-primary bg-teal-50 px-3 py-2 rounded-lg">Bill Express</h4>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0">Agent Code</label>
            <div className="flex-1 flex items-center gap-2">
              <input
                type={showBECode ? 'text' : 'password'}
                className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none font-mono"
                defaultValue="BE2041"
              />
              <button onClick={() => setShowBECode(v => !v)} className="p-2 border border-border rounded-lg hover:bg-slate-50 transition-colors text-text-secondary">
                {showBECode ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0">Enable Bill Express</label>
            <button onClick={() => setEnableBE(v => !v)} className="text-slate-400 hover:text-slate-600 transition-colors">
              {enableBE ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Listing Settings */}
      <div className="card space-y-5">
        <h3 className="font-semibold text-text-primary text-base">Listing Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0">Max Images per Listing</label>
            <input type="number" className="w-24 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none" value={maxImages} onChange={e => setMaxImages(parseInt(e.target.value) || 0)} />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0">Max Listing Duration</label>
            <div className="flex items-center gap-2">
              <input type="number" className="w-24 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none" value={maxDuration} onChange={e => setMaxDuration(parseInt(e.target.value) || 0)} />
              <span className="text-sm text-text-secondary">days</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0">Auto-expire listings</label>
            <button onClick={() => setAutoExpire(v => !v)} className="text-slate-400 hover:text-slate-600 transition-colors">
              {autoExpire ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} />}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-text-primary shrink-0">Require approval before publish</label>
            <button onClick={() => setRequireApproval(v => !v)} className="text-slate-400 hover:text-slate-600 transition-colors">
              {requireApproval ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Danger Zone */}
      <div className="card border border-danger space-y-4">
        <h3 className="font-semibold text-danger text-base">Danger Zone</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Delete All Expired Listings</p>
              <p className="text-xs text-text-secondary mt-0.5">Permanently remove all listings that have passed their expiry date.</p>
            </div>
            <button onClick={() => setConfirmDelete(true)} className="px-4 py-2 border border-danger text-danger text-sm font-medium rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
              Delete Expired
            </button>
          </div>
          <hr className="border-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Reset Platform Settings</p>
              <p className="text-xs text-text-secondary mt-0.5">Restore all settings to their factory defaults. This cannot be undone.</p>
            </div>
            <button onClick={() => setConfirmReset(true)} className="px-4 py-2 border border-danger text-danger text-sm font-medium rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
              Reset Settings
            </button>
          </div>
        </div>
      </div>

      <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
        <Save size={16} /> Save Changes
      </button>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => setConfirmDelete(false)}
        title="Delete All Expired Listings"
        message="This will permanently delete all expired listings. This action cannot be undone."
        confirmLabel="Delete All"
      />
      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={() => setConfirmReset(false)}
        title="Reset Platform Settings"
        message="This will restore all settings to factory defaults. Are you absolutely sure?"
        confirmLabel="Reset Settings"
      />
    </div>
  )
}
