import chunk from 'lodash.chunk'

import { useMemo } from 'react'

import { erc20Abi } from 'core-kit/abi'
import { BRIDGED_TOKENS_SYMBOLS, DEFAULT_PRECISION } from 'core-kit/const'
import { usePoolManagerDynamic } from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolFallbackData } from 'core-kit/hooks/state'
import {
  useContractReadsErrorLogging,
  useReadContracts,
} from 'core-kit/hooks/web3'
import type { PoolComposition } from 'core-kit/types/pool.types'
import type { Address, PoolContractCallParams } from 'core-kit/types/web3.types'
import { shortenAddress } from 'core-kit/utils'

interface FallbackAssetsMap {
  [address: string]: Pick<PoolComposition, 'tokenName' | 'precision' | 'asset'>
}

export const useContractPoolComposition = ({
  address,
  chainId,
}: PoolContractCallParams): PoolComposition[] => {
  const [poolFallbackData] = useTradingPanelPoolFallbackData()

  const fallbackAssetMap = useMemo(
    () =>
      poolFallbackData.poolCompositions?.reduce<FallbackAssetsMap>(
        (acc, { tokenAddress, tokenName, precision, asset }) => ({
          ...acc,
          [tokenAddress.toLowerCase()]: { tokenName, precision, asset },
        }),
        {},
      ),
    [poolFallbackData.poolCompositions],
  )

  const {
    data: {
      getFundComposition: [fundAssets, assetsBalances, assetsRates] = [],
    } = {},
    isFetched: isFundCompositionFetched,
  } = usePoolManagerDynamic({ address, chainId })

  const assetsAddresses = useMemo(
    () => fundAssets?.map(({ asset }) => asset) ?? [],
    [fundAssets],
  )

  const { data: tokenData } = useReadContracts({
    contracts: assetsAddresses.flatMap((address) => [
      {
        address,
        abi: erc20Abi,
        functionName: 'symbol',
        chainId,
      },
      {
        address,
        abi: erc20Abi,
        functionName: 'decimals',
        chainId,
      },
    ]),
    query: {
      enabled:
        isFundCompositionFetched &&
        assetsAddresses?.length > 0 &&
        !!chainId &&
        !assetsAddresses.every(
          (address) => fallbackAssetMap?.[address.toLowerCase()],
        ),
      staleTime: Infinity,
    },
  })
  useContractReadsErrorLogging(tokenData)

  return useMemo(() => {
    if (!fundAssets?.length) {
      return []
    }

    const chunked = chunk(tokenData, 2)

    return fundAssets.map(({ asset, isDeposit }, i) => {
      const tokenAddress = asset.toLowerCase() as Address
      const [symbol, decimals] = chunked[i] ?? []
      const tokenName =
        BRIDGED_TOKENS_SYMBOLS[tokenAddress.toLowerCase()] ??
        symbol?.result?.toString() ??
        fallbackAssetMap?.[tokenAddress]?.tokenName ??
        shortenAddress(tokenAddress)
      return {
        tokenAddress,
        isDeposit,
        rate: assetsRates?.[i]?.toString() ?? '0',
        amount: assetsBalances?.[i]?.toString() ?? '0',
        tokenName,
        precision: decimals?.result
          ? Number(decimals.result)
          : (fallbackAssetMap?.[tokenAddress]?.precision ?? DEFAULT_PRECISION),
        asset: {
          iconSymbols: fallbackAssetMap?.[tokenAddress]?.asset.iconSymbols ?? [
            tokenName,
          ],
        },
      }
    })
  }, [assetsBalances, assetsRates, fallbackAssetMap, fundAssets, tokenData])
}
