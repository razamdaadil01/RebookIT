'use client'

import { useState } from 'react'
import StatusBadge from '@/components/StatusBadge'
import Modal from '@/components/Modal'
import ConfirmDialog from '@/components/ConfirmDialog'
import DataTable from '@/components/DataTable'
import { Eye, Ban, UserX, Search } from 'lucide-react'

type User = {
  id: string
  name: string
  email: string
  phone: string
  role: 'buyer' | 'seller' | 'both'
  joined: string
  status: string
  listings: number
  sales: number
}

const USERS: User[] = [
  { id: 'U001', name: 'Marcus Williams',    email: 'marcus@email.com',   phone: '868-301-1234', role: 'seller', joined: 'Jan 12, 2024', status: 'active',    listings: 42, sales: 142 },
  { id: 'U002', name: 'Kerri-Ann Joseph',   email: 'kerri@email.com',    phone: '868-302-2345', role: 'seller', joined: 'Jan 18, 2024', status: 'active',    listings: 31, sales: 98  },
  { id: 'U003', name: 'Alicia Mohammed',    email: 'alicia@email.com',   phone: '868-303-3456', role: 'both',   joined: 'Feb 2, 2024',  status: 'active',    listings: 28, sales: 87  },
  { id: 'U004', name: 'Rajesh Persad',      email: 'rajesh@email.com',   phone: '868-304-4567', role: 'seller', joined: 'Feb 9, 2024',  status: 'active',    listings: 19, sales: 76  },
  { id: 'U005', name: 'Tricia Clarke',      email: 'tricia@email.com',   phone: '868-305-5678', role: 'both',   joined: 'Feb 14, 2024', status: 'active',    listings: 15, sales: 65  },
  { id: 'U006', name: 'Devon Rampersad',    email: 'devon@email.com',    phone: '868-306-6789', role: 'buyer',  joined: 'Mar 1, 2024',  status: 'active',    listings: 0,  sales: 0   },
  { id: 'U007', name: 'Simone Baptiste',    email: 'simone@email.com',   phone: '868-307-7890', role: 'seller', joined: 'Mar 5, 2024',  status: 'suspended', listings: 8,  sales: 22  },
  { id: 'U008', name: 'Anil Kumar',         email: 'anil@email.com',     phone: '868-308-8901', role: 'both',   joined: 'Mar 10, 2024', status: 'active',    listings: 12, sales: 34  },
  { id: 'U009', name: 'Sandra Hernandez',   email: 'sandra@email.com',   phone: '868-309-9012', role: 'buyer',  joined: 'Mar 15, 2024', status: 'inactive',  listings: 0,  sales: 0   },
  { id: 'U010', name: 'Christopher Paul',   email: 'chris@email.com',    phone: '868-310-0123', role: 'seller', joined: 'Mar 20, 2024', status: 'active',    listings: 9,  sales: 28  },
  { id: 'U011', name: 'Priya Ramkissoon',   email: 'priya@email.com',    phone: '868-311-1234', role: 'both',   joined: 'Apr 2, 2024',  status: 'active',    listings: 6,  sales: 18  },
  { id: 'U012', name: 'Tony Alleyne',       email: 'tony@email.com',     phone: '868-312-2345', role: 'seller', joined: 'Apr 8, 2024',  status: 'banned',    listings: 3,  sales: 7   },
  { id: 'U013', name: 'Michelle Narine',    email: 'michelle@email.com', phone: '868-313-3456', role: 'buyer',  joined: 'Apr 12, 2024', status: 'active',    listings: 0,  sales: 0   },
  { id: 'U014', name: 'David Ramoutar',     email: 'david@email.com',    phone: '868-314-4567', role: 'seller', joined: 'Apr 18, 2024', status: 'unverified',listings: 4,  sales: 0   },
  { id: 'U015', name: 'Kezia Phillip',      email: 'kezia@email.com',    phone: '868-315-5678', role: 'buyer',  joined: 'Apr 22, 2024', status: 'active',    listings: 0,  sales: 0   },
  { id: 'U016', name: 'Omar Abdullah',      email: 'omar@email.com',     phone: '868-316-6789', role: 'both',   joined: 'May 1, 2024',  status: 'active',    listings: 7,  sales: 14  },
  { id: 'U017', name: 'Candice Fraser',     email: 'candice@email.com',  phone: '868-317-7890', role: 'seller', joined: 'May 5, 2024',  status: 'suspended', listings: 5,  sales: 9   },
  { id: 'U018', name: 'Vikram Singh',       email: 'vikram@email.com',   phone: '868-318-8901', role: 'buyer',  joined: 'May 10, 2024', status: 'active',    listings: 0,  sales: 0   },
  { id: 'U019', name: 'Natasha Beckles',    email: 'natasha@email.com',  phone: '868-319-9012', role: 'both',   joined: 'May 15, 2024', status: 'active',    listings: 3,  sales: 5   },
  { id: 'U020', name: 'James Crichlow',     email: 'james@email.com',    phone: '868-320-0123', role: 'seller', joined: 'May 20, 2024', status: 'unverified',listings: 1,  sales: 0   },
]

