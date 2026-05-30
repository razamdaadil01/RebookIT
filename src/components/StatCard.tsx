import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change: string
  changeType: 'up' | 'down'
  icon: React.ReactNode
  color: string
}

export default function StatCard({ title, value, change, changeType, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
          ${changeType === 'up' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          {changeType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-secondary mt-0.5">{title}</p>
      </div>
    </div>
  )
}
