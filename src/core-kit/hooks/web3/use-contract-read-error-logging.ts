import { useEffect } from 'react'

interface UseContractReadErrorLoggingProps {
  error: Error | null
  status: string
}

export const useContractReadErrorLogging = ({
  error,
  status,
}: UseContractReadErrorLoggingProps) => {
  useEffect(() => {
    if (error && status === 'failure') {
      console.warn(error?.message)
    }
  }, [error, status])
}
