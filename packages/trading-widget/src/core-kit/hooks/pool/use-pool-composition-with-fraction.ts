import BigNumber from 'bignumber.js'

import { useMemo } from 'react'

import {
  usePoolComposition,
  usePoolDynamicContractData,
} from 'core-kit/hooks/pool'
import type {
  PoolComposition,
  PoolCompositionWithFraction,
} from 'core-kit/types/pool.types'
import type { ChainId, PoolContractCallParams } from 'core-kit/types/web3.types'
import {
  formatToUsd,
  getConventionalTokenPriceDecimals,
  getPoolFraction,
  isSynthetixV3Asset,
  shiftBy,
} from 'core-kit/utils'

interface PoolCompositionParams {
  composition: PoolComposition[]
  vaultTokensAmount: string
  totalSupply: string
}

type PoolCompositionWithFractionParams = PoolContractCallParams & {
  vaultTokensAmount: string
  chainId: ChainId
}

export const formatPoolComposition = ({
  composition,
  vaultTokensAmount,
  totalSupply,
}: PoolCompositionParams): PoolCompositionWithFraction[] =>
  composition
    .map((token) => {
      const isSynthetixAsset = isSynthetixV3Asset(token.tokenAddress)
      return {
        ...token,
        tokenName: isSynthetixAsset ? 'Synthetix V3' : token.tokenName,
        asset: isSynthetixAsset ? { iconSymbols: ['snxv3'] } : token.asset,
      }
    })
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
        totalSupply,
        asset.precision,
      )
      const fractionUsd = getPoolFraction(
        new BigNumber(asset.rate)
          .multipliedBy(asset.amount)
          .shiftedBy(-asset.precision)
          .toFixed(),
        vaultTokensAmount,
        totalSupply,
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
  const { totalSupply } = usePoolDynamicContractData({ address, chainId })

  return useMemo(() => {
    if (!totalSupply) {
      return []
    }
    return formatPoolComposition({
      composition: poolComposition,
      vaultTokensAmount: shiftBy(vaultTokensAmount || 0),
      totalSupply,
    })
  }, [vaultTokensAmount, poolComposition, totalSupply])
}
