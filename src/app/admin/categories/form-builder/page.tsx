'use client'

import { useState } from 'react'
import {
  GripVertical,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  Pencil,
  Trash2,
  FileText,
  X,
} from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'

// ── Types ──────────────────────────────────────────────────────────────────
type FieldType =
  | 'Text Input'
  | 'Textarea'
  | 'Dropdown'
  | 'Multi-select'
  | 'File Upload'
  | 'Google Maps Pin'
  | 'Price Range'
  | 'Number'

interface Field {
  id: string
  label: string
  type: FieldType
  required: boolean
  filterable: boolean
  filterLabel?: string
  options?: string[]
  displayOrder?: number
  helpText?: string
}

interface CategoryNode {
  id: string
  label: string
  icon?: string
  children?: CategoryNode[]
}

// ── Field type badge colours ───────────────────────────────────────────────
const typeBadge: Record<FieldType, string> = {
  'Text Input': 'bg-blue-100 text-blue-700',
  'Textarea': 'bg-purple-100 text-purple-700',
  'Dropdown': 'bg-orange-100 text-orange-700',
  'Multi-select': 'bg-teal-100 text-teal-700',
  'File Upload': 'bg-slate-100 text-slate-600',
  'Google Maps Pin': 'bg-green-100 text-green-700',
  'Price Range': 'bg-[#0F4C81]/10 text-[#0F4C81]',
  'Number': 'bg-yellow-100 text-yellow-700',
}

// ── Category tree data ─────────────────────────────────────────────────────
const TREE: CategoryNode[] = [
  { id: 'books', label: 'Books', icon: '📚' },
  {
    id: 'e-directory',
    label: 'E-Directory',
    icon: '📋',
    children: [
      { id: 'tutors', label: 'Tutors', icon: '🎓' },
      { id: 'schools', label: 'Schools', icon: '🏫' },
      { id: 'extracurricular', label: 'Extracurricular Clubs & Activities', icon: '🎭' },
      {
        id: 'support-services',
        label: 'Support Services & Communities',
        icon: '🤝',
        children: [
          { id: 'alumnae', label: 'Alumnae Associations' },
          { id: 'edu-assoc', label: 'Education Industry Associations' },
          { id: 'edu-assess', label: 'Educational Assessments & Counselling' },
          { id: 'gov-fin', label: 'Government and Financial Welfare' },
          { id: 'neurodiv', label: 'Neurodivergent Support' },
          { id: 'dieticians', label: 'Dieticians' },
          { id: 'community', label: 'Community & Non-Profit Programmes' },
        ],
      },
      {
        id: 'digital-resources',
        label: 'Digital Resources',
        icon: '💻',
        children: [
          { id: 'ebooks', label: 'E-Books, Digital Textbooks, Games, Past Papers' },
        ],
      },
      {
        id: 'elearning',
        label: 'E-Learning Platforms',
        icon: '🖥️',
        children: [
          { id: 'ai-tutors', label: 'AI Tutors, Online Learning Platforms' },
        ],
      },
      {
        id: 'transport',
        label: 'Student Transportation',
        icon: '🚌',
        children: [
          { id: 'public-transport', label: 'Public Passenger Services, Private Passenger Services' },
        ],
      },
      { id: 'memorabilia', label: 'School Memorabilia & Merchandise', icon: '🎽' },
      {
        id: 'student-housing',
        label: 'Student Housing',
        icon: '🏠',
        children: [
          { id: 'on-campus', label: 'On-Campus Residences' },
          { id: 'off-campus', label: 'Off-Campus Residences' },
        ],
      },
    ],
  },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'scholarships', label: 'Scholarships & Awards', icon: '🏆' },
]

// ── Seed field data ────────────────────────────────────────────────────────
const TUTORS_FIELDS: Field[] = [
  { id: '1', label: 'Full Name', type: 'Text Input', required: true, filterable: false },
  { id: '2', label: 'Subjects Taught', type: 'Multi-select', required: true, filterable: true },
  { id: '3', label: 'Education Level', type: 'Dropdown', required: true, filterable: true },
  { id: '4', label: 'Teaching Mode', type: 'Dropdown', required: true, filterable: true },
  { id: '5', label: 'Hourly Rate (J$)', type: 'Price Range', required: true, filterable: true },
  { id: '6', label: 'Location / Parish', type: 'Dropdown', required: true, filterable: true },
  { id: '7', label: 'Google Maps Pin', type: 'Google Maps Pin', required: false, filterable: false },
  { id: '8', label: 'Profile Photo', type: 'File Upload', required: true, filterable: false },
  { id: '9', label: 'Bio / Description', type: 'Textarea', required: true, filterable: false },
  { id: '10', label: 'Years of Experience', type: 'Number', required: false, filterable: true },
]

