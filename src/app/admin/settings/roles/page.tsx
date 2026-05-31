'use client'

import { useState } from 'react'
import { Shield, Edit2, UserX, CheckCircle, XCircle, Info } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'
import ConfirmDialog from '@/components/ConfirmDialog'

function InitAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-purple-500', 'bg-teal-500']
  const c = colors[name.charCodeAt(0) % colors.length]
  const dim = size === 'lg' ? 'w-12 h-12 text-base' : 'w-8 h-8 text-xs'
  return <div className={`${dim} rounded-full ${c} flex items-center justify-center text-white font-bold shrink-0`}>{initials}</div>
}

const adminUsers = [
  { name: 'Devon Brown',     email: 'devon@rebookit.com',   role: 'Super Admin',   lastActive: '2 hours ago',  status: 'active' },
  { name: 'Sandra Francis',  email: 'sandra@rebookit.com',  role: 'Admin',         lastActive: '1 day ago',    status: 'active' },
  { name: 'Marcus Gordon',   email: 'finance@rebookit.com', role: 'Finance Admin', lastActive: '3 hours ago',  status: 'active' },
  { name: 'Pauline Stewart', email: 'support@rebookit.com', role: 'Support',       lastActive: '5 hours ago',  status: 'active' },
]

function roleBadge(role: string) {
  const map: Record<string, string> = {
    'Super Admin': 'bg-red-100 text-red-700',
    'Admin': 'bg-primary/10 text-primary',
    'Finance Admin': 'bg-green-100 text-green-700',
    'Support': 'bg-slate-100 text-slate-600',
  }
  return map[role] ?? 'bg-slate-100 text-slate-600'
}

const modules = [
  'Dashboard', 'All Users', 'Listings', 'Categories', 'Fygaro Payments',
  'Manual Activation', 'Bill Express', 'Refer & Earn', 'Subscriptions',
  'Reports', 'General Settings', 'RBAC / Roles',
]

const roles = ['Super Admin', 'Admin', 'Finance Admin', 'Support']

type Perm = { view: boolean; edit: boolean; delete: boolean }

const permissions: Record<string, Record<string, Perm>> = {
  'Dashboard':         { 'Super Admin': {view:true,  edit:true,  delete:true},  'Admin': {view:true,  edit:false, delete:false}, 'Finance Admin': {view:true,  edit:false, delete:false}, 'Support': {view:true,  edit:false, delete:false} },
  'All Users':         { 'Super Admin': {view:true,  edit:true,  delete:true},  'Admin': {view:true,  edit:true,  delete:false}, 'Finance Admin': {view:true,  edit:false, delete:false}, 'Support': {view:true,  edit:false, delete:false} },
  'Listings':          { 'Super Admin': {view:true,  edit:true,  delete:true},  'Admin': {view:true,  edit:true,  delete:true},  'Finance Admin': {view:true,  edit:false, delete:false}, 'Support': {view:true,  edit:false, delete:false} },
  'Categories':        { 'Super Admin': {view:true,  edit:true,  delete:true},  'Admin': {view:true,  edit:true,  delete:false}, 'Finance Admin': {view:false, edit:false, delete:false}, 'Support': {view:false, edit:false, delete:false} },
  'Fygaro Payments':   { 'Super Admin': {view:true,  edit:true,  delete:true},  'Admin': {view:true,  edit:false, delete:false}, 'Finance Admin': {view:true,  edit:true,  delete:false}, 'Support': {view:false, edit:false, delete:false} },
  'Manual Activation': { 'Super Admin': {view:true,  edit:true,  delete:false}, 'Admin': {view:false, edit:false, delete:false}, 'Finance Admin': {view:false, edit:false, delete:false}, 'Support': {view:true,  edit:true,  delete:false} },
  'Bill Express':      { 'Super Admin': {view:true,  edit:true,  delete:true},  'Admin': {view:true,  edit:false, delete:false}, 'Finance Admin': {view:true,  edit:true,  delete:false}, 'Support': {view:false, edit:false, delete:false} },
  'Refer & Earn':      { 'Super Admin': {view:true,  edit:true,  delete:true},  'Admin': {view:true,  edit:true,  delete:false}, 'Finance Admin': {view:true,  edit:true,  delete:false}, 'Support': {view:false, edit:false, delete:false} },
  'Subscriptions':     { 'Super Admin': {view:true,  edit:true,  delete:true},  'Admin': {view:true,  edit:true,  delete:false}, 'Finance Admin': {view:true,  edit:true,  delete:false}, 'Support': {view:true,  edit:false, delete:false} },
  'Reports':           { 'Super Admin': {view:true,  edit:true,  delete:false}, 'Admin': {view:true,  edit:false, delete:false}, 'Finance Admin': {view:true,  edit:true,  delete:false}, 'Support': {view:false, edit:false, delete:false} },
  'General Settings':  { 'Super Admin': {view:true,  edit:true,  delete:false}, 'Admin': {view:true,  edit:false, delete:false}, 'Finance Admin': {view:false, edit:false, delete:false}, 'Support': {view:false, edit:false, delete:false} },
  'RBAC / Roles':      { 'Super Admin': {view:true,  edit:true,  delete:true},  'Admin': {view:false, edit:false, delete:false}, 'Finance Admin': {view:false, edit:false, delete:false}, 'Support': {view:false, edit:false, delete:false} },
}

