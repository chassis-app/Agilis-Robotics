import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { registerToastHandler, toastDurations, type ToastPayload, type ToastType } from '@/components/ui/toast'

interface Toast extends ToastPayload {
  id: string
}

const icons: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles: Record<ToastType, string> = {
  success: 'border-success-500 bg-white',
  error: 'border-danger-500 bg-white',
  warning: 'border-warning-500 bg-white',
  info: 'border-info-500 bg-white',
}

const iconStyles: Record<ToastType, string> = {
  success: 'text-success-500',
  error: 'text-danger-500',
  warning: 'text-warning-500',
  info: 'text-info-500',
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const add = useCallback((t: ToastPayload) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...t, id }])
  }, [])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    return registerToastHandler(add)
  }, [add])

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[360px]">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => remove(t.id)} />
      ))}
    </div>,
    document.body,
  )
}

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon = icons[t.type]

  useEffect(() => {
    const dur = t.duration ?? toastDurations[t.type]
    if (dur > 0) {
      const timer = setTimeout(onDismiss, dur)
      return () => clearTimeout(timer)
    }
  }, [t, onDismiss])

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-md animate-in slide-in-from-right duration-200',
        styles[t.type],
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', iconStyles[t.type])} />
      <p className="text-sm text-neutral-700 flex-1">{t.message}</p>
      <button onClick={onDismiss} className="text-neutral-400 hover:text-neutral-600 shrink-0">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
