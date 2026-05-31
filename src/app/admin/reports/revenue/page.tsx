'use client'

import { useState } from 'react'
import { DollarSign, CreditCard, FileText, TrendingUp, Download } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import StatCard from '@/components/StatCard'

const DATE_TABS = ['This Month', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'Custom Range']

const revenueOverTime = [
  { month: 'Dec', fygaro: 98000,  billExpress: 42000 },
  { month: 'Jan', fygaro: 121000, billExpress: 51000 },
  { month: 'Feb', fygaro: 109000, billExpress: 48000 },
  { month: 'Mar', fygaro: 143000, billExpress: 58000 },
  { month: 'Apr', fygaro: 161000, billExpress: 67000 },
  { month: 'May', fygaro: 198200, billExpress: 86300 },
]

const revenueByPlan = [
  { name: 'Basic',   value: 35, amount: 99575  },
  { name: 'Pro',     value: 42, amount: 119490 },
  { name: 'Premium', value: 23, amount: 65435  },
]
const PIE_COLORS = ['#0F4C81', '#F97316', '#22C55E']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function planLabel(entry: any) { return `${entry.name} ${entry.value}%` }

const monthlyBreakdown = [
  { period: 'Dec 2025', fygaro: 98000,  billExpress: 42000, manual: 2800, total: 142800, subs: 892,  mom: null     },
  { period: 'Jan 2026', fygaro: 121000, billExpress: 51000, manual: 3200, total: 175200, subs: 1042, mom: '+22.7%' },
  { period: 'Feb 2026', fygaro: 109000, billExpress: 48000, manual: 2400, total: 159400, subs: 978,  mom: '-9.0%'  },
  { period: 'Mar 2026', fygaro: 143000, billExpress: 58000, manual: 3600, total: 204600, subs: 1148, mom: '+28.4%' },
  { period: 'Apr 2026', fygaro: 161000, billExpress: 67000, manual: 4100, total: 232100, subs: 1182, mom: '+13.4%' },
  { period: 'May 2026', fygaro: 198200, billExpress: 86300, manual: 0,    total: 284500, subs: 1204, mom: '+22.6%' },
]

const parishRevenue = [
  { parish: 'Kingston',      users: 312, subs: 248, revenue: 74400, pct: 26.1 },
  { parish: 'St. Andrew',    users: 287, subs: 221, revenue: 66300, pct: 23.3 },
  { parish: 'St. Catherine', users: 241, subs: 178, revenue: 53400, pct: 18.8 },
  { parish: 'St. James',     users: 198, subs: 142, revenue: 42600, pct: 15.0 },
  { parish: 'Manchester',    users: 164, subs: 112, revenue: 33600, pct: 11.8 },
  { parish: 'Clarendon',     users: 143, subs: 94,  revenue: 28200, pct: 9.9  },
  { parish: 'St. Ann',       users: 118, subs: 74,  revenue: 22200, pct: 7.8  },
  { parish: 'Westmoreland',  users: 97,  subs: 58,  revenue: 17400, pct: 6.1  },
  { parish: 'St. Elizabeth', users: 84,  subs: 48,  revenue: 14400, pct: 5.1  },
  { parish: 'St. Mary',      users: 72,  subs: 41,  revenue: 12300, pct: 4.3  },
  { parish: 'Trelawny',      users: 61,  subs: 34,  revenue: 10200, pct: 3.6  },
  { parish: 'Portland',      users: 54,  subs: 28,  revenue: 8400,  pct: 3.0  },
  { parish: 'St. Thomas',    users: 47,  subs: 22,  revenue: 6600,  pct: 2.3  },
  { parish: 'Hanover',       users: 38,  subs: 18,  revenue: 5400,  pct: 1.9  },
]

function fmt(v: number) {
  return `J$${v.toLocaleString()}`
}

export default function RevenueReportsPage() {
  const [activeTab, setActiveTab] = useState('Last 6 Months')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Revenue Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Track platform revenue across payment gateways</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">
            <Download size={15} /> Export CSV
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Download size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* Date Range Tabs */}
      <div className="flex flex-wrap gap-2">
        {DATE_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Revenue"         value="J$284,500" change="+12.4% from last month" changeType="up"   icon={<DollarSign size={20} className="text-green-600" />}   color="bg-green-100"  />
        <StatCard title="Fygaro Revenue"        value="J$198,200" change="69.7% of total"         changeType="up"   icon={<CreditCard size={20} className="text-primary" />}       color="bg-primary/10" />
        <StatCard title="Bill Express Revenue"  value="J$86,300"  change="30.3% of total"         changeType="up"   icon={<FileText size={20} className="text-orange-500" />}      color="bg-orange-100" />
        <StatCard title="MoM Growth"            value="+12.4%"    change="vs last month"           changeType="up"   icon={<TrendingUp size={20} className="text-purple-600" />}    color="bg-purple-100" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Area Chart */}
        <div className="card">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Revenue Over Time</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueOverTime} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={v => `J$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={56} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Legend />
              <Area type="monotone" dataKey="fygaro"      name="Fygaro"       stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="billExpress" name="Bill Express"  stroke="#F97316" fill="#F97316" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Revenue by Subscription Plan</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={revenueByPlan}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                label={planLabel}
                labelLine={false}
              >
                {revenueByPlan.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {revenueByPlan.map((p, i) => (
              <div key={p.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: PIE_COLORS[i] }} />
                {p.name} — {fmt(p.amount)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Monthly Revenue Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Period</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Fygaro</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Bill Express</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Manual</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Total</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Subscribers</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">MoM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlyBreakdown.map(row => (
                <tr key={row.period} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.period}</td>
                  <td className="px-4 py-3 text-slate-700">{fmt(row.fygaro)}</td>
                  <td className="px-4 py-3 text-slate-700">{fmt(row.billExpress)}</td>
                  <td className="px-4 py-3 text-slate-700">{row.manual > 0 ? fmt(row.manual) : '—'}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{fmt(row.total)}</td>
                  <td className="px-4 py-3 text-slate-700">{row.subs.toLocaleString()}</td>
                  <td className={`px-4 py-3 font-medium ${!row.mom ? 'text-slate-400' : row.mom.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                    {row.mom ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parish Revenue Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Revenue by Parish</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Parish</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Users</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Subscribers</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Revenue</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 w-40">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parishRevenue.map(row => (
                <tr key={row.parish} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.parish}</td>
                  <td className="px-4 py-3 text-slate-700">{row.users}</td>
                  <td className="px-4 py-3 text-slate-700">{row.subs}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{fmt(row.revenue)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded overflow-hidden">
                        <div className="h-full bg-primary rounded" style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 w-10 text-right">{row.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
