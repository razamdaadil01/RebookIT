'use client'

import { useState } from 'react'
import StatusBadge from '@/components/StatusBadge'
import ConfirmDialog from '@/components/ConfirmDialog'
import DataTable from '@/components/DataTable'
import {
  Eye, Ban, UserX, Search, X, ShieldCheck, ShieldOff, Bell,
  CheckCircle, Clock, AlertTriangle, Package, CreditCard, FileText,
  Activity, ChevronRight,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type User = {
  id: string
  name: string
  email: string
  phone: string
  role: 'buyer' | 'seller' | 'both'
  joined: string
  status: string
  listings: number
  sales: number
  kyc: 'verified' | 'pending' | 'unverified'
  location: string
  transactions: number
  reportsReceived: number
  lastActive: string
}

type UserListing = { title: string; category: string; price: number; status: string; date: string }
type UserTransaction = { item: string; type: 'buy' | 'sell'; amount: number; date: string; status: string }
type UserReport = { reason: string; reportedBy: string; date: string; status: string }
type ActivityEvent = { action: string; detail: string; date: string; icon: 'join' | 'listing' | 'purchase' | 'warn' | 'report' | 'verify' }

// ─── Dummy per-user data ──────────────────────────────────────────────────────

const USER_LISTINGS: Record<string, UserListing[]> = {
  U001: [
    { title: 'iPhone 14 Pro 256GB', category: 'Electronics', price: 4500, status: 'active', date: 'May 20, 2026' },
    { title: 'Sony WH-1000XM5', category: 'Electronics', price: 1200, status: 'active', date: 'May 10, 2026' },
    { title: 'Apple Watch Series 8', category: 'Electronics', price: 2200, status: 'sold', date: 'Apr 28, 2026' },
    { title: 'iPad Air 5th Gen', category: 'Electronics', price: 3100, status: 'expired', date: 'Apr 5, 2026' },
  ],
  U002: [
    { title: 'L-Shaped Sofa (Beige)', category: 'Furniture', price: 3200, status: 'active', date: 'May 22, 2026' },
    { title: 'King Bed Frame + Mattress', category: 'Furniture', price: 4800, status: 'sold', date: 'May 1, 2026' },
    { title: 'Dining Table Set (6 chairs)', category: 'Furniture', price: 2600, status: 'active', date: 'Apr 18, 2026' },
  ],
  default: [
    { title: 'Sample Listing A', category: 'Electronics', price: 1500, status: 'active', date: 'May 15, 2026' },
    { title: 'Sample Listing B', category: 'Fashion', price: 400, status: 'sold', date: 'May 2, 2026' },
  ],
}

const USER_TRANSACTIONS: Record<string, UserTransaction[]> = {
  U001: [
    { item: 'iPhone 14 Pro 256GB', type: 'sell', amount: 4500, date: 'May 20, 2026', status: 'Successful' },
    { item: 'Sony WH-1000XM5', type: 'sell', amount: 1200, date: 'May 12, 2026', status: 'Successful' },
    { item: 'PS5 Console', type: 'buy', amount: 3800, date: 'Apr 30, 2026', status: 'Successful' },
    { item: 'Apple Watch Series 8', type: 'sell', amount: 2200, date: 'Apr 28, 2026', status: 'Refunded' },
  ],
  U002: [
    { item: 'L-Shaped Sofa', type: 'sell', amount: 3200, date: 'May 22, 2026', status: 'Successful' },
    { item: 'King Bed Frame', type: 'sell', amount: 4800, date: 'May 1, 2026', status: 'Successful' },
    { item: 'Honda Civic 2019', type: 'buy', amount: 65000, date: 'Apr 14, 2026', status: 'Pending' },
  ],
  default: [
    { item: 'Sample Item X', type: 'buy', amount: 1200, date: 'May 10, 2026', status: 'Successful' },
    { item: 'Sample Item Y', type: 'sell', amount: 850, date: 'Apr 22, 2026', status: 'Successful' },
  ],
}

const USER_REPORTS: Record<string, UserReport[]> = {
  U007: [
    { reason: 'Counterfeit Item', reportedBy: 'Kezia Phillip', date: 'May 18, 2026', status: 'Under Review' },
    { reason: 'Spam Listings', reportedBy: 'Devon Rampersad', date: 'Apr 30, 2026', status: 'Resolved' },
  ],
  U012: [
    { reason: 'Fraud', reportedBy: 'Sandra Hernandez', date: 'May 25, 2026', status: 'Open' },
    { reason: 'Item Not as Described', reportedBy: 'Alicia Mohammed', date: 'May 10, 2026', status: 'Resolved' },
    { reason: 'Inappropriate Content', reportedBy: 'Natasha Beckles', date: 'Apr 20, 2026', status: 'Closed' },
  ],
  default: [],
}

const USER_ACTIVITY: Record<string, ActivityEvent[]> = {
  U001: [
    { action: 'Account Created', detail: 'Joined via web signup', date: 'Jan 12, 2024', icon: 'join' },
    { action: 'KYC Verified', detail: 'Identity documents approved', date: 'Jan 15, 2024', icon: 'verify' },
    { action: 'Posted Listing', detail: 'iPhone 14 Pro 256GB — J$4,500', date: 'May 20, 2026', icon: 'listing' },
    { action: 'Sale Completed', detail: 'Sony WH-1000XM5 sold to Kezia Phillip', date: 'May 12, 2026', icon: 'purchase' },
    { action: 'Purchase Made', detail: 'Bought PS5 Console from Devon Rampersad', date: 'Apr 30, 2026', icon: 'purchase' },
  ],
  U007: [
    { action: 'Account Created', detail: 'Joined via referral link', date: 'Mar 5, 2024', icon: 'join' },
    { action: 'Posted Listing', detail: 'Nike Air Max 270 — J$650', date: 'Apr 10, 2026', icon: 'listing' },
    { action: 'Report Received', detail: 'Reported for Counterfeit Item by Kezia Phillip', date: 'May 18, 2026', icon: 'report' },
    { action: 'Account Suspended', detail: 'Suspended pending investigation', date: 'May 19, 2026', icon: 'warn' },
  ],
  default: [
    { action: 'Account Created', detail: 'Joined via web signup', date: 'Mar 1, 2024', icon: 'join' },
    { action: 'Profile Updated', detail: 'Added phone number and profile photo', date: 'Mar 3, 2024', icon: 'verify' },
    { action: 'Purchase Made', detail: 'Bought Air Jordan 1 from Marcus Williams', date: 'Apr 15, 2026', icon: 'purchase' },
  ],
}

function getListings(id: string) { return USER_LISTINGS[id] ?? USER_LISTINGS.default }
function getTransactions(id: string) { return USER_TRANSACTIONS[id] ?? USER_TRANSACTIONS.default }
function getReports(id: string) { return USER_REPORTS[id] ?? USER_REPORTS.default }
function getActivity(id: string) { return USER_ACTIVITY[id] ?? USER_ACTIVITY.default }

// ─── Static data ──────────────────────────────────────────────────────────────

const USERS: User[] = [
  { id: 'U001', name: 'Marcus Williams',  email: 'marcus@email.com',   phone: '868-301-1234', role: 'seller', joined: 'Jan 12, 2024', status: 'active',     kyc: 'verified',   location: 'Port of Spain', listings: 42, sales: 142, transactions: 38, reportsReceived: 0, lastActive: '2 hours ago' },
  { id: 'U002', name: 'Kerri-Ann Joseph', email: 'kerri@email.com',    phone: '868-302-2345', role: 'seller', joined: 'Jan 18, 2024', status: 'active',     kyc: 'verified',   location: 'San Fernando',  listings: 31, sales: 98,  transactions: 24, reportsReceived: 0, lastActive: '5 hours ago' },
  { id: 'U003', name: 'Alicia Mohammed',  email: 'alicia@email.com',   phone: '868-303-3456', role: 'both',   joined: 'Feb 2, 2024',  status: 'active',     kyc: 'verified',   location: 'Chaguanas',     listings: 28, sales: 87,  transactions: 19, reportsReceived: 1, lastActive: 'Yesterday' },
  { id: 'U004', name: 'Rajesh Persad',    email: 'rajesh@email.com',   phone: '868-304-4567', role: 'seller', joined: 'Feb 9, 2024',  status: 'active',     kyc: 'verified',   location: 'Arima',         listings: 19, sales: 76,  transactions: 15, reportsReceived: 0, lastActive: '1 day ago' },
  { id: 'U005', name: 'Tricia Clarke',    email: 'tricia@email.com',   phone: '868-305-5678', role: 'both',   joined: 'Feb 14, 2024', status: 'active',     kyc: 'verified',   location: 'Port of Spain', listings: 15, sales: 65,  transactions: 11, reportsReceived: 0, lastActive: '3 hours ago' },
  { id: 'U006', name: 'Devon Rampersad',  email: 'devon@email.com',    phone: '868-306-6789', role: 'buyer',  joined: 'Mar 1, 2024',  status: 'active',     kyc: 'verified',   location: 'San Fernando',  listings: 0,  sales: 0,   transactions: 6,  reportsReceived: 0, lastActive: '30 min ago' },
  { id: 'U007', name: 'Simone Baptiste',  email: 'simone@email.com',   phone: '868-307-7890', role: 'seller', joined: 'Mar 5, 2024',  status: 'suspended',  kyc: 'pending',    location: 'Tobago',        listings: 8,  sales: 22,  transactions: 5,  reportsReceived: 2, lastActive: '6 days ago' },
  { id: 'U008', name: 'Anil Kumar',       email: 'anil@email.com',     phone: '868-308-8901', role: 'both',   joined: 'Mar 10, 2024', status: 'active',     kyc: 'verified',   location: 'Chaguanas',     listings: 12, sales: 34,  transactions: 9,  reportsReceived: 0, lastActive: 'Today' },
  { id: 'U009', name: 'Sandra Hernandez', email: 'sandra@email.com',   phone: '868-309-9012', role: 'buyer',  joined: 'Mar 15, 2024', status: 'inactive',   kyc: 'unverified', location: 'Arima',         listings: 0,  sales: 0,   transactions: 2,  reportsReceived: 0, lastActive: '2 months ago' },
  { id: 'U010', name: 'Christopher Paul', email: 'chris@email.com',    phone: '868-310-0123', role: 'seller', joined: 'Mar 20, 2024', status: 'active',     kyc: 'verified',   location: 'Port of Spain', listings: 9,  sales: 28,  transactions: 7,  reportsReceived: 0, lastActive: '4 hours ago' },
  { id: 'U011', name: 'Priya Ramkissoon', email: 'priya@email.com',    phone: '868-311-1234', role: 'both',   joined: 'Apr 2, 2024',  status: 'active',     kyc: 'verified',   location: 'San Fernando',  listings: 6,  sales: 18,  transactions: 4,  reportsReceived: 0, lastActive: 'Yesterday' },
  { id: 'U012', name: 'Tony Alleyne',     email: 'tony@email.com',     phone: '868-312-2345', role: 'seller', joined: 'Apr 8, 2024',  status: 'banned',     kyc: 'unverified', location: 'Tobago',        listings: 3,  sales: 7,   transactions: 2,  reportsReceived: 3, lastActive: '1 month ago' },
  { id: 'U013', name: 'Michelle Narine',  email: 'michelle@email.com', phone: '868-313-3456', role: 'buyer',  joined: 'Apr 12, 2024', status: 'active',     kyc: 'verified',   location: 'Chaguanas',     listings: 0,  sales: 0,   transactions: 3,  reportsReceived: 0, lastActive: '1 hour ago' },
  { id: 'U014', name: 'David Ramoutar',   email: 'david@email.com',    phone: '868-314-4567', role: 'seller', joined: 'Apr 18, 2024', status: 'unverified', kyc: 'pending',    location: 'Arima',         listings: 4,  sales: 0,   transactions: 0,  reportsReceived: 0, lastActive: '3 days ago' },
  { id: 'U015', name: 'Kezia Phillip',    email: 'kezia@email.com',    phone: '868-315-5678', role: 'buyer',  joined: 'Apr 22, 2024', status: 'active',     kyc: 'verified',   location: 'Port of Spain', listings: 0,  sales: 0,   transactions: 5,  reportsReceived: 0, lastActive: '20 min ago' },
  { id: 'U016', name: 'Omar Abdullah',    email: 'omar@email.com',     phone: '868-316-6789', role: 'both',   joined: 'May 1, 2024',  status: 'active',     kyc: 'verified',   location: 'San Fernando',  listings: 7,  sales: 14,  transactions: 6,  reportsReceived: 0, lastActive: '2 hours ago' },
  { id: 'U017', name: 'Candice Fraser',   email: 'candice@email.com',  phone: '868-317-7890', role: 'seller', joined: 'May 5, 2024',  status: 'suspended',  kyc: 'pending',    location: 'Tobago',        listings: 5,  sales: 9,   transactions: 3,  reportsReceived: 1, lastActive: '8 days ago' },
  { id: 'U018', name: 'Vikram Singh',     email: 'vikram@email.com',   phone: '868-318-8901', role: 'buyer',  joined: 'May 10, 2024', status: 'active',     kyc: 'verified',   location: 'Chaguanas',     listings: 0,  sales: 0,   transactions: 4,  reportsReceived: 0, lastActive: 'Today' },
  { id: 'U019', name: 'Natasha Beckles',  email: 'natasha@email.com',  phone: '868-319-9012', role: 'both',   joined: 'May 15, 2024', status: 'active',     kyc: 'verified',   location: 'Port of Spain', listings: 3,  sales: 5,   transactions: 2,  reportsReceived: 0, lastActive: 'Yesterday' },
  { id: 'U020', name: 'James Crichlow',   email: 'james@email.com',    phone: '868-320-0123', role: 'seller', joined: 'May 20, 2024', status: 'unverified', kyc: 'unverified', location: 'Arima',         listings: 1,  sales: 0,   transactions: 0,  reportsReceived: 0, lastActive: '5 days ago' },
]

const TABS = ['All', 'Buyers', 'Sellers', 'Suspended', 'Unverified']
const DRAWER_TABS = ['Overview', 'Listings', 'Transactions', 'Reports', 'Activity Log'] as const
type DrawerTab = typeof DRAWER_TABS[number]

// ─── Sub-components ───────────────────────────────────────────────────────────

function InitAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-purple-500', 'bg-teal-500']
  const c = colors[name.charCodeAt(0) % colors.length]
  const dim = size === 'lg' ? 'w-16 h-16 text-xl' : 'w-8 h-8 text-xs'
  return (
    <div className={`${dim} rounded-full ${c} flex items-center justify-center text-white font-bold shrink-0`}>
      {initials}
    </div>
  )
}

