'use client'

import { useState } from 'react'
import { Search, Eye, CheckCircle, XCircle, Trash2, Tag, MapPin } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'
import ConfirmDialog from '@/components/ConfirmDialog'

function InitAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-purple-500', 'bg-teal-500']
  const c = colors[name.charCodeAt(0) % colors.length]
  const dim = size === 'lg' ? 'w-12 h-12 text-base' : 'w-8 h-8 text-xs'
  return <div className={`${dim} rounded-full ${c} flex items-center justify-center text-white font-bold shrink-0`}>{initials}</div>
}

type Listing = {
  id: string
  title?: string
  name?: string
  category: string
  sub: string
  seller: string
  parish: string
  price: number
  status: string
  date: string
  desc: string
}

const listings: Listing[] = [
  { id: 'L001', title: 'Introduction to Python Programming',    category: 'Books',                 sub: 'Digital Textbooks',       seller: 'Marcus Williams',  parish: 'Kingston',     price: 2500, status: 'active',   date: 'May 28, 2026', desc: 'Comprehensive Python guide for beginners. PDF format, 380 pages.' },
  { id: 'L002', title: 'UWI Mona Tutoring Services',           category: 'E-Directory',            sub: 'Educational Assessments', seller: 'Nadine Campbell',  parish: 'St. Andrew',   price: 1500, status: 'active',   date: 'May 27, 2026', desc: 'One-on-one tutoring for CAPE and undergraduate students. All subjects.' },
  { id: 'L003', title: 'Kingston Tech Summit 2026',             category: 'Events',                 sub: 'Education Industry',      seller: 'Rohan Clarke',     parish: 'Kingston',     price: 3000, status: 'pending',  date: 'May 26, 2026', desc: 'Annual technology conference for students and professionals.' },
  { id: 'L004', title: 'Caribbean Scholarship Fund 2026',       category: 'Scholarships & Awards',  sub: 'Government Welfare',      seller: 'Simone Edwards',   parish: 'St. Catherine',price: 0,    status: 'active',   date: 'May 25, 2026', desc: 'Full scholarship covering tuition and living expenses for 2026/27.' },
  { id: 'L005', title: 'CAPE Biology Past Papers (2018-2024)', category: 'Books',                  sub: 'Past Papers',             seller: 'Andre Gordon',     parish: 'St. James',    price: 800,  status: 'active',   date: 'May 24, 2026', desc: 'Complete CAPE Biology past papers with mark schemes, 2018-2024.' },
  { id: 'L006', title: 'Jamaican Language Institute',           category: 'E-Directory',            sub: 'Education Industry',      seller: 'Tanya Harrison',   parish: 'Manchester',   price: 5000, status: 'active',   date: 'May 23, 2026', desc: 'Accredited language school offering CSEC and CAPE preparation.' },
  { id: 'L007', title: 'UWI Graduation Gala 2026',              category: 'Events',                 sub: 'Education Industry',      seller: 'Damion Jackson',   parish: 'St. Andrew',   price: 2500, status: 'pending',  date: 'May 22, 2026', desc: 'Annual graduation celebration with awards, dinner and networking.' },
  { id: 'L008', title: 'Rhodes Scholarship - Jamaica',          category: 'Scholarships & Awards',  sub: 'Government Welfare',      seller: 'Keisha Lawrence',  parish: 'Kingston',     price: 0,    status: 'active',   date: 'May 21, 2026', desc: 'Prestigious scholarship for exceptional academic and leadership achievement.' },
  { id: 'L009', title: 'Introduction to Data Science',          category: 'Books',                  sub: 'E-Books',                 seller: 'Michael Morgan',   parish: 'Clarendon',    price: 1800, status: 'active',   date: 'May 20, 2026', desc: 'Learn data science fundamentals with Python and real-world datasets.' },
  { id: 'L010', name: 'Dyslexia Support Network Jamaica',       category: 'E-Directory',            sub: 'Neurodivergent Support',  seller: 'Patricia Nelson',  parish: 'St. Catherine',price: 0,    status: 'rejected', date: 'May 19, 2026', desc: 'Support network listing was missing required contact information.' },
  { id: 'L011', title: 'STEM Olympiad Jamaica 2026',            category: 'Events',                 sub: 'Education Industry',      seller: 'Omar Powell',      parish: 'Kingston',     price: 0,    status: 'active',   date: 'May 18, 2026', desc: 'National STEM competition for secondary school students.' },
  { id: 'L012', title: 'HEART/NSTA Scholarship 2026',           category: 'Scholarships & Awards',  sub: 'Government Welfare',      seller: 'Sharon Reid',      parish: 'St. James',    price: 0,    status: 'active',   date: 'May 17, 2026', desc: 'Vocational training scholarship for HEART/NSTA programmes.' },
  { id: 'L013', title: 'O Level Mathematics Textbook',          category: 'Books',                  sub: 'Digital Textbooks',       seller: 'Clive Robinson',   parish: 'Westmoreland', price: 1200, status: 'expired',  date: 'May 10, 2026', desc: 'CXC Mathematics textbook covering all topics with practice questions.' },
  { id: 'L014', title: 'Caribbean Diet & Nutrition Clinic',     category: 'E-Directory',            sub: 'Dieticians',              seller: 'Beverley Scott',   parish: 'Clarendon',    price: 3500, status: 'pending',  date: 'May 16, 2026', desc: 'Registered dietician offering consultations for weight management.' },
  { id: 'L015', title: 'Annual Arts & Culture Festival',        category: 'Events',                 sub: 'Community Programmes',    seller: 'Fabian Thomas',    parish: 'Portland',     price: 500,  status: 'active',   date: 'May 15, 2026', desc: 'Celebrate Jamaican arts and culture with performances and exhibitions.' },
]

