'use client'

import { useState } from 'react'
import { Share2, CheckCircle, Wallet, Trophy, Download } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import StatCard from '@/components/StatCard'

const DATE_TABS = ['This Month', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'Custom Range']

function InitAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-purple-500', 'bg-teal-500']
  const c = colors[name.charCodeAt(0) % colors.length]
  return <div className={`w-8 h-8 rounded-full ${c} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{initials}</div>
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-white shrink-0">1</span>
  if (rank === 2) return <span className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center text-xs font-bold text-white shrink-0">2</span>
  if (rank === 3) return <span className="w-6 h-6 rounded-full bg-amber-700 flex items-center justify-center text-xs font-bold text-white shrink-0">3</span>
  return <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">{rank}</span>
}

const referralTrend = [
  { month: 'Dec', referrals: 312, conversions: 98  },
  { month: 'Jan', referrals: 378, conversions: 124 },
  { month: 'Feb', referrals: 341, conversions: 109 },
  { month: 'Mar', referrals: 412, conversions: 148 },
  { month: 'Apr', referrals: 448, conversions: 162 },
  { month: 'May', referrals: 450, conversions: 160 },
]

const referralsByParish = [
  { parish: 'Kingston',      referrals: 521 },
  { parish: 'St. Andrew',    referrals: 448 },
  { parish: 'St. Catherine', referrals: 374 },
  { parish: 'St. James',     referrals: 298 },
  { parish: 'Manchester',    referrals: 241 },
  { parish: 'Clarendon',     referrals: 188 },
  { parish: 'St. Ann',       referrals: 154 },
  { parish: 'Westmoreland',  referrals: 117 },
]

const funnelData = [
  { month: 'Dec 2025', sent: 312, clicked: 241, registered: 148, converted: 98,  rate: '31.4%', commission: 14700 },
  { month: 'Jan 2026', sent: 378, clicked: 298, registered: 189, converted: 124, rate: '32.8%', commission: 18600 },
  { month: 'Feb 2026', sent: 341, clicked: 264, registered: 162, converted: 109, rate: '31.9%', commission: 16350 },
  { month: 'Mar 2026', sent: 412, clicked: 334, registered: 214, converted: 148, rate: '35.9%', commission: 22200 },
  { month: 'Apr 2026', sent: 448, clicked: 361, registered: 232, converted: 162, rate: '36.2%', commission: 24300 },
  { month: 'May 2026', sent: 450, clicked: 358, registered: 228, converted: 160, rate: '35.6%', commission: 24000 },
]

const topReferrers = [
  { name: 'Tricia Clarke',    parish: 'Kingston',      referrals: 48, conversions: 19, rate: '39.6%', commission: 28500 },
  { name: 'Marcus Williams',  parish: 'St. Andrew',    referrals: 41, conversions: 16, rate: '39.0%', commission: 24000 },
  { name: 'Khalil Brown',     parish: 'St. Catherine', referrals: 38, conversions: 14, rate: '36.8%', commission: 21000 },
  { name: 'Nadine Campbell',  parish: 'St. James',     referrals: 34, conversions: 12, rate: '35.3%', commission: 18000 },
  { name: 'Sharon Reid',      parish: 'Manchester',    referrals: 31, conversions: 11, rate: '35.5%', commission: 16500 },
  { name: 'Andre Gordon',     parish: 'Clarendon',     referrals: 28, conversions: 10, rate: '35.7%', commission: 15000 },
  { name: 'Beverley Scott',   parish: 'St. Ann',       referrals: 25, conversions: 9,  rate: '36.0%', commission: 13500 },
  { name: 'Michael Morgan',   parish: 'Westmoreland',  referrals: 22, conversions: 8,  rate: '36.4%', commission: 12000 },
  { name: 'Fabian Thomas',    parish: 'St. Elizabeth', referrals: 18, conversions: 6,  rate: '33.3%', commission: 9000  },
  { name: 'Natalie Wright',   parish: 'Portland',      referrals: 15, conversions: 5,  rate: '33.3%', commission: 7500  },
]

export default function ReferralReportsPage() {
  const [activeTab, setActiveTab] = useState('Last 6 Months')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Referral Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor referral performance and commission payouts</p>
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
        <StatCard title="Total Referrals"   value="2,341"      change="+18.2% from last month" changeType="up" icon={<Share2 size={20} className="text-primary" />}        color="bg-primary/10" />
        <StatCard title="Conversions"       value="801 (34.2%)" change="+2.1% conversion rate" changeType="up" icon={<CheckCircle size={20} className="text-green-600" />}  color="bg-green-100"  />
        <StatCard title="Commission Paid"   value="J$156,800"  change="All time total"          changeType="up" icon={<Wallet size={20} className="text-purple-600" />}      color="bg-purple-100" />
        <StatCard title="Top Earner"        value="J$28,500"   change="Tricia Clarke"           changeType="up" icon={<Trophy size={20} className="text-yellow-600" />}      color="bg-yellow-100" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Line Chart: Referrals vs Conversions */}
        <div className="card">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Monthly Referrals vs Conversions</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={referralTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Legend />
              <Line type="monotone" dataKey="referrals"   name="Referrals"    stroke="#0F4C81" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="conversions" name="Conversions"   stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Referrals by Parish */}
        <div className="card">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Referrals by Parish</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={referralsByParish} margin={{ top: 4, right: 4, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="parish" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Bar dataKey="referrals" name="Referrals" fill="#0F4C81" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Referral Funnel Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Referral Funnel by Month</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Month</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Sent</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Clicked</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Registered</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Converted</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Rate</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {funnelData.map(row => (
                <tr key={row.month} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.month}</td>
                  <td className="px-4 py-3 text-slate-700">{row.sent}</td>
                  <td className="px-4 py-3 text-slate-700">{row.clicked}</td>
                  <td className="px-4 py-3 text-slate-700">{row.registered}</td>
                  <td className="px-4 py-3 text-slate-700">{row.converted}</td>
                  <td className="px-4 py-3 font-medium text-green-600">{row.rate}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">J${row.commission.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Referrers Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Top Referrers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Rank</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">User</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Parish</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Referrals</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Conversions</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Rate</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topReferrers.map((ref, i) => (
                <tr key={ref.name} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <RankBadge rank={i + 1} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <InitAvatar name={ref.name} />
                      <span className="font-medium text-slate-900">{ref.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{ref.parish}</td>
                  <td className="px-4 py-3 text-slate-700">{ref.referrals}</td>
                  <td className="px-4 py-3 text-slate-700">{ref.conversions}</td>
                  <td className="px-4 py-3 font-medium text-green-600">{ref.rate}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">J${ref.commission.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
