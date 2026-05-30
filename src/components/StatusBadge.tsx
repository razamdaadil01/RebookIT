'use client'

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700' },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-700' },
  successful: { label: 'Successful', className: 'bg-green-100 text-green-700' },
  paid: { label: 'Paid', className: 'bg-green-100 text-green-700' },
  resolved: { label: 'Resolved', className: 'bg-green-100 text-green-700' },
  converted: { label: 'Converted', className: 'bg-green-100 text-green-700' },
  processed: { label: 'Processed', className: 'bg-green-100 text-green-700' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
  'under review': { label: 'Under Review', className: 'bg-yellow-100 text-yellow-700' },
  unverified: { label: 'Unverified', className: 'bg-yellow-100 text-yellow-700' },
  refunded: { label: 'Refunded', className: 'bg-blue-100 text-blue-700' },
  featured: { label: 'Featured', className: 'bg-purple-100 text-purple-700' },
  joined: { label: 'Joined', className: 'bg-blue-100 text-blue-700' },
  suspended: { label: 'Suspended', className: 'bg-red-100 text-red-700' },
  flagged: { label: 'Flagged', className: 'bg-red-100 text-red-700' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-700' },
  banned: { label: 'Banned', className: 'bg-red-900/20 text-red-900' },
  open: { label: 'Open', className: 'bg-orange-100 text-orange-700' },
  expired: { label: 'Expired', className: 'bg-slate-100 text-slate-600' },
  inactive: { label: 'Inactive', className: 'bg-slate-100 text-slate-600' },
  closed: { label: 'Closed', className: 'bg-slate-100 text-slate-600' },
  sent: { label: 'Sent', className: 'bg-green-100 text-green-700' },
  scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-700' },
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600' },
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const key = status.toLowerCase()
  const config = statusConfig[key] ?? { label: status, className: 'bg-slate-100 text-slate-600' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`}>
      {config.label}
    </span>
  )
}
