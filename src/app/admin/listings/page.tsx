'use client'

import { useState } from 'react'
import StatusBadge from '@/components/StatusBadge'
import Modal from '@/components/Modal'
import DataTable from '@/components/DataTable'
import { Eye, CheckCircle, XCircle, Flag, Search } from 'lucide-react'

type Listing = {
  id: string
  title: string
  category: string
  seller: string
  price: string
  posted: string
  status: string
  description: string
}

const LISTINGS: Listing[] = [
  { id: 'L001', title: 'iPhone 14 Pro 256GB Space Black',      category: 'Electronics',  seller: 'Marcus Williams',  price: 'J$3,500',  posted: 'Jun 1, 2024',  status: 'active',  description: 'Like new iPhone 14 Pro. No scratches, comes with original box and charger.' },
  { id: 'L002', title: '2020 Toyota Corolla LE',               category: 'Vehicles',     seller: 'Kerri-Ann Joseph', price: 'J$78,000', posted: 'Jun 2, 2024',  status: 'active',  description: 'Low mileage 2020 Corolla, all serviced, no accidents.' },
  { id: 'L003', title: 'L-Shaped Sectional Sofa — Grey',       category: 'Furniture',    seller: 'Alicia Mohammed',  price: 'J$4,200',  posted: 'Jun 3, 2024',  status: 'pending', description: 'Barely used L-shaped sofa. Moving sale, must go this week.' },
  { id: 'L004', title: 'Air Jordan 1 Retro High OG — Size 10', category: 'Fashion',      seller: 'Rajesh Persad',    price: 'J$1,800',  posted: 'Jun 4, 2024',  status: 'active',  description: 'DS (deadstock) AJ1 in original box. Never worn.' },
  { id: 'L005', title: '2BR Furnished Apartment — Westmoorings',category: 'Real Estate',  seller: 'Tricia Clarke',    price: 'J$4,500/mo', posted: 'Jun 5, 2024', status: 'active',  description: 'Modern 2-bed apartment, gated community, pool access.' },
  { id: 'L006', title: 'Samsung 65" 4K QLED Smart TV',         category: 'Electronics',  seller: 'Devon Rampersad',  price: 'J$5,800',  posted: 'Jun 6, 2024',  status: 'pending', description: 'Samsung Q80B, 1 year old, perfect working condition.' },
  { id: 'L007', title: 'Honda Civic 2019 EX',                  category: 'Vehicles',     seller: 'Anil Kumar',       price: 'J$65,000', posted: 'Jun 7, 2024',  status: 'active',  description: 'Honda Civic EX 2019, sunroof, leather seats, 42k miles.' },
  { id: 'L008', title: 'Dining Table Set — 6 Seater',          category: 'Furniture',    seller: 'Christopher Paul', price: 'J$3,100',  posted: 'Jun 8, 2024',  status: 'flagged', description: 'Solid wood dining set, 6 chairs included. Minor scratches.' },
  { id: 'L009', title: 'Evening Gown — Vera Wang Style',       category: 'Fashion',      seller: 'Simone Baptiste',  price: 'J$950',    posted: 'Jun 9, 2024',  status: 'flagged', description: 'Beautiful evening gown, worn once. Size 8.' },
  { id: 'L010', title: 'MacBook Air M2 2022 — 256GB',          category: 'Electronics',  seller: 'Omar Abdullah',    price: 'J$7,200',  posted: 'Jun 10, 2024', status: 'active',  description: 'M2 MacBook Air, midnight color, excellent battery life.' },
  { id: 'L011', title: 'Nissan Almera 2018',                   category: 'Vehicles',     seller: 'Priya Ramkissoon', price: 'J$48,000', posted: 'Jun 11, 2024', status: 'active',  description: 'Reliable Nissan Almera, fully serviced, new tires.' },
  { id: 'L012', title: 'King Bed Frame — Walnut Wood',         category: 'Furniture',    seller: 'Natasha Beckles',  price: 'J$2,400',  posted: 'Jun 12, 2024', status: 'pending', description: 'King size walnut bed frame, no mattress. Assembled once.' },
  { id: 'L013', title: 'Nike Air Max 270 — Size 9',            category: 'Fashion',      seller: 'James Crichlow',   price: 'J$680',    posted: 'Jun 13, 2024', status: 'rejected',description: 'Listed as original Nike but confirmed replica upon review.' },
  { id: 'L014', title: 'Office Space — Port of Spain CBD',     category: 'Real Estate',  seller: 'Vikram Singh',     price: 'J$8,000/mo', posted: 'Jun 14, 2024', status: 'active', description: '1,200 sqft commercial space, 4th floor, great views.' },
  { id: 'L015', title: 'Canon EOS R50 Camera Kit',             category: 'Electronics',  seller: 'Kezia Phillip',    price: 'J$4,900',  posted: 'Jun 15, 2024', status: 'active',  description: 'Canon R50 with 18-45mm lens, 2 batteries, SD card.' },
  { id: 'L016', title: 'PlayStation 5 — Disc Edition',         category: 'Electronics',  seller: 'David Ramoutar',   price: 'J$3,200',  posted: 'Jun 16, 2024', status: 'pending', description: 'PS5 disc edition with 2 controllers, 5 games.' },
  { id: 'L017', title: '2021 Suzuki Swift Sport',              category: 'Vehicles',     seller: 'Candice Fraser',   price: 'J$72,000', posted: 'Jun 17, 2024', status: 'expired', description: 'Swift Sport, sport exhaust, 28k km. Originally listed May 2024.' },
  { id: 'L018', title: 'Antique Dresser with Mirror',          category: 'Furniture',    seller: 'Sandra Hernandez', price: 'J$1,800',  posted: 'Jun 18, 2024', status: 'active',  description: 'Victorian style dresser with tall mirror, solid mahogany.' },
  { id: 'L019', title: "Levi's 501 Jeans — 32x32",            category: 'Fashion',      seller: 'Michelle Narine',  price: 'J$320',    posted: 'Jun 19, 2024', status: 'active',  description: 'Classic Levi 501, worn twice, washed gently.' },
  { id: 'L020', title: 'House for Sale — Arima',               category: 'Real Estate',  seller: 'Tony Alleyne',     price: 'J$1.2M',   posted: 'Jun 20, 2024', status: 'flagged', description: 'Suspected fraudulent listing — no verification documents provided.' },
]

