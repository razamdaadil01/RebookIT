'use client'

import { Users, Tag, DollarSign, AlertTriangle, Star } from 'lucide-react'
import StatCard from '@/components/StatCard'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

const revenueData = [
  { month: 'Dec', revenue: 42000 },
  { month: 'Jan', revenue: 58000 },
  { month: 'Feb', revenue: 51000 },
  { month: 'Mar', revenue: 67000 },
  { month: 'Apr', revenue: 74000 },
  { month: 'May', revenue: 89000 },
]

const categoryData = [
  { name: 'Electronics', listings: 847 },
  { name: 'Vehicles', listings: 523 },
  { name: 'Fashion', listings: 634 },
  { name: 'Furniture', listings: 412 },
  { name: 'Real Estate', listings: 89 },
  { name: 'Services', listings: 156 },
  { name: 'Books', listings: 201 },
  { name: 'Sports', listings: 178 },
]

const recentActivity = [
  { id: 1, type: 'user', text: 'New user registered: Priya Ramkissoon', time: '2 min ago', color: 'bg-blue-500' },
  { id: 2, type: 'listing', text: 'New listing posted: iPhone 14 Pro (Marcus Williams)', time: '5 min ago', color: 'bg-green-500' },
  { id: 3, type: 'dispute', text: 'Dispute filed: Item not as described — #DIS-1047', time: '12 min ago', color: 'bg-red-500' },
  { id: 4, type: 'payment', text: 'Transaction completed: TTD $3,200 — Kerri-Ann Joseph', time: '18 min ago', color: 'bg-purple-500' },
  { id: 5, type: 'listing', text: 'Listing flagged: Suspicious pricing — 2020 Corolla', time: '25 min ago', color: 'bg-orange-500' },
  { id: 6, type: 'user', text: 'KYC verified: Devon Rampersad', time: '34 min ago', color: 'bg-teal-500' },
  { id: 7, type: 'payment', text: 'Payout processed: TTD $1,800 — Tony Alleyne', time: '45 min ago', color: 'bg-indigo-500' },
  { id: 8, type: 'listing', text: 'Listing approved: Samsung 65" 4K TV', time: '1 hr ago', color: 'bg-green-500' },
  { id: 9, type: 'user', text: 'User suspended: Spam listings — Anonymous_994', time: '1.5 hr ago', color: 'bg-red-500' },
  { id: 10, type: 'report', text: 'New report submitted: Fraud — Listing #4421', time: '2 hr ago', color: 'bg-yellow-500' },
]

const topSellers = [
  { name: 'Marcus Williams', listings: 47, sales: 38, rating: 4.9, revenue: 'TTD $24,500' },
  { name: 'Kerri-Ann Joseph', listings: 31, sales: 29, rating: 4.8, revenue: 'TTD $18,300' },
  { name: 'Alicia Mohammed', listings: 28, sales: 25, rating: 4.7, revenue: 'TTD $15,800' },
  { name: 'Rajesh Persad', listings: 22, sales: 21, rating: 4.9, revenue: 'TTD $12,400' },
  { name: 'Tricia Clarke', listings: 19, sales: 17, rating: 4.6, revenue: 'TTD $9,700' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Welcome back, Super Admin. Here&apos;s what&apos;s happening on Rebook It.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value="12,847"
          change="+8.2% from last month"
          changeType="up"
          icon={<Users size={22} className="text-primary" />}
          color="bg-primary/10"
        />
        <StatCard
          title="Active Listings"
          value="3,421"
          change="+12.5% from last month"
          changeType="up"
          icon={<Tag size={22} className="text-purple-600" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Revenue (This Month)"
          value="TTD $89K"
          change="+20.3% from last month"
          changeType="up"
          icon={<DollarSign size={22} className="text-accent" />}
          color="bg-orange-100"
        />
        <StatCard
          title="Pending Disputes"
          value="23"
          change="+3 since yesterday"
          changeType="down"
          icon={<AlertTriangle size={22} className="text-danger" />}
          color="bg-red-100"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-text-primary">Revenue Overview</h2>
              <p className="text-xs text-text-secondary mt-0.5">Last 6 months (TTD)</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">↑ 20.3% vs last period</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => [`TTD $${Number(v).toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#0F4C81" strokeWidth={2.5} dot={{ fill: '#0F4C81', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Bar */}
        <div className="card">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-text-primary">Listings by Category</h2>
            <p className="text-xs text-text-secondary mt-0.5">Current active listings</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Bar dataKey="listings" fill="#F97316" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="card xl:col-span-2">
          <h2 className="text-base font-semibold text-text-primary mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start gap-3">
                <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${activity.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary leading-snug">{activity.text}</p>
                </div>
                <span className="text-xs text-text-secondary whitespace-nowrap shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sellers */}
        <div className="card">
          <h2 className="text-base font-semibold text-text-primary mb-4">Top Sellers</h2>
          <div className="space-y-3">
            {topSellers.map((seller, i) => (
              <div key={seller.name} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{seller.name}</p>
                  <p className="text-xs text-text-secondary">{seller.listings} listings · {seller.sales} sold</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-0.5 justify-end">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium text-text-secondary">{seller.rating}</span>
                  </div>
                  <p className="text-xs text-text-secondary">{seller.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
