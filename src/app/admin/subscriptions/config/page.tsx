'use client'

import { useState } from 'react'
import { Plus, Edit2, ToggleLeft, ToggleRight, Check, Trash2 } from 'lucide-react'
import Modal from '@/components/Modal'
import ConfirmDialog from '@/components/ConfirmDialog'

type Plan = {
  id: string
  name: string
  price: number
  maxListings: number
  color: string
  badge: string
  active: boolean
  features: string[]
}

const initialPlans: Plan[] = [
  { id: 'free',    name: 'Free',    price: 0,    maxListings: 2,  color: 'border-slate-300', badge: 'bg-slate-100 text-slate-700', active: true,
    features: ['2 active listings', 'Basic search visibility', 'Standard support', 'Email notifications', 'Community access'] },
  { id: 'basic',   name: 'Basic',   price: 1500, maxListings: 5,  color: 'border-blue-300',  badge: 'bg-blue-100 text-blue-700',   active: true,
    features: ['5 active listings', 'Enhanced search visibility', 'Priority support', 'Email + SMS notifications', 'Featured in category', 'Analytics dashboard'] },
  { id: 'pro',     name: 'Pro',     price: 3000, maxListings: 15, color: 'border-purple-300', badge: 'bg-purple-100 text-purple-700', active: true,
    features: ['15 active listings', 'Top search placement', '24/7 priority support', 'All notifications', 'Featured listings (3/month)', 'Advanced analytics', 'Referral program access'] },
  { id: 'premium', name: 'Premium', price: 5000, maxListings: -1, color: 'border-amber-300',  badge: 'bg-amber-100 text-amber-700',  active: true,
    features: ['Unlimited listings', 'Guaranteed top placement', 'Dedicated support', 'All notifications', 'Unlimited featured listings', 'Full analytics suite', 'Early access to new features', 'Custom profile badge'] },
]

type EditForm = { name: string; price: string; maxListings: string; features: string[] }

function blankForm(): EditForm {
  return { name: '', price: '', maxListings: '', features: [''] }
}

function planToForm(p: Plan): EditForm {
  return { name: p.name, price: String(p.price), maxListings: p.maxListings === -1 ? '-1' : String(p.maxListings), features: [...p.features] }
}