const TABS = ['All', 'Pending', 'Active', 'Flagged', 'Rejected', 'Expired']

export default function ListingsPage() {
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Listing | null>(null)

  const filtered = LISTINGS.filter(l => {
    const matchTab = tab === 'All' || l.status === tab.toLowerCase()
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.seller.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const columns = [
    {
      header: 'Listing',
      accessor: (l: Listing) => (
        <div>
          <p className="font-medium text-text-primary text-sm">{l.title}</p>
          <p className="text-xs text-text-secondary">{l.id}</p>
        </div>
      ),
    },
    { header: 'Category', accessor: (l: Listing) => <span className="text-sm text-text-secondary">{l.category}</span> },
    { header: 'Seller', accessor: (l: Listing) => <span className="text-sm text-text-primary">{l.seller}</span> },
    { header: 'Price', accessor: (l: Listing) => <span className="font-semibold text-text-primary text-sm">{l.price}</span> },
    { header: 'Posted', accessor: 'posted' as keyof Listing },
    { header: 'Status', accessor: (l: Listing) => <StatusBadge status={l.status} /> },
    {
      header: 'Actions',
      accessor: (l: Listing) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setSelected(l)} className="p-1.5 rounded-md text-primary hover:bg-primary/10 transition-colors"><Eye size={15} /></button>
          <button className="p-1.5 rounded-md text-success hover:bg-success/10 transition-colors"><CheckCircle size={15} /></button>
          <button className="p-1.5 rounded-md text-danger hover:bg-danger/10 transition-colors"><XCircle size={15} /></button>
          <button className="p-1.5 rounded-md text-warning hover:bg-warning/10 transition-colors"><Flag size={15} /></button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Listing Management</h1>
        <p className="text-sm text-text-secondary mt-1">Review, approve, and manage all marketplace listings</p>
      </div>

      {/* Search + Tabs row */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg flex-wrap justify-end">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
              {t} {t !== 'All' && <span className="ml-1 text-xs opacity-70">({LISTINGS.filter(l => l.status === t.toLowerCase()).length})</span>}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={filtered} />

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Listing Details" width="max-w-lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-text-primary">{selected.title}</h3>
                <p className="text-sm text-text-secondary mt-0.5">{selected.id} · {selected.category}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-text-secondary leading-relaxed">{selected.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['Seller', selected.seller], ['Price', selected.price], ['Posted', selected.posted], ['Status', selected.status]].map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-text-secondary">{k}</p>
                  <p className="text-sm font-medium text-text-primary capitalize">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2 rounded-lg bg-success/10 text-success text-sm font-medium hover:bg-success/20">Approve</button>
              <button className="flex-1 py-2 rounded-lg bg-danger/10 text-danger text-sm font-medium hover:bg-danger/20">Reject</button>
              <button className="flex-1 py-2 rounded-lg bg-warning/10 text-warning text-sm font-medium hover:bg-warning/20">Flag</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