function KycBadge({ kyc }: { kyc: User['kyc'] }) {
  if (kyc === 'verified') return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
      <ShieldCheck size={11} /> KYC Verified
    </span>
  )
  if (kyc === 'pending') return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-warning bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full">
      <Clock size={11} /> KYC Pending
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
      <ShieldOff size={11} /> KYC Not Submitted
    </span>
  )
}

function ActivityIcon({ icon }: { icon: ActivityEvent['icon'] }) {
  const map: Record<ActivityEvent['icon'], { bg: string; el: React.ReactNode }> = {
    join:     { bg: 'bg-primary/10',  el: <Activity size={13} className="text-primary" /> },
    listing:  { bg: 'bg-accent/10',   el: <Package size={13} className="text-accent" /> },
    purchase: { bg: 'bg-success/10',  el: <CreditCard size={13} className="text-success" /> },
    warn:     { bg: 'bg-warning/10',  el: <AlertTriangle size={13} className="text-warning" /> },
    report:   { bg: 'bg-danger/10',   el: <FileText size={13} className="text-danger" /> },
    verify:   { bg: 'bg-teal-100',    el: <ShieldCheck size={13} className="text-teal-600" /> },
  }
  const { bg, el } = map[icon]
  return <div className={`w-7 h-7 rounded-full ${bg} flex items-center justify-center shrink-0`}>{el}</div>
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

function UserDrawer({
  user,
  onClose,
  onAction,
}: {
  user: User | null
  onClose: () => void
  onAction: (type: string, user: User) => void
}) {
  const [drawerTab, setDrawerTab] = useState<DrawerTab>('Overview')

  if (!user) return null

  const listings = getListings(user.id)
  const transactions = getTransactions(user.id)
  const reports = getReports(user.id)
  const activity = getActivity(user.id)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-primary to-[#1a6bbf] px-6 pt-5 pb-6 shrink-0">
          <div className="flex items-start justify-between mb-5">
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">User Profile</p>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X size={14} className="text-white" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="ring-4 ring-white/30 rounded-full">
              <InitAvatar name={user.name} size="lg" />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-bold text-lg leading-tight truncate">{user.name}</h2>
              <p className="text-white/70 text-sm mt-0.5">{user.email}</p>
              <p className="text-white/70 text-sm">{user.phone}</p>
              <div className="flex items-center flex-wrap gap-2 mt-2">
                <span className="text-xs font-medium bg-white/20 text-white px-2.5 py-0.5 rounded-full capitalize">
                  {user.role}
                </span>
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-5 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-white font-bold text-lg">{user.listings}</p>
              <p className="text-white/60 text-xs">Listings</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-white font-bold text-lg">{user.transactions}</p>
              <p className="text-white/60 text-xs">Transactions</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-white font-bold text-lg">{user.reportsReceived}</p>
              <p className="text-white/60 text-xs">Reports</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-white/60 text-xs mb-0.5">Last Active</p>
              <p className="text-white text-xs font-medium">{user.lastActive}</p>
            </div>
          </div>
        </div>

        {/* ── Drawer Tabs ─────────────────────────────────────────────────── */}
        <div className="flex border-b border-border bg-white shrink-0 overflow-x-auto">
          {DRAWER_TABS.map(t => (
            <button
              key={t}
              onClick={() => setDrawerTab(t)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${drawerTab === t
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Tab Content ─────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* Overview */}
          {drawerTab === 'Overview' && (
            <div className="p-5 space-y-5">
              {/* KYC */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-slate-50">
                <div>
                  <p className="text-sm font-semibold text-text-primary">KYC Status</p>
                  <p className="text-xs text-text-secondary mt-0.5">Identity verification status</p>
                </div>
                <KycBadge kyc={user.kyc} />
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'User ID', value: user.id },
                  { label: 'Location', value: user.location },
                  { label: 'Joined', value: user.joined },
                  { label: 'Role', value: user.role },
                  { label: 'Listings Posted', value: user.listings.toString() },
                  { label: 'Sales Made', value: user.sales.toString() },
                  { label: 'Transactions', value: user.transactions.toString() },
                  { label: 'Reports Received', value: user.reportsReceived.toString() },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 border border-border rounded-lg p-3">
                    <p className="text-xs text-text-secondary">{label}</p>
                    <p className="text-sm font-semibold text-text-primary capitalize mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Activity summary */}
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Account Activity</p>
                <div className="space-y-2">
                  {[
                    { label: 'Profile complete', done: true },
                    { label: 'Email verified', done: true },
                    { label: 'Phone verified', done: user.kyc !== 'unverified' },
                    { label: 'KYC submitted', done: user.kyc !== 'unverified' },
                    { label: 'KYC approved', done: user.kyc === 'verified' },
                  ].map(({ label, done }) => (
                    <div key={label} className="flex items-center gap-2 text-sm">
                      {done
                        ? <CheckCircle size={15} className="text-success shrink-0" />
                        : <div className="w-[15px] h-[15px] rounded-full border-2 border-slate-300 shrink-0" />}
                      <span className={done ? 'text-text-primary' : 'text-text-secondary'}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Listings */}
          {drawerTab === 'Listings' && (
            <div className="p-5">
              {listings.length === 0 ? (
                <div className="py-16 text-center text-text-secondary">
                  <Package size={36} className="mx-auto text-slate-200 mb-2" />
                  <p className="text-sm">No listings yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {listings.map((l, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <Package size={18} className="text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{l.title}</p>
                        <p className="text-xs text-text-secondary">{l.category} · {l.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-text-primary">J${l.price.toLocaleString()}</p>
                        <StatusBadge status={l.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Transactions */}
          {drawerTab === 'Transactions' && (
            <div className="p-5">
              {transactions.length === 0 ? (
                <div className="py-16 text-center text-text-secondary">
                  <CreditCard size={36} className="mx-auto text-slate-200 mb-2" />
                  <p className="text-sm">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-slate-50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                        ${t.type === 'sell' ? 'bg-green-100' : 'bg-primary/10'}`}>
                        <CreditCard size={14} className={t.type === 'sell' ? 'text-success' : 'text-primary'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{t.item}</p>
                        <p className="text-xs text-text-secondary capitalize">{t.type === 'sell' ? 'Sold' : 'Bought'} · {t.date}</p>
                      </div>
                      <div className="text-right shrink-0 space-y-1">
                        <p className={`text-sm font-semibold ${t.type === 'sell' ? 'text-success' : 'text-text-primary'}`}>
                          {t.type === 'sell' ? '+' : '-'}J${t.amount.toLocaleString()}
                        </p>
                        <StatusBadge status={t.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reports */}
          {drawerTab === 'Reports' && (
            <div className="p-5">
              {reports.length === 0 ? (
                <div className="py-16 text-center text-text-secondary">
                  <ShieldCheck size={36} className="mx-auto text-slate-200 mb-2" />
                  <p className="text-sm font-medium">No reports against this user</p>
                  <p className="text-xs mt-1">This user has a clean record</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-text-secondary font-medium">{reports.length} report{reports.length !== 1 ? 's' : ''} on file</p>
                  {reports.map((r, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-slate-50">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={15} className="text-warning shrink-0 mt-0.5" />
                          <p className="text-sm font-semibold text-text-primary">{r.reason}</p>
                        </div>
                        <StatusBadge status={r.status} />
                      </div>
                      <p className="text-xs text-text-secondary mt-2 ml-5">
                        Reported by <span className="font-medium text-text-primary">{r.reportedBy}</span> · {r.date}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Activity Log */}
          {drawerTab === 'Activity Log' && (
            <div className="p-5">
              <div className="relative">
                {/* vertical line */}
                <div className="absolute left-[13px] top-4 bottom-4 w-px bg-border" />
                <div className="space-y-5">
                  {activity.map((ev, i) => (
                    <div key={i} className="flex gap-3 relative">
                      <ActivityIcon icon={ev.icon} />
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm font-semibold text-text-primary">{ev.action}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{ev.detail}</p>
                        <p className="text-xs text-text-secondary/70 mt-1">{ev.date}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer Actions ───────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-border bg-white p-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAction('verify', user)}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <ShieldCheck size={15} /> Verify KYC
            </button>
            <button
              onClick={() => onAction('notify', user)}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-slate-100 text-text-primary text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              <Bell size={15} /> Send Notification
            </button>
            <button
              onClick={() => onAction('suspend', user)}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-warning/10 text-warning text-sm font-medium hover:bg-warning/20 transition-colors"
            >
              <UserX size={15} /> Suspend User
            </button>
            <button
              onClick={() => onAction('ban', user)}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-danger/10 text-danger text-sm font-medium hover:bg-danger/20 transition-colors"
            >
              <Ban size={15} /> Ban User
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [drawerUser, setDrawerUser] = useState<User | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ type: string; user: User } | null>(null)

  const filtered = USERS.filter(u => {
    const matchTab =
      tab === 'All'        ? true :
      tab === 'Buyers'     ? (u.role === 'buyer' || u.role === 'both') :
      tab === 'Sellers'    ? (u.role === 'seller' || u.role === 'both') :
      tab === 'Suspended'  ? u.status === 'suspended' :
      tab === 'Unverified' ? u.status === 'unverified' : true
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  function handleDrawerAction(type: string, user: User) {
    if (type === 'suspend' || type === 'ban') {
      setDrawerUser(null)
      setConfirmAction({ type, user })
    }
    // verify / notify: no-op for prototype
  }

  const columns = [
    {
      header: 'User',
      accessor: (u: User) => (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setDrawerUser(u)}>
          <InitAvatar name={u.name} />
          <div>
            <p className="font-medium text-text-primary text-sm hover:text-primary transition-colors">{u.name}</p>
            <p className="text-xs text-text-secondary">{u.email}</p>
          </div>
        </div>
      ),
    },
    { header: 'Phone',  accessor: 'phone' as keyof User },
    { header: 'Role',   accessor: (u: User) => <span className="capitalize text-sm text-text-secondary">{u.role}</span> },
    { header: 'Joined', accessor: 'joined' as keyof User },
    { header: 'Status', accessor: (u: User) => <StatusBadge status={u.status} /> },
    {
      header: 'Actions',
      accessor: (u: User) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setDrawerUser(u)} className="p-1.5 rounded-md text-primary hover:bg-primary/10 transition-colors" title="View Profile">
            <Eye size={15} />
          </button>
          <button onClick={() => setConfirmAction({ type: 'suspend', user: u })} className="p-1.5 rounded-md text-warning hover:bg-warning/10 transition-colors" title="Suspend">
            <UserX size={15} />
          </button>
          <button onClick={() => setConfirmAction({ type: 'ban', user: u })} className="p-1.5 rounded-md text-danger hover:bg-danger/10 transition-colors" title="Ban">
            <Ban size={15} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
        <p className="text-sm text-text-secondary mt-1">Manage all registered users on the platform</p>
      </div>

      {/* Search + Tabs row */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={filtered} />

      {/* Slide-over drawer */}
      <UserDrawer
        user={drawerUser}
        onClose={() => setDrawerUser(null)}
        onAction={handleDrawerAction}
      />

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => setConfirmAction(null)}
        title={confirmAction?.type === 'ban' ? 'Ban User' : confirmAction?.type === 'verify' ? 'Verify KYC' : 'Suspend User'}
        message={`Are you sure you want to ${confirmAction?.type} ${confirmAction?.user.name}? This action can be reversed from user settings.`}
        confirmLabel={confirmAction?.type === 'ban' ? 'Ban User' : confirmAction?.type === 'verify' ? 'Verify' : 'Suspend'}
      />
    </div>
  )
}