const HOUSING_FIELDS: Field[] = [
  { id: '1', label: 'Property Name', type: 'Text Input', required: true, filterable: false },
  { id: '2', label: 'Housing Type', type: 'Dropdown', required: true, filterable: true },
  { id: '3', label: 'Monthly Rent (J$)', type: 'Price Range', required: true, filterable: true },
  { id: '4', label: 'Location / Parish', type: 'Dropdown', required: true, filterable: true },
  { id: '5', label: 'Google Maps Pin', type: 'Google Maps Pin', required: false, filterable: false },
  { id: '6', label: 'Amenities', type: 'Multi-select', required: false, filterable: true },
  { id: '7', label: 'Available From', type: 'Text Input', required: true, filterable: false },
  { id: '8', label: 'Property Photos', type: 'File Upload', required: true, filterable: false },
  { id: '9', label: 'Contact Number', type: 'Text Input', required: true, filterable: false },
  { id: '10', label: 'Description', type: 'Textarea', required: false, filterable: false },
]

const INITIAL_FIELDS: Record<string, Field[]> = {
  tutors: TUTORS_FIELDS,
  'on-campus': HOUSING_FIELDS,
  'off-campus': HOUSING_FIELDS,
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

// ── Field modal ────────────────────────────────────────────────────────────
interface FieldModalProps {
  open: boolean
  editingField: Field | null
  onClose: () => void
  onSave: (f: Omit<Field, 'id'>) => void
}

function FieldModal({ open, editingField, onClose, onSave }: FieldModalProps) {
  const [label, setLabel] = useState(editingField?.label ?? '')
  const [type, setType] = useState<FieldType>(editingField?.type ?? 'Text Input')
  const [options, setOptions] = useState<string[]>(editingField?.options ?? [''])
  const [required, setRequired] = useState(editingField?.required ?? true)
  const [filterable, setFilterable] = useState(editingField?.filterable ?? false)
  const [filterLabel, setFilterLabel] = useState(editingField?.filterLabel ?? '')
  const [displayOrder, setDisplayOrder] = useState(editingField?.displayOrder ?? 0)
  const [helpText, setHelpText] = useState(editingField?.helpText ?? '')

  if (!open) return null

  const showOptions = type === 'Dropdown' || type === 'Multi-select'

  function handleSave() {
    if (!label.trim()) return
    onSave({
      label: label.trim(),
      type,
      options: showOptions ? options.filter(o => o.trim()) : undefined,
      required,
      filterable,
      filterLabel: filterable ? filterLabel : undefined,
      displayOrder,
      helpText: helpText || undefined,
    })
    onClose()
  }

  const ALL_TYPES: FieldType[] = [
    'Text Input', 'Textarea', 'Dropdown', 'Multi-select',
    'File Upload', 'Google Maps Pin', 'Price Range', 'Number',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text-primary">
            {editingField ? `Edit Field: ${editingField.label}` : 'Add New Field'}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Field Label</label>
            <input
              className="input w-full"
              placeholder="e.g. Subjects Taught"
              value={label}
              onChange={e => setLabel(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Field Type</label>
            <select
              className="input w-full"
              value={type}
              onChange={e => setType(e.target.value as FieldType)}
            >
              {ALL_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {showOptions && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Options</label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="input flex-1"
                      value={opt}
                      placeholder={`Option ${i + 1}`}
                      onChange={e => {
                        const next = [...options]
                        next[i] = e.target.value
                        setOptions(next)
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
                      className="p-2 rounded hover:bg-red-50 text-[#EF4444]"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setOptions([...options, ''])}
                className="mt-2 text-sm text-[#0F4C81] hover:underline"
              >
                + Add Option
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">Required</label>
            <Toggle value={required} onChange={setRequired} />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-primary">Filterable</label>
              <Toggle value={filterable} onChange={setFilterable} />
            </div>
            {filterable && (
              <div className="mt-2">
                <input
                  className="input w-full"
                  placeholder="Filter label (e.g. Location)"
                  value={filterLabel}
                  onChange={e => setFilterLabel(e.target.value)}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Display Order</label>
            <input
              type="number"
              className="input w-full"
              value={displayOrder}
              onChange={e => setDisplayOrder(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Help Text <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              className="input w-full"
              placeholder="Helpful hint shown below the field"
              value={helpText}
              onChange={e => setHelpText(e.target.value)}
            />
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
            Save Field
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Tree node component ────────────────────────────────────────────────────
function TreeNode({
  node,
  depth,
  selected,
  expanded,
  onSelect,
  onToggle,
  searchQuery,
}: {
  node: CategoryNode
  depth: number
  selected: string
  expanded: Set<string>
  onSelect: (id: string) => void
  onToggle: (id: string) => void
  searchQuery: string
}) {
  const hasChildren = !!node.children?.length
  const isExpanded = expanded.has(node.id)
  const isSelected = selected === node.id

  function matchesSearch(n: CategoryNode): boolean {
    if (n.label.toLowerCase().includes(searchQuery.toLowerCase())) return true
    return n.children?.some(matchesSearch) ?? false
  }

  if (searchQuery && !matchesSearch(node)) return null

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-1.5 pr-3 rounded-lg cursor-pointer text-sm transition-colors ${
          isSelected ? 'bg-[#0F4C81] text-white' : 'hover:bg-slate-100 text-text-primary'
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={() => onSelect(node.id)}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onToggle(node.id) }}
            className={`p-0.5 rounded shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}
        {node.icon && <span className="text-base leading-none shrink-0">{node.icon}</span>}
        <span className="truncate">{node.label}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selected={selected}
              expanded={expanded}
              onSelect={onSelect}
              onToggle={onToggle}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function FormBuilderPage() {
  const [selected, setSelected] = useState('tutors')
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['e-directory']))
  const [search, setSearch] = useState('')
  const [fields, setFields] = useState<Record<string, Field[]>>(INITIAL_FIELDS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingField, setEditingField] = useState<Field | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ catId: string; fieldId: string } | null>(null)

  function findLabel(nodes: CategoryNode[], id: string): string {
    for (const n of nodes) {
      if (n.id === id) return n.label
      if (n.children) {
        const r = findLabel(n.children, id)
        if (r) return r
      }
    }
    return id
  }

  const selectedLabel = findLabel(TREE, selected)
  const currentFields = fields[selected] ?? []

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function openAdd() {
    setEditingField(null)
    setModalOpen(true)
  }

  function openEdit(f: Field) {
    setEditingField(f)
    setModalOpen(true)
  }

  function saveField(data: Omit<Field, 'id'>) {
    setFields(prev => {
      const existing = prev[selected] ?? []
      if (editingField) {
        return {
          ...prev,
          [selected]: existing.map(f => f.id === editingField.id ? { ...data, id: editingField.id } : f),
        }
      }
      return { ...prev, [selected]: [...existing, { ...data, id: Date.now().toString() }] }
    })
  }

  function confirmDelete() {
    if (!deleteTarget) return
    setFields(prev => ({
      ...prev,
      [deleteTarget.catId]: (prev[deleteTarget.catId] ?? []).filter(f => f.id !== deleteTarget.fieldId),
    }))
    setDeleteTarget(null)
  }

  function toggleFieldProp(fieldId: string, prop: 'required' | 'filterable') {
    setFields(prev => ({
      ...prev,
      [selected]: (prev[selected] ?? []).map(f => f.id === fieldId ? { ...f, [prop]: !f[prop] } : f),
    }))
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* ── Left panel ── */}
      <div className="w-[300px] shrink-0 border-r border-border overflow-y-auto bg-white">
        <div className="p-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary mb-3">Categories</h2>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input w-full pl-8"
              placeholder="Search categories…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="p-2">
          {TREE.map(node => (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              selected={selected}
              expanded={expanded}
              onSelect={setSelected}
              onToggle={toggleExpand}
              searchQuery={search}
            />
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Fields for: {selectedLabel}</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Define what information sellers must fill when creating a listing in this category
            </p>
          </div>
          {currentFields.length > 0 && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F97316] text-white text-sm font-medium hover:bg-orange-500 transition-colors shrink-0"
            >
              <Plus size={16} />
              Add New Field
            </button>
          )}
        </div>

        {currentFields.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100%-80px)] gap-3 text-center">
            <FileText size={48} className="text-slate-300" />
            <p className="text-lg font-semibold text-text-primary">No fields defined yet</p>
            <p className="text-sm text-text-secondary max-w-xs">
              Add your first field to define what information sellers provide for this category
            </p>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F97316] text-white text-sm font-medium hover:bg-orange-500 transition-colors mt-1"
            >
              <Plus size={16} />
              Add First Field
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {currentFields.map(field => (
              <div
                key={field.id}
                className="bg-white border border-border rounded-xl p-4 flex items-center gap-3 hover:border-slate-300 transition-colors"
              >
                <GripVertical size={18} className="text-slate-300 shrink-0 cursor-grab" />
                <span className="font-medium text-text-primary text-sm flex-1 min-w-0 truncate">
                  {field.label}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${typeBadge[field.type]}`}>
                  {field.type}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary shrink-0">
                  <span>Required</span>
                  <Toggle value={field.required} onChange={() => toggleFieldProp(field.id, 'required')} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary shrink-0">
                  <span>Filterable</span>
                  <Toggle value={field.filterable} onChange={() => toggleFieldProp(field.id, 'filterable')} />
                </div>
                <button
                  onClick={() => openEdit(field)}
                  className="p-2 rounded-lg hover:bg-blue-50 text-[#0F4C81] transition-colors shrink-0"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteTarget({ catId: selected, fieldId: field.id })}
                  className="p-2 rounded-lg hover:bg-red-50 text-[#EF4444] transition-colors shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <FieldModal
        key={editingField?.id ?? 'new'}
        open={modalOpen}
        editingField={editingField}
        onClose={() => setModalOpen(false)}
        onSave={saveField}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Field?"
        message="This will remove the field from all future listings in this category. Existing listing data will not be affected."
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