export default function SubscriptionConfigPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [editForm, setEditForm] = useState<EditForm>(blankForm())
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState<EditForm>(blankForm())
  const [confirmToggle, setConfirmToggle] = useState<Plan | null>(null)

  function saveEdit() {
    if (!editingPlan) return
    setPlans(prev => prev.map(p => p.id === editingPlan.id
      ? { ...p, name: editForm.name, price: parseInt(editForm.price) || 0, maxListings: parseInt(editForm.maxListings) || 0, features: editForm.features.filter(f => f.trim()) }
      : p
    ))
    setEditingPlan(null)
  }

  function saveAdd() {
    const newPlan: Plan = {
      id: 'plan-' + Date.now(),
      name: addForm.name,
      price: parseInt(addForm.price) || 0,
      maxListings: parseInt(addForm.maxListings) || 0,
      color: 'border-slate-300',
      badge: 'bg-slate-100 text-slate-700',
      active: true,
      features: addForm.features.filter(f => f.trim()),
    }
    setPlans(prev => [...prev, newPlan])
    setAddOpen(false)
    setAddForm(blankForm())
  }

  function toggleActive(plan: Plan) {
    setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, active: !p.active } : p))
    setConfirmToggle(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Subscription Plans Configuration</h1>
          <p className="text-text-secondary text-sm mt-1">Define and manage subscription tiers</p>
        </div>
        <button onClick={() => { setAddOpen(true); setAddForm(blankForm()) }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
          <Plus size={16} /> Add New Plan
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {plans.map(plan => (
          <div key={plan.id} className={`rounded-xl border-2 ${plan.color} p-5 bg-white flex flex-col gap-4`}>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${plan.badge}`}>{plan.name}</span>
              <button
                onClick={() => setConfirmToggle(plan)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title={plan.active ? 'Deactivate' : 'Activate'}
              >
                {plan.active ? <ToggleRight size={22} className="text-success" /> : <ToggleLeft size={22} />}
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-text-primary">{plan.name}</h3>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {plan.price === 0 ? 'Free' : `J$${plan.price.toLocaleString()}`}
                {plan.price > 0 && <span className="text-sm font-normal text-text-secondary"> / month</span>}
              </p>
            </div>

            <div className="flex gap-2">
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">30 days</span>
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">
                {plan.maxListings === -1 ? 'Unlimited listings' : `${plan.maxListings} listings`}
              </span>
            </div>

            <hr className="border-border" />

            <ul className="space-y-2 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-text-primary">
                  <Check size={14} className="text-success shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => { setEditingPlan(plan); setEditForm(planToForm(plan)) }}
              className="w-full border border-border rounded-lg py-2 text-sm font-medium text-text-secondary hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
            >
              <Edit2 size={14} /> Edit Plan
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal open={!!editingPlan} onClose={() => setEditingPlan(null)} title={`Edit ${editingPlan?.name ?? ''} Plan`}>
        <PlanForm form={editForm} setForm={setEditForm} onSave={saveEdit} onCancel={() => setEditingPlan(null)} saveLabel="Save Changes" />
      </Modal>

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Create New Plan">
        <PlanForm form={addForm} setForm={setAddForm} onSave={saveAdd} onCancel={() => setAddOpen(false)} saveLabel="Create Plan" />
      </Modal>

      {/* Toggle Confirm */}
      <ConfirmDialog
        open={!!confirmToggle}
        onClose={() => setConfirmToggle(null)}
        onConfirm={() => confirmToggle && toggleActive(confirmToggle)}
        title={confirmToggle?.active ? 'Deactivate Plan' : 'Activate Plan'}
        message={`Are you sure you want to ${confirmToggle?.active ? 'deactivate' : 'activate'} the ${confirmToggle?.name} plan?`}
        confirmLabel={confirmToggle?.active ? 'Deactivate' : 'Activate'}
        danger={confirmToggle?.active}
      />
    </div>
  )
}

function PlanForm({ form, setForm, onSave, onCancel, saveLabel }: {
  form: EditForm
  setForm: (f: EditForm) => void
  onSave: () => void
  onCancel: () => void
  saveLabel: string
}) {
  function updateFeature(i: number, val: string) {
    const next = [...form.features]
    next[i] = val
    setForm({ ...form, features: next })
  }
  function removeFeature(i: number) {
    setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) })
  }
  function addFeature() {
    setForm({ ...form, features: [...form.features, ''] })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-text-secondary mb-1">Plan Name</label>
        <input className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Pro" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-text-secondary mb-1">Price (J$)</label>
          <input type="number" className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Max Listings (-1 = Unlimited)</label>
          <input type="number" className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" value={form.maxListings} onChange={e => setForm({ ...form, maxListings: e.target.value })} placeholder="5" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-text-secondary mb-1">Duration (days)</label>
        <div className="flex items-center gap-2">
          <input type="number" className="w-24 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none" defaultValue={30} />
          <span className="text-sm text-text-secondary">days</span>
        </div>
      </div>
      <div>
        <label className="block text-xs text-text-secondary mb-2">Features</label>
        <div className="space-y-2">
          {form.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" value={f} onChange={e => updateFeature(i, e.target.value)} placeholder="Feature description" />
              <button onClick={() => removeFeature(i)} className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button onClick={addFeature} className="text-primary text-sm hover:underline flex items-center gap-1">
            <Plus size={14} /> Add Feature
          </button>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-text-secondary hover:bg-slate-50 transition-colors">Cancel</button>
        <button onClick={onSave} className="flex-1 bg-primary text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-800 transition-colors">{saveLabel}</button>
      </div>
    </div>
  )
}
