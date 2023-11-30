import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import { useTokenAllowance } from 'hooks/web3'
import type { Address, ChainId } from 'types/web3.types'

interface UseCanSpendParams {
  rawAmountToSpend: string
  tokenAddress: Address
  ownerAddress: Address
  spenderAddress: Address
  chainId: ChainId
  skip?: boolean
}

export const useCanSpend = ({
  rawAmountToSpend,
  tokenAddress,
  ownerAddress,
  spenderAddress,
  chainId,
  skip = false,
}: UseCanSpendParams) => {
  const { data: remainingAllowance } = useTokenAllowance(
    tokenAddress,
    ownerAddress,
    spenderAddress,
    chainId,
    skip,
  )

  return useMemo(() => {
    if (skip) {
      return true
    }

    if (!remainingAllowance || remainingAllowance === BigInt(0)) {
      return false
    }

    if (!rawAmountToSpend || rawAmountToSpend === '0') {
      return true
    }

    return new BigNumber(remainingAllowance.toString()).gte(rawAmountToSpend)
  }, [rawAmountToSpend, remainingAllowance, skip])
}
