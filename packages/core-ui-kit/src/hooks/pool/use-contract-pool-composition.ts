import { PoolManagerLogicAbi, erc20ABI } from 'abi'
import { DEFAULT_PRECISION } from 'const'
import { useManagerLogicAddress } from 'hooks/pool'
import { useTradingPanelPoolFallbackData } from 'hooks/state'
import {
  useContractRead,
  useContractReads,
  useContractReadsErrorLogging,
} from 'hooks/web3'
import chunk from 'lodash.chunk'
import { useMemo } from 'react'
import type { PoolComposition } from 'types/pool.types'
import type { Address, PoolContractCallParams } from 'types/web3.types'
import { shortenAddress } from 'utils'

interface FallbackAssetsMap {
  [address: string]: Pick<PoolComposition, 'tokenName' | 'precision' | 'asset'>
}

interface PoolCompositionAsset {
  asset: Address
  isDeposit: boolean
}

export const useContractPoolComposition = ({
  address,
  chainId,
}: PoolContractCallParams): PoolComposition[] => {
  const [poolFallbackData] = useTradingPanelPoolFallbackData()
  const managerLogicAddress = useManagerLogicAddress({ address, chainId })

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

  const { data, isFetched: isFundCompositionFetched } = useContractRead({
    address: managerLogicAddress,
    abi: PoolManagerLogicAbi,
    functionName: 'getFundComposition',
    chainId,
    enabled: !!managerLogicAddress && !!chainId,
  })
  const fundAssets = data?.[0] as PoolCompositionAsset[] | undefined
  const assetsBalances = data?.[1] as bigint[] | undefined
  const assetsRates = data?.[2] as bigint[] | undefined

  const assetsAddresses = useMemo(
    () => fundAssets?.map(({ asset }) => asset) ?? [],
    [fundAssets],
  )

  const { data: tokenData } = useContractReads({
    contracts: assetsAddresses.flatMap((address) => [
      {
        address,
        abi: erc20ABI,
        functionName: 'symbol',
        chainId,
      },
      {
        address,
        abi: erc20ABI,
        functionName: 'decimals',
        chainId,
      },
    ]),
    enabled:
      isFundCompositionFetched && assetsAddresses?.length > 0 && !!chainId,
    staleTime: Infinity,
  })
  useContractReadsErrorLogging(tokenData)

  return useMemo(() => {
    if (!fundAssets?.length || !tokenData?.length) {
      return []
    }

    const chunked = chunk(tokenData, 2)

    return fundAssets.map(({ asset, isDeposit }, i) => {
      const tokenAddress = asset.toLowerCase() as Address
      const [symbol, decimals] = chunked[i] ?? []
      return {
        tokenAddress,
        isDeposit,
        rate: assetsRates?.[i]?.toString() ?? '0',
        amount: assetsBalances?.[i]?.toString() ?? '0',
        tokenName:
          symbol?.result?.toString() ??
          fallbackAssetMap?.[tokenAddress]?.tokenName ??
          shortenAddress(tokenAddress),
        precision: decimals?.result
          ? Number(decimals.result)
          : fallbackAssetMap?.[tokenAddress]?.precision ?? DEFAULT_PRECISION,
        asset: {
          iconSymbols:
            fallbackAssetMap?.[tokenAddress]?.asset.iconSymbols ?? [],
        },
      }
    })
  }, [assetsBalances, assetsRates, fallbackAssetMap, fundAssets, tokenData])
}
