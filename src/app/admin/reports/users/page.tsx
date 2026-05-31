'use client'

import { useState } from 'react'
import { Users, UserPlus, UserMinus, Activity, Download } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import StatCard from '@/components/StatCard'

const DATE_TABS = ['This Month', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'Custom Range']

const registrationData = [
  { month: 'Dec', users: 612 },
  { month: 'Jan', users: 748 },
  { month: 'Feb', users: 681 },
  { month: 'Mar', users: 824 },
  { month: 'Apr', users: 797 },
  { month: 'May', users: 842 },
]

const usersByParish = [
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
  { parish: 'Hanover',       users: 38  },
]

const growthData = [
  { month: 'Dec 2025', newUsers: 612, churned: 98,  net: 514, cumulative: 10821 },
  { month: 'Jan 2026', newUsers: 748, churned: 112, net: 636, cumulative: 11457 },
  { month: 'Feb 2026', newUsers: 681, churned: 105, net: 576, cumulative: 12033 },
  { month: 'Mar 2026', newUsers: 824, churned: 118, net: 706, cumulative: 12739 },
  { month: 'Apr 2026', newUsers: 797, churned: 128, net: 669, cumulative: 13408 },
  { month: 'May 2026', newUsers: 842, churned: 124, net: 718, cumulative: 14126 },
]

const planDist = [
  { plan: 'Free',    users: 4218, pct: 32.8, revenue: 0,      dot: 'bg-slate-400'   },
  { plan: 'Basic',   users: 3941, pct: 30.7, revenue: 99575,  dot: 'bg-blue-500'    },
  { plan: 'Pro',     users: 3284, pct: 25.6, revenue: 119490, dot: 'bg-primary'     },
  { plan: 'Premium', users: 1404, pct: 10.9, revenue: 65435,  dot: 'bg-orange-500'  },
]

function fmt(v: number) {
  return v > 0 ? `J$${v.toLocaleString()}` : '—'
}

export default function UserReportsPage() {
  const [activeTab, setActiveTab] = useState('Last 6 Months')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Analyse user growth, retention and distribution</p>
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
        <StatCard title="Total Registered"    value="12,847" change="+8.2% from last month"  changeType="up"   icon={<Users size={20} className="text-primary" />}        color="bg-primary/10" />
        <StatCard title="New This Month"      value="842"    change="+14.1% vs last month"   changeType="up"   icon={<UserPlus size={20} className="text-green-600" />}    color="bg-green-100"  />
        <StatCard title="Churned This Month"  value="124"    change="-3.8% vs last month"    changeType="down" icon={<UserMinus size={20} className="text-red-500" />}     color="bg-red-100"    />
        <StatCard title="Active Rate"         value="78.4%"  change="+1.2% vs last month"    changeType="up"   icon={<Activity size={20} className="text-purple-600" />}   color="bg-purple-100" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="card">
          <h2 className="text-base font-semibold text-slate-900 mb-4">New User Registrations</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={registrationData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Line type="monotone" dataKey="users" name="New Users" stroke="#0F4C81" strokeWidth={2.5} dot={{ r: 4, fill: '#0F4C81' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="card">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Users by Parish</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={usersByParish}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <YAxis dataKey="parish" type="category" width={90} tick={{ fontSize: 11 }} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Bar dataKey="users" name="Users" fill="#0F4C81" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly User Growth Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Monthly User Growth</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Month</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">New Users</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Churned</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Net Growth</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Cumulative Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {growthData.map(row => (
                <tr key={row.month} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.month}</td>
                  <td className="px-4 py-3 text-slate-700">{row.newUsers.toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-500 font-medium">{row.churned}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">+{row.net}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{row.cumulative.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Plan Distribution Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Subscription Plan Distribution</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Plan</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Users</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">% of Total</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {planDist.map(row => (
                <tr key={row.plan} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${row.dot}`} />
                      <span className="font-medium text-slate-900">{row.plan}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.users.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-700">{row.pct}%</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{fmt(row.revenue)}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-semibold">
                <td className="px-4 py-3 text-slate-900">Total</td>
                <td className="px-4 py-3 text-slate-900">12,847</td>
                <td className="px-4 py-3 text-slate-900">100%</td>
                <td className="px-4 py-3 text-slate-900">J$284,500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
