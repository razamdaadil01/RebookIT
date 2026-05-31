'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'

// ── Types ──────────────────────────────────────────────────────────────────
interface Subcategory {
  id: string
  name: string
  slug: string
  listings: number
  status: boolean
}

interface ParentCategory {
  id: string
  label: string
  icon: string
}

// ── Parent categories ──────────────────────────────────────────────────────
const PARENTS: ParentCategory[] = [
  { id: 'books', label: 'Books', icon: '📚' },
  { id: 'e-directory', label: 'E-Directory', icon: '📋' },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'scholarships', label: 'Scholarships & Awards', icon: '🏆' },
]

// ── Seed subcategory data ──────────────────────────────────────────────────
const INITIAL_SUBCATS: Record<string, Subcategory[]> = {
  'e-directory': [
    { id: '1', name: 'Tutors', slug: 'tutors', listings: 142, status: true },
    { id: '2', name: 'Schools', slug: 'schools', listings: 38, status: true },
    { id: '3', name: 'Extracurricular Clubs & Activities', slug: 'extracurricular-clubs', listings: 21, status: true },
    { id: '4', name: 'Support Services & Communities', slug: 'support-services', listings: 15, status: true },
    { id: '5', name: 'Digital Resources', slug: 'digital-resources', listings: 29, status: true },
    { id: '6', name: 'E-Learning Platforms', slug: 'e-learning-platforms', listings: 18, status: false },
    { id: '7', name: 'Student Transportation', slug: 'student-transportation', listings: 11, status: true },
    { id: '8', name: 'School Memorabilia & Merchandise', slug: 'school-memorabilia', listings: 7, status: true },
    { id: '9', name: 'Student Housing', slug: 'student-housing', listings: 33, status: true },
  ],
  events: [
    { id: '1', name: 'School Events', slug: 'school-events', listings: 45, status: true },
    { id: '2', name: 'Community Events', slug: 'community-events', listings: 22, status: true },
  ],
  scholarships: [
    { id: '1', name: 'Government Scholarships', slug: 'govt-scholarships', listings: 19, status: true },
    { id: '2', name: 'Private Scholarships', slug: 'private-scholarships', listings: 12, status: true },
  ],
  books: [],
}

// ── Slug generator ─────────────────────────────────────────────────────────
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── Toggle switch ──────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${value ? 'bg-green-500' : 'bg-slate-300'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-[18px]' : 'translate-x-[3px]'}`}
      />
    </button>
  )
}

// ── Add/Edit modal ─────────────────────────────────────────────────────────
interface SubcatModalProps {
  open: boolean
  editingSub: Subcategory | null
  currentParentId: string
  onClose: () => void
  onSave: (data: Omit<Subcategory, 'id' | 'listings'>, parentId: string) => void
}

