import { useToast as usePrimeToast } from 'primevue/usetoast'

export interface ToastOptions {
  title?: string
  message: string
  type?: 'success' | 'info' | 'warn' | 'error'
  duration?: number
}

export function useToast() {
  const toast = usePrimeToast()

  const showToast = (options: ToastOptions) => {
    const { title, message, type = 'info', duration = 3000 } = options
    
    toast.add({
      severity: type,
      summary: title || getDefaultTitle(type),
      detail: message,
      life: duration
    })
  }

  const showSuccess = (message: string, title?: string) => {
    showToast({ message, title, type: 'success' })
  }

  const showError = (message: string, title?: string) => {
    showToast({ message, title, type: 'error' })
  }

  const showWarning = (message: string, title?: string) => {
    showToast({ message, title, type: 'warn' })
  }

  const showInfo = (message: string, title?: string) => {
    showToast({ message, title, type: 'info' })
  }

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

function getDefaultTitle(type: string): string {
  const titles = {
    success: 'Success',
    error: 'Error',
    warn: 'Warning',
    info: 'Information'
  }
  return titles[type as keyof typeof titles] || 'Notification'
}