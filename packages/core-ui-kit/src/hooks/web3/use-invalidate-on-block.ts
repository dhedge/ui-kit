import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { UseReadContractsReturnType } from 'wagmi'
import { useBlockNumber } from 'wagmi'

import { SHORTEN_POLLING_INTERVAL } from 'const'

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
    query: {
      refetchInterval: SHORTEN_POLLING_INTERVAL,
    },
  })

  useEffect(() => {
    if (watch) {
      queryClient.refetchQueries({ queryKey, stale: true })
    }
    // https://wagmi.sh/react/guides/tanstack-query#example-watching-a-users-balance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, blockNumber])
}
