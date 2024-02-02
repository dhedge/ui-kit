import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { UseReadContractsReturnType } from 'wagmi'
import { useBlockNumber } from 'wagmi'

import { DEFAULT_POLLING_INTERVAL } from 'const'

export interface InvalidateOnBlockConfig {
  queryKey: UseReadContractsReturnType['queryKey']
  watch?: boolean
}

export const useInvalidateOnBlock = ({
  queryKey,
  watch = true,
}: InvalidateOnBlockConfig) => {
  const queryClient = useQueryClient()

  const { data: blockNumber } = useBlockNumber({
    watch: {
      enabled: watch,
      pollingInterval: DEFAULT_POLLING_INTERVAL,
    },
  })

  useEffect(() => {
    if (watch) {
      queryClient.invalidateQueries({ queryKey })
    }
  }, [watch, blockNumber, queryClient, queryKey])
}
