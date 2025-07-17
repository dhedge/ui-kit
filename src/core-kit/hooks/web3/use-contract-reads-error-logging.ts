import { useEffect } from 'react'

export interface UseContractReadsData {
  error?: Error
  status: string
}

export const useContractReadsErrorLogging = (data?: UseContractReadsData[]) => {
  useEffect(() => {
    if (data)
      data.forEach(({ error, status }) => {
        if (status === 'failure') {
          console.warn(error?.message)
        }
      })
  }, [data])
}
