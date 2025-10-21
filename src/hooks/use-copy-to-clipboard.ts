import { useState, useCallback } from 'react'
import { toast } from 'sonner'

/**
 * Custom hook for copy-to-clipboard functionality with toast notifications
 * @param resetDelay - Time in ms before resetting copied state (default: 2000)
 * @returns Object with copied state and copy function
 */
export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string, successMessage = 'Copied to clipboard') => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success(successMessage)
        setTimeout(() => setCopied(false), resetDelay)
      } catch (error) {
        toast.error('Failed to copy to clipboard')
        console.error('Copy to clipboard failed:', error)
      }
    },
    [resetDelay]
  )

  return { copied, copy }
}
