import BigNumber from 'bignumber.js'

import { useMemo } from 'react'

import { usePoolComposition, usePoolDynamicContractData } from 'hooks/pool'
import type {
  PoolComposition,
  PoolCompositionWithFraction,
} from 'types/pool.types'
import type { ChainId, PoolContractCallParams } from 'types/web3.types'
import {
  formatToUsd,
  getConventionalTokenPriceDecimals,
  getPoolFraction,
  shiftBy,
} from 'utils'

interface PoolCompositionParams {
  composition: PoolComposition[]
  assetAmount: string
  totalSupply: string
}

type PoolCompositionWithFractionParams = PoolContractCallParams & {
  assetAmount: string
  chainId: ChainId
}

export const formatPoolComposition = ({
  composition,
  assetAmount,
  totalSupply,
}: PoolCompositionParams): PoolCompositionWithFraction[] =>
  composition
    .map((asset) => {
      const fraction = getPoolFraction(
        asset.amount,
        assetAmount,
        totalSupply,
        asset.precision,
      )
      const fractionUsd = getPoolFraction(
        new BigNumber(asset.rate)
          .multipliedBy(asset.amount)
          .shiftedBy(-asset.precision)
          .toFixed(),
        assetAmount,
        totalSupply,
      )
      return {
        ...asset,
        fraction: fraction.toFixed(getConventionalTokenPriceDecimals(fraction)),
        fractionUsd: formatToUsd({ value: fractionUsd }),
      }
    })
    .filter(({ amount }) => amount !== '0')

export const usePoolCompositionWithFraction = ({
  address,
  assetAmount,
  chainId,
}: PoolCompositionWithFractionParams) => {
  const poolComposition = usePoolComposition({ address, chainId })
  const { totalSupply } = usePoolDynamicContractData({ address, chainId })

  return useMemo(() => {
    if (!totalSupply) {
      return []
    }
    return formatPoolComposition({
      composition: poolComposition,
      assetAmount: shiftBy(new BigNumber(assetAmount || 0)),
      totalSupply: totalSupply.toString(),
    })
  }, [assetAmount, poolComposition, totalSupply])
}
