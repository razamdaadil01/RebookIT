'use client'

import { useState } from 'react'
import { Download, Calendar } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const registrations = [
  { date: 'May 22', users: 34 }, { date: 'May 23', users: 28 }, { date: 'May 24', users: 42 },
  { date: 'May 25', users: 56 }, { date: 'May 26', users: 38 }, { date: 'May 27', users: 61 }, { date: 'May 28', users: 47 },
]

const listingsPosted = [
  { date: 'May 22', listings: 89 }, { date: 'May 23', listings: 67 }, { date: 'May 24', listings: 112 },
  { date: 'May 25', listings: 98 }, { date: 'May 26', listings: 134 }, { date: 'May 27', listings: 156 }, { date: 'May 28', listings: 103 },
]

const revenueData = [
  { month: 'Dec', revenue: 42000 }, { month: 'Jan', revenue: 58000 }, { month: 'Feb', revenue: 51000 },
  { month: 'Mar', revenue: 67000 }, { month: 'Apr', revenue: 74000 }, { month: 'May', revenue: 89000 },
]

const categoryDist = [
  { name: 'Electronics', value: 1248, color: '#0F4C81' },
  { name: 'Vehicles', value: 523, color: '#F97316' },
  { name: 'Fashion', value: 634, color: '#8B5CF6' },
  { name: 'Furniture', value: 412, color: '#22C55E' },
  { name: 'Real Estate', value: 89, color: '#F59E0B' },
  { name: 'Other', value: 535, color: '#94A3B8' },
]

const citiesData = [
  { city: 'Port of Spain', activity: 1247 },
  { city: 'San Fernando', activity: 834 },
  { city: 'Chaguanas', activity: 612 },
  { city: 'Arima', activity: 423 },
  { city: 'Tobago', activity: 298 },
  { city: 'Point Fortin', activity: 187 },
]

const metricsTable = [
  { category: 'Electronics', listings: 1248, activeUsers: 3421, avgTransaction: 'TTD $3,240' },
  { category: 'Vehicles', listings: 523, activeUsers: 1204, avgTransaction: 'TTD $58,400' },
  { category: 'Fashion', listings: 634, activeUsers: 2103, avgTransaction: 'TTD $480' },
  { category: 'Furniture', listings: 412, activeUsers: 876, avgTransaction: 'TTD $2,100' },
  { category: 'Real Estate', listings: 89, activeUsers: 234, avgTransaction: 'TTD $4,800' },
  { category: 'Services', listings: 156, activeUsers: 567, avgTransaction: 'TTD $200' },
]

const DATE_RANGES = ['Today', '7 Days', '30 Days', 'Custom']

export default function AnalyticsPage() {
  const [range, setRange] = useState('7 Days')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analytics & Reports</h1>
          <p className="text-text-secondary text-sm mt-1">Platform performance insights and trends.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-border rounded-lg overflow-hidden">
            {DATE_RANGES.map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${range === r ? 'bg-primary text-white' : 'text-text-secondary hover:bg-slate-50'}`}>
                {r === 'Custom' ? <><Calendar size={12} className="inline mr-1" />Custom</> : r}
              </button>
            ))}
          </div>
          <button className="btn-secondary text-xs py-2"><Download size={14} />Export</button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-sm font-semibold text-text-primary mb-4">New User Registrations</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={registrations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Line type="monotone" dataKey="users" stroke="#0F4C81" strokeWidth={2.5} dot={{ fill: '#0F4C81', r: 3 }} name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Listings Posted Over Time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={listingsPosted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Bar dataKey="listings" fill="#F97316" radius={[4, 4, 0, 0]} name="Listings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Revenue Over Time (TTD)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0F4C81" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => [`TTD $${Number(v).toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#0F4C81" strokeWidth={2.5} fill="url(#revenueGrad)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Category Distribution</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={categoryDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {categoryDist.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [Number(v).toLocaleString(), 'Listings']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryDist.map(cat => (
                <div key={cat.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-text-secondary flex-1 truncate">{cat.name}</span>
                  <span className="text-xs font-medium text-text-primary">{cat.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Cities */}
      <div className="card">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Top Cities by Activity</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={citiesData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis dataKey="city" type="category" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={100} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
            <Bar dataKey="activity" fill="#0F4C81" radius={[0, 4, 4, 0]} name="Activity Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">Category Performance Metrics</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50">
              {['Category', 'Total Listings', 'Active Users', 'Avg Transaction Value'].map(h => (
                <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metricsTable.map(row => (
              <tr key={row.category} className="border-b border-border last:border-0 hover:bg-slate-50">
                <td className="py-3 px-5 font-medium text-text-primary">{row.category}</td>
                <td className="py-3 px-5 text-text-primary">{row.listings.toLocaleString()}</td>
                <td className="py-3 px-5 text-text-primary">{row.activeUsers.toLocaleString()}</td>
                <td className="py-3 px-5 font-semibold text-accent">{row.avgTransaction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