function SubcatModal({ open, editingSub, currentParentId, onClose, onSave }: SubcatModalProps) {
  const [name, setName] = useState(editingSub?.name ?? '')
  const [slug, setSlug] = useState(editingSub?.slug ?? '')
  const [parentId, setParentId] = useState(currentParentId)
  const [status, setStatus] = useState(editingSub?.status ?? true)
  const [slugEdited, setSlugEdited] = useState(false)

  if (!open) return null

  function handleNameChange(v: string) {
    setName(v)
    if (!slugEdited) setSlug(toSlug(v))
  }

  function handleSlugChange(v: string) {
    setSlug(v)
    setSlugEdited(true)
  }

  function handleSave() {
    if (!name.trim()) return
    onSave({ name: name.trim(), slug: slug || toSlug(name), status }, parentId)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text-primary">
            {editingSub ? 'Edit Subcategory' : 'Add Subcategory'}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Subcategory Name</label>
            <input
              className="input w-full"
              placeholder="e.g. Tutors"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Slug</label>
            <input
              className="input w-full"
              placeholder="e.g. tutors"
              value={slug}
              onChange={e => handleSlugChange(e.target.value)}
            />
            {slug && (
              <p className="text-xs text-slate-400 mt-1">Preview: <code className="bg-slate-100 px-1 rounded">{slug}</code></p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Parent Category</label>
            <select
              className="input w-full"
              value={parentId}
              onChange={e => setParentId(e.target.value)}
            >
              {PARENTS.map(p => (
                <option key={p.id} value={p.id}>{p.icon} {p.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">Status</label>
            <Toggle value={status} onChange={setStatus} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 btn-primary text-sm font-medium"
          >
            Save Subcategory
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function SubcategoriesPage() {
  const [selectedParent, setSelectedParent] = useState('e-directory')
  const [subcats, setSubcats] = useState<Record<string, Subcategory[]>>(INITIAL_SUBCATS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSub, setEditingSub] = useState<Subcategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ parentId: string; subId: string } | null>(null)

  const parentLabel = PARENTS.find(p => p.id === selectedParent)?.label ?? selectedParent
  const currentSubs = subcats[selectedParent] ?? []

  function openAdd() {
    setEditingSub(null)
    setModalOpen(true)
  }

  function openEdit(sub: Subcategory) {
    setEditingSub(sub)
    setModalOpen(true)
  }

  function saveSub(data: Omit<Subcategory, 'id' | 'listings'>, parentId: string) {
    setSubcats(prev => {
      if (editingSub) {
        // If parent changed, move between lists
        if (parentId !== selectedParent) {
          const oldList = (prev[selectedParent] ?? []).filter(s => s.id !== editingSub.id)
          const newList = [...(prev[parentId] ?? []), { ...data, id: editingSub.id, listings: editingSub.listings }]
          return { ...prev, [selectedParent]: oldList, [parentId]: newList }
        }
        return {
          ...prev,
          [parentId]: (prev[parentId] ?? []).map(s =>
            s.id === editingSub.id ? { ...s, ...data } : s
          ),
        }
      }
      const id = Date.now().toString()
      return { ...prev, [parentId]: [...(prev[parentId] ?? []), { ...data, id, listings: 0 }] }
    })
  }

  function confirmDelete() {
    if (!deleteTarget) return
    setSubcats(prev => ({
      ...prev,
      [deleteTarget.parentId]: (prev[deleteTarget.parentId] ?? []).filter(s => s.id !== deleteTarget.subId),
    }))
    setDeleteTarget(null)
  }

  function toggleStatus(subId: string) {
    setSubcats(prev => ({
      ...prev,
      [selectedParent]: (prev[selectedParent] ?? []).map(s =>
        s.id === subId ? { ...s, status: !s.status } : s
      ),
    }))
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* ── Left panel ── */}
      <div className="w-[300px] shrink-0 border-r border-border overflow-y-auto bg-white">
        <div className="p-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">Categories</h2>
        </div>
        <div className="p-2">
          {PARENTS.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedParent(p.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                selectedParent === p.id
                  ? 'bg-[#0F4C81] text-white'
                  : 'hover:bg-slate-100 text-text-primary'
              }`}
            >
              <span className="text-base leading-none">{p.icon}</span>
              <span>{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Subcategories of {parentLabel}</h1>
            <p className="text-sm text-text-secondary mt-0.5">Manage subcategories and their settings</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F97316] text-white text-sm font-medium hover:bg-orange-500 transition-colors shrink-0"
          >
            <Plus size={16} />
            Add Subcategory
          </button>
        </div>

        {currentSubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100%-80px)] gap-3 text-center">
            <p className="text-lg font-semibold text-text-primary">No subcategories</p>
            <p className="text-sm text-text-secondary">Add a subcategory to get started</p>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F97316] text-white text-sm font-medium hover:bg-orange-500 transition-colors mt-1"
            >
              <Plus size={16} />
              Add Subcategory
            </button>
          </div>
        ) : (
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-slate-50">
                  <th className="text-left px-4 py-3 font-semibold text-text-primary">Subcategory Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-primary">Slug</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-primary">Listings</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-primary">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSubs.map((sub, i) => (
                  <tr key={sub.id} className={`border-b border-border last:border-0 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : ''}`}>
                    <td className="px-4 py-3 font-medium text-text-primary">{sub.name}</td>
                    <td className="px-4 py-3">
                      <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-xs">{sub.slug}</code>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{sub.listings}</td>
                    <td className="px-4 py-3">
                      <Toggle value={sub.status} onChange={() => toggleStatus(sub.id)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(sub)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-[#0F4C81] transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ parentId: selectedParent, subId: sub.id })}
                          className="p-2 rounded-lg hover:bg-red-50 text-[#EF4444] transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <SubcatModal
        key={editingSub?.id ?? 'new'}
        open={modalOpen}
        editingSub={editingSub}
        currentParentId={selectedParent}
        onClose={() => setModalOpen(false)}
        onSave={saveSub}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Subcategory?"
        message="This will permanently delete this subcategory and may affect existing listings."
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
