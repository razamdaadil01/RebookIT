'use client'

import { Users, TrendingUp, CheckCircle, Clock, BarChart2, Eye } from 'lucide-react'
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'
import StatCard from '@/components/StatCard'

function InitAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-purple-500', 'bg-teal-500']
  const c = colors[name.charCodeAt(0) % colors.length]
  const dim = size === 'lg' ? 'w-12 h-12 text-base' : 'w-8 h-8 text-xs'
  return (
    <div className={`${dim} rounded-full ${c} flex items-center justify-center text-white font-bold shrink-0`}>
      {initials}
    </div>
  )
}

const monthlyCommission = [
  { month: 'Dec', paid: 18400 },
  { month: 'Jan', paid: 22100 },
  { month: 'Feb', paid: 19800 },
  { month: 'Mar', paid: 25600 },
  { month: 'Apr', paid: 28900 },
  { month: 'May', paid: 31000 },
]

const conversionByPlan = [
  { name: 'Basic', value: 45 },
  { name: 'Pro', value: 35 },
  { name: 'Premium', value: 20 },
]

const PIE_COLORS = ['#0F4C81', '#F97316', '#22C55E']

const topReferrers = [
  { name: 'Tricia Clarke',     parish: 'Kingston',       sent: 48, conv: 19, earned: 28500, paid: 24000, pending: 4500 },
  { name: 'Marcus Williams',   parish: 'St. Andrew',     sent: 41, conv: 16, earned: 24000, paid: 20000, pending: 4000 },
  { name: 'Khalil Brown',      parish: 'St. Catherine',  sent: 38, conv: 14, earned: 21000, paid: 18000, pending: 3000 },
  { name: 'Nadine Campbell',   parish: 'St. James',      sent: 34, conv: 12, earned: 18000, paid: 15000, pending: 3000 },
  { name: 'Sharon Reid',       parish: 'Manchester',     sent: 31, conv: 11, earned: 16500, paid: 14000, pending: 2500 },
  { name: 'Andre Gordon',      parish: 'Clarendon',      sent: 28, conv: 10, earned: 15000, paid: 13000, pending: 2000 },
  { name: 'Beverley Scott',    parish: 'St. Ann',        sent: 25, conv: 9,  earned: 13500, paid: 12000, pending: 1500 },
  { name: 'Michael Morgan',    parish: 'Westmoreland',   sent: 22, conv: 8,  earned: 12000, paid: 10000, pending: 2000 },
  { name: 'Fabian Thomas',     parish: 'St. Elizabeth',  sent: 18, conv: 6,  earned: 9000,  paid: 8000,  pending: 1000 },
  { name: 'Natalie Wright',    parish: 'Portland',       sent: 15, conv: 5,  earned: 7500,  paid: 6800,  pending: 700  },
]

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs font-bold">1</div>
  if (rank === 2) return <div className="w-7 h-7 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs font-bold">2</div>
  if (rank === 3) return <div className="w-7 h-7 rounded-full bg-amber-700 flex items-center justify-center text-white text-xs font-bold">3</div>
  return <span className="text-sm text-text-secondary font-medium w-7 text-center inline-block">{rank}</span>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pieLabel(entry: any) { return `${entry.name} ${entry.value}%` }

export default function ReferralAnalyticsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Referral Analytics</h1>
        <p className="text-text-secondary text-sm mt-1">Track referral performance and commission payouts</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Active Referrers"
          value="342"
          change="+12%"
          changeType="up"
          icon={<Users size={20} className="text-primary" />}
          color="bg-primary/10"
        />
        <StatCard
          title="Total Commission Earned"
          value="J$184,200"
          change="+18%"
          changeType="up"
          icon={<TrendingUp size={20} className="text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="Commission Paid"
          value="J$156,800"
          change="All time"
          changeType="up"
          icon={<CheckCircle size={20} className="text-teal-600" />}
          color="bg-teal-100"
        />
        <StatCard
          title="Commission Pending"
          value="J$27,400"
          change="Awaiting payout"
          changeType="down"
          icon={<Clock size={20} className="text-yellow-600" />}
          color="bg-yellow-100"
        />
        <StatCard
          title="Conversion Rate"
          value="34.2%"
          change="+2.1%"
          changeType="up"
          icon={<BarChart2 size={20} className="text-purple-600" />}
          color="bg-purple-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-base font-semibold text-text-primary mb-4">Monthly Commission Paid</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyCommission} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `J$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Line type="monotone" dataKey="paid" stroke="#0F4C81" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-text-primary mb-4">Referral Conversions by Plan</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={conversionByPlan}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={pieLabel}
              >
                {conversionByPlan.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="card">
        <h2 className="text-base font-semibold text-text-primary mb-4">Top Referrers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-text-secondary font-medium">#</th>
                <th className="text-left py-3 px-3 text-text-secondary font-medium">User</th>
                <th className="text-left py-3 px-3 text-text-secondary font-medium">Parish</th>
                <th className="text-center py-3 px-3 text-text-secondary font-medium">Sent</th>
                <th className="text-center py-3 px-3 text-text-secondary font-medium">Conv.</th>
                <th className="text-right py-3 px-3 text-text-secondary font-medium">Earned</th>
                <th className="text-right py-3 px-3 text-text-secondary font-medium">Paid</th>
                <th className="text-right py-3 px-3 text-text-secondary font-medium">Pending</th>
                <th className="text-center py-3 px-3 text-text-secondary font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {topReferrers.map((r, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3"><RankBadge rank={i + 1} /></td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <InitAvatar name={r.name} />
                      <span className="font-medium text-text-primary">{r.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-text-secondary">{r.parish}</td>
                  <td className="py-3 px-3 text-center font-medium">{r.sent}</td>
                  <td className="py-3 px-3 text-center font-medium">{r.conv}</td>
                  <td className="py-3 px-3 text-right font-medium">J${r.earned.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right text-success font-medium">J${r.paid.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right font-medium">
                    <span className={r.pending > 0 ? 'text-warning' : 'text-text-secondary'}>
                      J${r.pending.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                      <Eye size={16} />
                    </button>
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
