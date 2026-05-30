'use client'

import { useState } from 'react'
import Modal from '@/components/Modal'
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown, ToggleLeft, ToggleRight } from 'lucide-react'

type Category = {
  id: string
  icon: string
  name: string
  count: number
  active: boolean
  children?: Category[]
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', icon: '📱', name: 'Electronics', count: 847, active: true, children: [
    { id: 'c1a', icon: '📱', name: 'Phones & Tablets', count: 312, active: true },
    { id: 'c1b', icon: '💻', name: 'Computers', count: 198, active: true },
    { id: 'c1c', icon: '📺', name: 'TVs & Audio', count: 245, active: true },
    { id: 'c1d', icon: '📷', name: 'Cameras', count: 92, active: true },
  ]},
  { id: 'c2', icon: '🚗', name: 'Vehicles', count: 523, active: true, children: [
    { id: 'c2a', icon: '🚙', name: 'Cars', count: 312, active: true },
    { id: 'c2b', icon: '🏍️', name: 'Motorcycles', count: 87, active: true },
    { id: 'c2c', icon: '⛵', name: 'Boats', count: 45, active: true },
    { id: 'c2d', icon: '🔧', name: 'Spare Parts', count: 79, active: true },
  ]},
  { id: 'c3', icon: '🛋️', name: 'Furniture', count: 412, active: true, children: [
    { id: 'c3a', icon: '🛋️', name: 'Living Room', count: 134, active: true },
    { id: 'c3b', icon: '🛏️', name: 'Bedroom', count: 98, active: true },
    { id: 'c3c', icon: '🪑', name: 'Office', count: 87, active: true },
    { id: 'c3d', icon: '🍽️', name: 'Kitchen', count: 93, active: true },
  ]},
  { id: 'c4', icon: '👗', name: 'Fashion', count: 634, active: true, children: [
    { id: 'c4a', icon: '👔', name: "Men's", count: 198, active: true },
    { id: 'c4b', icon: '👗', name: "Women's", count: 267, active: true },
    { id: 'c4c', icon: '👕', name: "Kids'", count: 112, active: true },
    { id: 'c4d', icon: '👜', name: 'Accessories', count: 57, active: true },
  ]},
  { id: 'c5', icon: '🏠', name: 'Real Estate', count: 89, active: true, children: [
    { id: 'c5a', icon: '🏢', name: 'Apartments', count: 34, active: true },
    { id: 'c5b', icon: '🏡', name: 'Houses', count: 29, active: true },
    { id: 'c5c', icon: '🌱', name: 'Land', count: 15, active: true },
    { id: 'c5d', icon: '🏪', name: 'Commercial', count: 11, active: true },
  ]},
  { id: 'c6', icon: '🛠️', name: 'Services', count: 156, active: true, children: [
    { id: 'c6a', icon: '🧹', name: 'Cleaning', count: 42, active: true },
    { id: 'c6b', icon: '📚', name: 'Tutoring', count: 38, active: true },
    { id: 'c6c', icon: '🔧', name: 'Repairs', count: 51, active: true },
    { id: 'c6d', icon: '💄', name: 'Beauty', count: 25, active: true },
  ]},
  { id: 'c7', icon: '📚', name: 'Books & Education', count: 234, active: true },
  { id: 'c8', icon: '⚽', name: 'Sports & Outdoors', count: 178, active: false },
  { id: 'c9', icon: '🤝', name: 'Support Services & Communities', count: 64, active: true, children: [
    { id: 'c9a', icon: '🎓', name: 'Alumnae Associations', count: 12, active: true },
    { id: 'c9b', icon: '🏫', name: 'Education Industry Associations', count: 8, active: true },
    { id: 'c9c', icon: '📋', name: 'Educational Assessments & Counselling Services', count: 11, active: true },
    { id: 'c9d', icon: '🏛️', name: 'Government and Financial Welfare', count: 9, active: true },
    { id: 'c9e', icon: '🧠', name: 'Neurodivergent Support & Specialised Learning', count: 7, active: true },
    { id: 'c9f', icon: '🥗', name: 'Dieticians', count: 6, active: true },
    { id: 'c9g', icon: '🌍', name: 'Community & Non-Profit Programmes', count: 11, active: true },
  ]},
  { id: 'c10', icon: '💾', name: 'Digital Resources', count: 198, active: true, children: [
    { id: 'c10a', icon: '📖', name: 'E-Books', count: 74, active: true },
    { id: 'c10b', icon: '📗', name: 'Digital Textbooks', count: 62, active: true },
    { id: 'c10c', icon: '🎮', name: 'Games', count: 41, active: true },
    { id: 'c10d', icon: '📝', name: 'Past Papers', count: 21, active: true },
  ]},
  { id: 'c11', icon: '🖥️', name: 'E-Learning Platforms', count: 43, active: true, children: [
    { id: 'c11a', icon: '🤖', name: 'AI Tutors', count: 18, active: true },
    { id: 'c11b', icon: '🌐', name: 'Online Learning Platforms', count: 25, active: true },
  ]},
  { id: 'c12', icon: '🚌', name: 'Student Transportation', count: 87, active: true, children: [
    { id: 'c12a', icon: '🚍', name: 'Public Passenger Services', count: 52, active: true },
    { id: 'c12b', icon: '🚗', name: 'Private Passenger Services', count: 35, active: true },
  ]},
  { id: 'c13', icon: '🎽', name: 'School Memorabilia & Merchandise', count: 56, active: true },
  { id: 'c14', icon: '🏠', name: 'Student Housing', count: 72, active: true, children: [
    { id: 'c14a', icon: '🏢', name: 'On-Campus Residences', count: 31, active: true },
    { id: 'c14b', icon: '🏡', name: 'Off-Campus Residences', count: 41, active: true },
  ]},
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['c1']))
  const [modalOpen, setModalOpen] = useState(false)
  const [newCat, setNewCat] = useState({ icon: '📦', name: '', parent: '' })

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleActive = (id: string) => {
    setCategories(prev => prev.map(c => {
      if (c.id === id) return { ...c, active: !c.active }
      if (c.children) return { ...c, children: c.children.map(ch => ch.id === id ? { ...ch, active: !ch.active } : ch) }
      return c
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Category Management</h1>
          <p className="text-sm text-text-secondary mt-1">Organize and manage marketplace categories</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-3 bg-slate-50 border-b border-border text-xs font-semibold text-text-secondary uppercase tracking-wide">
          <div className="col-span-5">Category</div>
          <div className="col-span-2 text-center">Listings</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {categories.map(cat => (
          <div key={cat.id}>
            <div className="grid grid-cols-12 px-4 py-3 border-b border-border hover:bg-slate-50/50 items-center">
              <div className="col-span-5 flex items-center gap-2">
                <button onClick={() => cat.children && toggleExpand(cat.id)}
                  className={`text-slate-400 ${cat.children ? 'hover:text-slate-600 cursor-pointer' : 'invisible'}`}>
                  {expanded.has(cat.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                <span className="text-lg">{cat.icon}</span>
                <span className="font-medium text-text-primary text-sm">{cat.name}</span>
                {cat.children && <span className="text-xs text-text-secondary bg-slate-100 px-1.5 py-0.5 rounded-full">{cat.children.length} sub</span>}
              </div>
              <div className="col-span-2 text-center text-sm text-text-secondary">{cat.count.toLocaleString()}</div>
              <div className="col-span-2 flex justify-center">
                <button onClick={() => toggleActive(cat.id)} className={`transition-colors ${cat.active ? 'text-success' : 'text-slate-300'}`}>
                  {cat.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </button>
              </div>
              <div className="col-span-3 flex justify-end gap-1">
                <button className="p-1.5 rounded-md text-primary hover:bg-primary/10 transition-colors"><Edit2 size={14} /></button>
                <button className="p-1.5 rounded-md text-danger hover:bg-danger/10 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>

            {expanded.has(cat.id) && cat.children?.map(child => (
              <div key={child.id} className="grid grid-cols-12 px-4 py-2.5 border-b border-border bg-slate-50/30 hover:bg-slate-50 items-center">
                <div className="col-span-5 flex items-center gap-2 pl-8">
                  <span className="text-base">{child.icon}</span>
                  <span className="text-sm text-text-secondary">{child.name}</span>
                </div>
                <div className="col-span-2 text-center text-sm text-text-secondary">{child.count.toLocaleString()}</div>
                <div className="col-span-2 flex justify-center">
                  <button onClick={() => toggleActive(child.id)} className={`transition-colors ${child.active ? 'text-success' : 'text-slate-300'}`}>
                    {child.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                </div>
                <div className="col-span-3 flex justify-end gap-1">
                  <button className="p-1.5 rounded-md text-primary hover:bg-primary/10 transition-colors"><Edit2 size={13} /></button>
                  <button className="p-1.5 rounded-md text-danger hover:bg-danger/10 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Category">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">Emoji Icon</label>
            <input value={newCat.icon} onChange={e => setNewCat(p => ({ ...p, icon: e.target.value }))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="📦" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">Category Name</label>
            <input value={newCat.name} onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Musical Instruments" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">Parent Category (optional)</label>
            <select value={newCat.parent} onChange={e => setNewCat(p => ({ ...p, parent: e.target.value }))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option value="">None (top-level category)</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-text-secondary hover:bg-slate-50">Cancel</button>
            <button onClick={() => setModalOpen(false)} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-800">Add Category</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
