export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastPayload {
  type: ToastType
  message: string
  duration?: number
}

export const toastDurations: Record<ToastType, number> = {
  success: 5000,
  error: 0,
  warning: 8000,
  info: 5000,
}

let addToast: (toast: ToastPayload) => void = () => {}

export function registerToastHandler(handler: (toast: ToastPayload) => void) {
  addToast = handler
  return () => {
    addToast = () => {}
  }
}

export function toast(type: ToastType, message: string) {
  addToast({ type, message, duration: toastDurations[type] })
}
