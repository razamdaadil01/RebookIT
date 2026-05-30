'use client'

import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
}

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = true }: ConfirmDialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-danger/10' : 'bg-primary/10'}`}>
          <AlertTriangle size={22} className={danger ? 'text-danger' : 'text-primary'} />
        </div>
        <h3 className="text-base font-semibold text-text-primary text-center mb-2">{title}</h3>
        <p className="text-sm text-text-secondary text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors
              ${danger ? 'bg-danger hover:bg-red-600' : 'bg-primary hover:bg-blue-800'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
