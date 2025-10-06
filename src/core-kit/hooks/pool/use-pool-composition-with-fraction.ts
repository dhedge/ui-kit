import BigNumber from 'bignumber.js'

import { useMemo } from 'react'

import { usePoolComposition } from 'core-kit/hooks/pool'
import { usePoolDynamic } from 'core-kit/hooks/pool/multicall'
import type {
  PoolComposition,
  PoolCompositionWithFraction,
} from 'core-kit/types/pool.types'
import type { ChainId, PoolContractCallParams } from 'core-kit/types/web3.types'
import {
  formatToUsd,
  getConventionalTokenPriceDecimals,
  getPoolFraction,
  shiftBy,
} from 'core-kit/utils'

interface PoolCompositionParams {
  composition: PoolComposition[]
  vaultTokensAmount: string
  totalSupplyD18: string
}

type PoolCompositionWithFractionParams = PoolContractCallParams & {
  vaultTokensAmount: string
  chainId: ChainId
}

export const formatPoolComposition = ({
  composition,
  vaultTokensAmount,
  totalSupplyD18,
}: PoolCompositionParams): PoolCompositionWithFraction[] =>
  composition
    .reduce<PoolComposition[]>((acc, asset) => {
      const existingToken = acc.find(
        ({ tokenName }) => tokenName === asset.tokenName,
      )

      if (existingToken) {
        const existingAmount = new BigNumber(existingToken.amount).shiftedBy(
          -existingToken.precision,
        )
        const assetAmount = new BigNumber(asset.amount).shiftedBy(
          -asset.precision,
        )
        existingToken.amount = existingAmount
          .plus(assetAmount)
          .shiftedBy(existingToken.precision)
          .toFixed(0)

        return acc
      }
      return [...acc, asset]
    }, [])
    .map((asset) => {
      const fraction = getPoolFraction(
        asset.amount,
        vaultTokensAmount,
        totalSupplyD18,
        asset.precision,
      )
      const fractionUsd = getPoolFraction(
        new BigNumber(asset.rate)
          .multipliedBy(asset.amount)
          .shiftedBy(-asset.precision)
          .toFixed(),
        vaultTokensAmount,
        totalSupplyD18,
      )
      return {
        ...asset,
        fraction: fraction.toFixed(getConventionalTokenPriceDecimals(fraction)),
        fractionUsd: formatToUsd({ value: fractionUsd }),
        fractionUsdNumber: fractionUsd,
      }
    })
    .filter(({ amount }) => amount !== '0')
    .sort((a, b) => b.fractionUsdNumber - a.fractionUsdNumber)

export const usePoolCompositionWithFraction = ({
  address,
  vaultTokensAmount,
  chainId,
}: PoolCompositionWithFractionParams) => {
  const poolComposition = usePoolComposition({ address, chainId })
  const { data: { totalSupplyD18 } = {} } = usePoolDynamic({ address, chainId })

  return useMemo(() => {
    if (!totalSupplyD18) {
      return []
    }
    return formatPoolComposition({
      composition: poolComposition,
      vaultTokensAmount: shiftBy(vaultTokensAmount || 0),
      totalSupplyD18,
    })
  }, [vaultTokensAmount, poolComposition, totalSupplyD18])
}