const TABS = ['All', 'Buyers', 'Sellers', 'Suspended', 'Unverified']

function InitAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-purple-500', 'bg-teal-500']
  const c = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className={`w-8 h-8 rounded-full ${c} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {initials}
    </div>
  )
}

export default function UsersPage() {
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<User | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ type: string; user: User } | null>(null)

  const filtered = USERS.filter(u => {
    const matchTab =
      tab === 'All' ? true :
      tab === 'Buyers' ? (u.role === 'buyer' || u.role === 'both') :
      tab === 'Sellers' ? (u.role === 'seller' || u.role === 'both') :
      tab === 'Suspended' ? u.status === 'suspended' :
      tab === 'Unverified' ? u.status === 'unverified' : true
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const columns = [
    {
      header: 'User',
      accessor: (u: User) => (
        <div className="flex items-center gap-2">
          <InitAvatar name={u.name} />
          <div>
            <p className="font-medium text-text-primary text-sm">{u.name}</p>
            <p className="text-xs text-text-secondary">{u.email}</p>
          </div>
        </div>
      ),
    },
    { header: 'Phone', accessor: 'phone' as keyof User },
    { header: 'Role', accessor: (u: User) => <span className="capitalize text-sm text-text-secondary">{u.role}</span> },
    { header: 'Joined', accessor: 'joined' as keyof User },
    { header: 'Status', accessor: (u: User) => <StatusBadge status={u.status} /> },
    {
      header: 'Actions',
      accessor: (u: User) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setSelected(u)} className="p-1.5 rounded-md text-primary hover:bg-primary/10 transition-colors" title="View">
            <Eye size={15} />
          </button>
          <button onClick={() => setConfirmAction({ type: 'suspend', user: u })} className="p-1.5 rounded-md text-warning hover:bg-warning/10 transition-colors" title="Suspend">
            <UserX size={15} />
          </button>
          <button onClick={() => setConfirmAction({ type: 'ban', user: u })} className="p-1.5 rounded-md text-danger hover:bg-danger/10 transition-colors" title="Ban">
            <Ban size={15} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
        <p className="text-sm text-text-secondary mt-1">Manage all registered users on the platform</p>
      </div>

      {/* Search + Tabs row */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={filtered} />

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="User Details" width="max-w-md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <InitAvatar name={selected.name} />
              <div>
                <p className="font-semibold text-text-primary">{selected.name}</p>
                <p className="text-sm text-text-secondary">{selected.email}</p>
                <StatusBadge status={selected.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                ['User ID', selected.id],
                ['Phone', selected.phone],
                ['Role', selected.role],
                ['Joined', selected.joined],
                ['Listings', selected.listings.toString()],
                ['Sales', selected.sales.toString()],
              ].map(([label, val]) => (
                <div key={label} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-text-secondary">{label}</p>
                  <p className="text-sm font-medium text-text-primary capitalize">{val}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2 rounded-lg bg-warning/10 text-warning text-sm font-medium hover:bg-warning/20 transition-colors">Suspend</button>
              <button className="flex-1 py-2 rounded-lg bg-danger/10 text-danger text-sm font-medium hover:bg-danger/20 transition-colors">Ban User</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {}}
        title={confirmAction?.type === 'ban' ? 'Ban User' : 'Suspend User'}
        message={`Are you sure you want to ${confirmAction?.type} ${confirmAction?.user.name}? This action can be reversed from user settings.`}
        confirmLabel={confirmAction?.type === 'ban' ? 'Ban User' : 'Suspend'}
      />
    </div>
  )
}
