'use client'

import { useState, useMemo } from 'react'
import { Search, Eye } from 'lucide-react'

function InitAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-purple-500', 'bg-teal-500']
  const c = colors[name.charCodeAt(0) % colors.length]
  return <div className={`w-8 h-8 rounded-full ${c} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{initials}</div>
}

const logs = [
  { id:1,  name:'Tricia Clarke',     email:'tricia@mail.com',     type:'Login',                  desc:'Logged in from Chrome browser',                    ip:'192.168.1.102', device:'Desktop', parish:'Kingston',      date:'May 31, 2026 08:14' },
  { id:2,  name:'Marcus Williams',   email:'marcus@mail.com',     type:'Listing Created',        desc:'Created listing: MacBook Air M2 – Kingston',       ip:'10.0.0.44',     device:'Mobile',  parish:'St. Andrew',    date:'May 31, 2026 09:02' },
  { id:3,  name:'Khalil Brown',      email:'khalil@mail.com',     type:'Referral Made',          desc:'Referred user: Devon Rampersad via referral link', ip:'172.16.0.5',    device:'Mobile',  parish:'St. Catherine', date:'May 31, 2026 09:45' },
  { id:4,  name:'Nadine Campbell',   email:'nadine@mail.com',     type:'Subscription Activated', desc:'Activated Pro Plan (Fygaro) – 12 months',          ip:'192.168.2.10',  device:'Desktop', parish:'St. James',     date:'May 30, 2026 14:22' },
  { id:5,  name:'Sharon Reid',       email:'sharon@mail.com',     type:'Purchase',               desc:'Purchased: Honda Civic 2019 from Anil Kumar',      ip:'10.0.1.55',     device:'Mobile',  parish:'Manchester',    date:'May 30, 2026 11:38' },
  { id:6,  name:'Andre Gordon',      email:'andre@mail.com',      type:'Listing Edited',         desc:'Edited listing: Tutor – Advanced Maths, Kingston', ip:'192.168.3.77',  device:'Desktop', parish:'Clarendon',     date:'May 30, 2026 10:05' },
  { id:7,  name:'Beverley Scott',    email:'beverley@mail.com',   type:'Profile Updated',        desc:'Updated profile photo and bio',                    ip:'10.0.2.8',      device:'Mobile',  parish:'St. Ann',       date:'May 29, 2026 16:50' },
  { id:8,  name:'Michael Morgan',    email:'michael@mail.com',    type:'Password Changed',       desc:'Password changed via email reset flow',             ip:'172.16.0.9',    device:'Desktop', parish:'Westmoreland',  date:'May 29, 2026 15:12' },
  { id:9,  name:'Fabian Thomas',     email:'fabian@mail.com',     type:'Login',                  desc:'Logged in from Firefox browser',                   ip:'192.168.4.21',  device:'Desktop', parish:'St. Elizabeth', date:'May 29, 2026 08:30' },
  { id:10, name:'Natalie Wright',    email:'natalie@mail.com',    type:'Listing Created',        desc:'Created listing: 2BR Apartment – Off Campus',      ip:'10.0.3.14',     device:'Mobile',  parish:'Portland',      date:'May 28, 2026 13:44' },
  { id:11, name:'Omar Abdullah',     email:'omar@mail.com',       type:'Subscription Activated', desc:'Activated Basic Plan (Bill Express) – 6 months',   ip:'192.168.5.66',  device:'Mobile',  parish:'St. Mary',      date:'May 28, 2026 12:01' },
  { id:12, name:'Priya Ramkissoon',  email:'priya@mail.com',      type:'Purchase',               desc:'Purchased: AirPods Pro from Marcus Williams',      ip:'172.16.1.3',    device:'Desktop', parish:'Trelawny',      date:'May 28, 2026 09:19' },
  { id:13, name:'Devon Rampersad',   email:'devon@mail.com',      type:'Referral Made',          desc:'Referred user: Kezia Phillip via referral link',   ip:'10.0.4.88',     device:'Mobile',  parish:'St. Thomas',    date:'May 27, 2026 17:33' },
  { id:14, name:'Kerri-Ann Joseph',  email:'kerri@mail.com',      type:'Listing Edited',         desc:'Updated price on listing: Evening Gown – St. Ann', ip:'192.168.6.12',  device:'Desktop', parish:'St. Ann',       date:'May 27, 2026 14:55' },
  { id:15, name:'Alicia Mohammed',   email:'alicia@mail.com',     type:'Account Suspended',      desc:'Account suspended: 3 fraud reports received',      ip:'10.0.5.77',     device:'Mobile',  parish:'Kingston',      date:'May 27, 2026 11:02' },
  { id:16, name:'Rajesh Persad',     email:'rajesh@mail.com',     type:'Listing Created',        desc:'Created listing: Honda Fit 2018 – St. Catherine',  ip:'172.16.2.55',   device:'Desktop', parish:'St. Catherine', date:'May 26, 2026 16:20' },
  { id:17, name:'Vikram Singh',      email:'vikram@mail.com',     type:'Profile Updated',        desc:'Updated contact number and location',               ip:'192.168.7.4',   device:'Mobile',  parish:'St. James',     date:'May 26, 2026 10:44' },
  { id:18, name:'Candice Fraser',    email:'candice@mail.com',    type:'Login',                  desc:'Logged in from Safari browser',                    ip:'10.0.6.33',     device:'Mobile',  parish:'Manchester',    date:'May 25, 2026 08:58' },
  { id:19, name:'Tony Alleyne',      email:'tony@mail.com',       type:'Password Changed',       desc:'Password changed via security settings',            ip:'172.16.3.11',   device:'Desktop', parish:'Clarendon',     date:'May 25, 2026 07:35' },
  { id:20, name:'Simone Baptiste',   email:'simone@mail.com',     type:'Subscription Activated', desc:'Activated Premium Plan (Fygaro) – 12 months',      ip:'192.168.8.90',  device:'Mobile',  parish:'St. Andrew',    date:'May 24, 2026 19:11' },
]

const typeBadge: Record<string, string> = {
  'Login': 'bg-blue-100 text-blue-700',
  'Listing Created': 'bg-green-100 text-green-700',
  'Listing Edited': 'bg-teal-100 text-teal-700',
  'Purchase': 'bg-orange-100 text-orange-700',
  'Subscription Activated': 'bg-primary/10 text-primary',
  'Referral Made': 'bg-purple-100 text-purple-700',
  'Profile Updated': 'bg-slate-100 text-slate-600',
  'Password Changed': 'bg-yellow-100 text-yellow-700',
  'Account Suspended': 'bg-red-100 text-red-700',
}

const activityTypes = ['All Types', 'Login', 'Listing Created', 'Listing Edited', 'Purchase', 'Subscription Activated', 'Referral Made', 'Profile Updated', 'Password Changed', 'Account Suspended']
const parishes = ['All Parishes', 'Kingston', 'St. Andrew', 'St. Catherine', 'St. James', 'Manchester', 'Clarendon', 'St. Ann', 'Westmoreland', 'St. Elizabeth', 'St. Mary', 'Trelawny', 'Portland', 'St. Thomas']

const PAGE_SIZE = 10

export default function UserActivityPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [parishFilter, setParishFilter] = useState('All Parishes')
  const [dateFilter, setDateFilter] = useState('All Time')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return logs.filter(l => {
      if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.email.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter !== 'All Types' && l.type !== typeFilter) return false
      if (parishFilter !== 'All Parishes' && l.parish !== parishFilter) return false
      return true
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, typeFilter, parishFilter, dateFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSelectChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Activity Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Track all user actions across the platform</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="input pl-9 w-72"
          />
        </div>
        <select value={typeFilter} onChange={handleSelectChange(setTypeFilter)} className="input">
          {activityTypes.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={parishFilter} onChange={handleSelectChange(setParishFilter)} className="input">
          {parishes.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={dateFilter} onChange={handleSelectChange(setDateFilter)} className="input">
          <option>All Time</option>
          <option>Today</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''} found</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">User</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Activity Type</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Description</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">IP Address</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Device</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Parish</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Date &amp; Time</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <InitAvatar name={log.name} />
                      <div>
                        <p className="font-medium text-slate-900">{log.name}</p>
                        <p className="text-xs text-slate-500">{log.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge[log.type] ?? 'bg-slate-100 text-slate-600'}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-[220px] truncate">{log.desc}</td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-xs">{log.ip}</td>
                  <td className="px-4 py-3 text-slate-600">{log.device}</td>
                  <td className="px-4 py-3 text-slate-600">{log.parish}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{log.date}</td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">No results found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${n === page ? 'bg-primary text-white border-primary' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
