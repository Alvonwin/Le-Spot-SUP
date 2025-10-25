import { useState } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([])

  const toast = ({ title, description, variant = 'default' }: any) => {
    console.log('Toast:', title, description, variant)
  }

  return { toast, toasts }
}