const roleDescriptions = [
  { role: 'Super Admin', border: 'border-l-red-500', desc: 'Full platform access with ability to manage all settings, users, and permissions.', perms: ['All module access', 'Manage RBAC', 'Delete records', 'Platform configuration'] },
  { role: 'Admin',       border: 'border-l-primary', desc: 'General administrative access to manage users, listings, and content moderation.', perms: ['User management', 'Listing approval/rejection', 'Category management', 'View reports'] },
  { role: 'Support',     border: 'border-l-slate-400', desc: 'Customer support access to assist users and handle basic operations.', perms: ['View users', 'Manual activation', 'View subscriptions', 'Respond to tickets'] },
]

export default function RolesPage() {
  const [deactivateTarget, setDeactivateTarget] = useState<typeof adminUsers[0] | null>(null)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Roles &amp; Permissions</h1>
        <p className="text-text-secondary text-sm mt-1">Manage admin access levels and module permissions</p>
      </div>

      {/* Admin Users Table */}
      <div className="card p-0 overflow-x-auto">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Shield size={16} className="text-primary" />
          <h2 className="font-semibold text-text-primary">Admin Users</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              <th className="text-left px-5 py-3 text-text-secondary font-medium">User</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Role</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Last Active</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Status</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((u, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <InitAvatar name={u.name} />
                    <div>
                      <p className="font-medium text-text-primary">{u.name}</p>
                      <p className="text-xs text-text-secondary">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge(u.role)}`}>{u.role}</span>
                </td>
                <td className="px-5 py-3 text-text-secondary">{u.lastActive}</td>
                <td className="px-5 py-3"><StatusBadge status={u.status} /></td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-primary text-primary text-xs rounded-lg hover:bg-primary/5 transition-colors">
                      <Edit2 size={12} /> Edit Role
                    </button>
                    {u.role !== 'Super Admin' && (
                      <button onClick={() => setDeactivateTarget(u)} className="flex items-center gap-1.5 px-2.5 py-1.5 border border-danger text-danger text-xs rounded-lg hover:bg-red-50 transition-colors">
                        <UserX size={12} /> Deactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Description Cards */}
      <div className="grid grid-cols-3 gap-4">
        {roleDescriptions.map(r => (
          <div key={r.role} className={`card border-l-4 ${r.border}`}>
            <h3 className="font-semibold text-text-primary mb-1">{r.role}</h3>
            <p className="text-xs text-text-secondary mb-3">{r.desc}</p>
            <ul className="space-y-1">
              {r.perms.map((p, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                  <CheckCircle size={12} className="text-success shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <div className="card p-0 overflow-x-auto">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-text-primary">Permissions Matrix</h2>
          <p className="text-xs text-text-secondary mt-0.5">V = View, E = Edit, D = Delete</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Module</th>
              {roles.map(r => (
                <th key={r} className="text-left px-5 py-3 text-text-secondary font-medium">{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((mod, i) => (
              <tr key={mod} className={`border-b border-border last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                <td className="px-5 py-3 font-medium text-text-primary text-sm">{mod}</td>
                {roles.map(role => {
                  const perm = (permissions[mod] && permissions[mod][role]) ? permissions[mod][role] : { view: false, edit: false, delete: false }
                  return (
                    <td key={role} className="px-5 py-3">
                      <div className="flex gap-2 items-center">
                        <span className="flex items-center gap-0.5">
                          {perm.view
                            ? <CheckCircle size={13} className="text-success" />
                            : <XCircle size={13} className="text-slate-300" />}
                          <span className="text-[10px] text-text-secondary">V</span>
                        </span>
                        <span className="flex items-center gap-0.5">
                          {perm.edit
                            ? <CheckCircle size={13} className="text-success" />
                            : <XCircle size={13} className="text-slate-300" />}
                          <span className="text-[10px] text-text-secondary">E</span>
                        </span>
                        <span className="flex items-center gap-0.5">
                          {perm.delete
                            ? <CheckCircle size={13} className="text-success" />
                            : <XCircle size={13} className="text-slate-300" />}
                          <span className="text-[10px] text-text-secondary">D</span>
                        </span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">Only Super Admin can perform Manual Activation and modify RBAC settings. All admin actions are logged in the Audit Log.</p>
      </div>

      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={() => setDeactivateTarget(null)}
        title="Deactivate Admin User"
        message={`Are you sure you want to deactivate ${deactivateTarget?.name}? They will lose access immediately.`}
        confirmLabel="Deactivate"
      />
    </div>
  )
}
