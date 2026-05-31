'use client'

import Link from 'next/link'
import { Users, Tag, DollarSign, PackageCheck, Zap, Star, ArrowUpRight, UserPlus, Settings, FileUp, PlusCircle, Wallet, Receipt, Clock } from 'lucide-react'
import StatCard from '@/components/StatCard'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

// ─── Data ─────────────────────────────────────────────────────────────────────

const revenueData = [
  { month: 'Dec', revenue: 420000 },
  { month: 'Jan', revenue: 580000 },
  { month: 'Feb', revenue: 510000 },
  { month: 'Mar', revenue: 670000 },
  { month: 'Apr', revenue: 740000 },
  { month: 'May', revenue: 890000 },
]

const parishData = [
  { parish: 'Kingston',      users: 312 },
  { parish: 'St. Andrew',    users: 287 },
  { parish: 'St. Catherine', users: 241 },
  { parish: 'St. James',     users: 198 },
  { parish: 'Manchester',    users: 164 },
  { parish: 'Clarendon',     users: 143 },
  { parish: 'St. Ann',       users: 118 },
  { parish: 'Westmoreland',  users: 97  },
  { parish: 'St. Elizabeth', users: 84  },
  { parish: 'St. Mary',      users: 72  },
  { parish: 'Trelawny',      users: 61  },
  { parish: 'Portland',      users: 54  },
  { parish: 'St. Thomas',    users: 47  },
]

const recentActivity = [
  { id: 1, icon: UserPlus,   text: 'User registered via referral',     sub: "Khalil Brown joined via Tricia Clarke's link",  time: '2 min ago',  color: 'text-primary', bg: 'bg-primary/10'  },
  { id: 2, icon: Settings,   text: 'Manual activation done by Admin',  sub: 'Subscription activated for Omar Abdullah',      time: '15 min ago', color: 'text-success', bg: 'bg-green-100'   },
  { id: 3, icon: FileUp,     text: 'Bill Express CSV uploaded',        sub: '48 records processed, 2 exceptions flagged',    time: '1 hr ago',   color: 'text-warning', bg: 'bg-yellow-100'  },
  { id: 4, icon: PlusCircle, text: 'New listing created',              sub: 'MacBook Air M2 posted by Marcus Williams',      time: '2 hrs ago',  color: 'text-accent',  bg: 'bg-orange-100'  },
]

const pendingActions = [
  { label: 'Withdrawal requests pending',  count: 5, href: '/admin/referrals/withdrawals',        icon: Wallet,  color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Manual activations pending',   count: 3, href: '/admin/payments/manual-activation',   icon: Zap,     color: 'text-primary',    bg: 'bg-primary/10' },
  { label: 'Bill Express exceptions',       count: 2, href: '/admin/payments/bill-express',        icon: Receipt, color: 'text-warning',    bg: 'bg-yellow-100' },
  { label: 'Listings pending approval',     count: 4, href: '/admin/listings/pending',             icon: Clock,   color: 'text-accent',     bg: 'bg-orange-100' },
]

const topSellers = [
  { name: 'Marcus Williams',  listings: 47, sales: 38, rating: 4.9, revenue: 'J$124,500' },
  { name: 'Kerri-Ann Joseph', listings: 31, sales: 29, rating: 4.8, revenue: 'J$98,300'  },
  { name: 'Alicia Mohammed',  listings: 28, sales: 25, rating: 4.7, revenue: 'J$75,800'  },
  { name: 'Rajesh Persad',    listings: 22, sales: 21, rating: 4.9, revenue: 'J$62,400'  },
  { name: 'Tricia Clarke',    listings: 19, sales: 17, rating: 4.6, revenue: 'J$49,700'  },
]

const PARISH_COLORS = [
  '#0F4C81','#1a6bbf','#2680d9','#3d8fe0','#5aa0e6',
  '#77b2ec','#94c4f2','#b1d6f8','#cce5ff','#d9edff',
  '#e6f4ff','#f0f8ff','#f8fbff',
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Good morning, Admin 👋</h1>
        <p className="text-text-secondary text-sm mt-1">Here&apos;s what&apos;s happening on Rebook It today.</p>
      </div>

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Users"
          value="12,847"
          change="+8.2% from last month"
          changeType="up"
          icon={<Users size={20} className="text-primary" />}
          color="bg-primary/10"
        />
        <StatCard
          title="Active Listings"
          value="3,421"
          change="+12.5% from last month"
          changeType="up"
          icon={<Tag size={20} className="text-purple-600" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Revenue This Month"
          value="J$890K"
          change="+20.3% from last month"
          changeType="up"
          icon={<DollarSign size={20} className="text-accent" />}
          color="bg-orange-100"
        />
        <StatCard
          title="Active Subscriptions"
          value="1,204"
          change="+5.1% from last month"
          changeType="up"
          icon={<PackageCheck size={20} className="text-teal-600" />}
          color="bg-teal-100"
        />
        <StatCard
          title="Pending Actions"
          value="14"
          change="5 withdrawals + 3 activations + more"
          changeType="down"
          icon={<Zap size={20} className="text-danger" />}
          color="bg-red-100"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Revenue line chart */}
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-text-primary">Revenue Overview</h2>
              <p className="text-xs text-text-secondary mt-0.5">Last 6 months (J$)</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">↑ 20.3% vs last period</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `J$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => [`J$${Number(v).toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#0F4C81" strokeWidth={2.5} dot={{ fill: '#0F4C81', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* New Users by Parish */}
        <div className="card">
          <div className="mb-3">
            <h2 className="text-base font-semibold text-text-primary">New Users This Month</h2>
            <p className="text-xs text-text-secondary mt-0.5">By parish — Jamaica</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={parishData} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="parish" type="category" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} width={86} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Bar dataKey="users" radius={[0, 4, 4, 0]}>
                {parishData.map((_, i) => (
                  <Cell key={i} fill={PARISH_COLORS[i] ?? '#0F4C81'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Recent Activity + Pending Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Recent Activity Feed */}
        <div className="card">
          <h2 className="text-base font-semibold text-text-primary mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map(({ id, icon: Icon, text, sub, time, color, bg }) => (
              <div key={id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={15} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary leading-snug">{text}</p>
                  <p className="text-xs text-text-secondary mt-0.5 truncate">{sub}</p>
                </div>
                <span className="text-xs text-text-secondary whitespace-nowrap shrink-0 pt-0.5">{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text-primary">Pending Actions</h2>
            <span className="text-xs bg-danger/10 text-danger font-semibold px-2.5 py-1 rounded-full">14 total</span>
          </div>
          <div className="space-y-3">
            {pendingActions.map(({ label, count, href, icon: Icon, color, bg }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-slate-50 transition-all group"
              >
                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={17} className={color} />
                </div>
                <p className="flex-1 text-sm font-medium text-text-primary">{label}</p>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-sm font-bold ${color}`}>{count}</span>
                  <ArrowUpRight size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Top Sellers */}
      <div className="card">
        <h2 className="text-base font-semibold text-text-primary mb-4">Top Sellers This Month</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['#', 'Seller', 'Listings', 'Sales', 'Rating', 'Revenue'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topSellers.map((s, i) => (
                <tr key={s.name} className="border-b border-border last:border-0 hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-text-primary">{s.name}</td>
                  <td className="py-3 px-3 text-text-secondary">{s.listings}</td>
                  <td className="py-3 px-3 text-text-secondary">{s.sales}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-medium text-text-secondary">{s.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-text-primary">{s.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