const TABS = ['All', 'Books', 'E-Directory', 'Events', 'Scholarships & Awards']

const PARISHES = ['All Parishes', 'Kingston', 'St. Andrew', 'St. Catherine', 'St. James', 'Manchester', 'Clarendon', 'Westmoreland', 'Portland']

type ConfirmAction = { type: string; listing: Listing }

export default function ListingsPage() {
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [parishFilter, setParishFilter] = useState('All Parishes')
  const [statusFilter, setStatusFilter] = useState('All')
  const [viewListing, setViewListing] = useState<Listing | null>(null)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  const filtered = listings.filter(l => {
    const displayTitle = (l.title ?? l.name ?? '') as string
    if (tab !== 'All' && l.category !== tab) return false
    const q = search.toLowerCase()
    if (q && !displayTitle.toLowerCase().includes(q) && !l.seller.toLowerCase().includes(q)) return false
    if (parishFilter !== 'All Parishes' && l.parish !== parishFilter) return false
    if (statusFilter !== 'All' && l.status !== statusFilter) return false
    return true
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">All Listings</h1>
        <p className="text-text-secondary text-sm mt-1">Browse and manage all marketplace listings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === t ? 'bg-primary text-white' : 'bg-slate-100 text-text-secondary hover:bg-slate-200'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Search listings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none" value={tab} onChange={e => setTab(e.target.value)}>
              {TABS.map(t => <option key={t}>{t}</option>)}
            </select>
            <select className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none" value={parishFilter} onChange={e => setParishFilter(e.target.value)}>
              {PARISHES.map(p => <option key={p}>{p}</option>)}
            </select>
            <select className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {['All', 'Active', 'Pending', 'Rejected', 'Expired'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Listing</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Seller</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Parish</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Price</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Status</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Date</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => {
              const displayTitle = (l.title ?? l.name ?? '') as string
              return (
                <tr key={l.id} className="border-b border-border last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                        <Tag size={16} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary line-clamp-1">{displayTitle}</p>
                        <p className="text-xs text-text-secondary">{l.category} · {l.sub}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-text-secondary">{l.seller}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 text-text-secondary">
                      <MapPin size={12} />
                      {l.parish}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium text-text-primary">{l.price === 0 ? 'Free' : `J$${l.price.toLocaleString()}`}</td>
                  <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-5 py-3 text-text-secondary">{l.date}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewListing(l)} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors" title="View">
                        <Eye size={15} />
                      </button>
                      {(l.status === 'pending' || l.status === 'rejected') && (
                        <button onClick={() => setConfirmAction({ type: 'approve', listing: l })} className="p-1.5 rounded-md hover:bg-green-50 text-success transition-colors" title="Approve">
                          <CheckCircle size={15} />
                        </button>
                      )}
                      {(l.status === 'active' || l.status === 'pending') && (
                        <button onClick={() => setConfirmAction({ type: 'reject', listing: l })} className="p-1.5 rounded-md hover:bg-red-50 text-danger transition-colors" title="Reject">
                          <XCircle size={15} />
                        </button>
                      )}
                      <button onClick={() => setConfirmAction({ type: 'delete', listing: l })} className="p-1.5 rounded-md hover:bg-red-50 text-danger transition-colors" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Slide-over Drawer */}
      {viewListing && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setViewListing(null)} />
          <div className="fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col">
            <div className="bg-gradient-to-r from-[#0F4C81] to-[#1a6ab8] p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs opacity-75 mb-1">{viewListing.id}</p>
                  <h2 className="font-bold text-base leading-tight">{(viewListing.title ?? viewListing.name ?? '') as string}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{viewListing.category}</span>
                    <StatusBadge status={viewListing.status} />
                  </div>
                </div>
                <button onClick={() => setViewListing(null)} className="p-1.5 rounded-md hover:bg-white/20 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div>
                <h3 className="font-semibold text-text-primary mb-3">Listing Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-text-secondary">Price</span><span className="font-medium">{viewListing.price === 0 ? 'Free' : `J$${viewListing.price.toLocaleString()}`}</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Parish</span><span className="font-medium">{viewListing.parish}</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Category</span><span className="font-medium">{viewListing.category}</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Subcategory</span><span className="font-medium">{viewListing.sub}</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Date Created</span><span className="font-medium">{viewListing.date}</span></div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-3">Seller Info</h3>
                <div className="flex items-center gap-3">
                  <InitAvatar name={viewListing.seller} size="lg" />
                  <div>
                    <p className="font-medium text-text-primary">{viewListing.seller}</p>
                    <p className="text-xs text-text-secondary">{viewListing.seller.toLowerCase().replace(' ', '.')}@email.com</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Description</h3>
                <p className="text-sm text-text-secondary bg-slate-50 rounded-lg p-3">{viewListing.desc}</p>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-3">Status History</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Created', sub: viewListing.date, done: true },
                    { label: 'Under Review', sub: 'Admin review', done: viewListing.status !== 'pending' },
                    { label: viewListing.status === 'rejected' ? 'Rejected' : 'Approved', sub: viewListing.status === 'rejected' ? 'Listing was rejected' : 'Listing is live', done: viewListing.status === 'active' || viewListing.status === 'rejected' || viewListing.status === 'expired' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.done ? 'bg-success' : 'bg-slate-200'}`}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{step.label}</p>
                        <p className="text-xs text-text-secondary">{step.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Admin Notes</label>
                <textarea rows={3} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Add investigation notes..." value={adminNotes} onChange={e => setAdminNotes(e.target.value)} />
              </div>
            </div>
            <div className="p-5 border-t border-border flex gap-3">
              {viewListing.status === 'pending' && (
                <button onClick={() => { setConfirmAction({ type: 'approve', listing: viewListing }); setViewListing(null) }} className="flex-1 bg-success text-white rounded-lg py-2.5 text-sm font-medium hover:bg-green-600 transition-colors">
                  Approve
                </button>
              )}
              {(viewListing.status === 'active' || viewListing.status === 'pending') && (
                <button onClick={() => { setConfirmAction({ type: 'reject', listing: viewListing }); setViewListing(null) }} className="flex-1 bg-danger text-white rounded-lg py-2.5 text-sm font-medium hover:bg-red-600 transition-colors">
                  Reject
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => setConfirmAction(null)}
        title={confirmAction?.type === 'approve' ? 'Approve Listing' : confirmAction?.type === 'reject' ? 'Reject Listing' : 'Delete Listing'}
        message={`Are you sure you want to ${confirmAction?.type} "${(confirmAction?.listing.title ?? confirmAction?.listing.name ?? '') as string}"?`}
        confirmLabel={confirmAction?.type === 'approve' ? 'Approve' : confirmAction?.type === 'reject' ? 'Reject' : 'Delete'}
        danger={confirmAction?.type !== 'approve'}
      />
    </div>
  )
}
