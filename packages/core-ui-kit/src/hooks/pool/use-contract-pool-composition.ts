import chunk from 'lodash.chunk'

import { useMemo } from 'react'

import { erc20Abi } from 'abi'
import { BRIDGED_TOKENS_SYMBOLS, DEFAULT_PRECISION } from 'const'
import { useSynthetixV3AssetBalance } from 'hooks/pool'
import { usePoolManagerDynamic } from 'hooks/pool/multicall'
import { useTradingPanelPoolFallbackData } from 'hooks/state'
import { useContractReadsErrorLogging, useReadContracts } from 'hooks/web3'
import type { PoolComposition } from 'types/pool.types'
import type { Address, PoolContractCallParams } from 'types/web3.types'
import { isSynthetixV3Asset, isSynthetixV3Vault, shortenAddress } from 'utils'

interface FallbackAssetsMap {
  [address: string]: Pick<PoolComposition, 'tokenName' | 'precision' | 'asset'>
}

export const useContractPoolComposition = ({
  address,
  chainId,
}: PoolContractCallParams): PoolComposition[] => {
  const [poolFallbackData] = useTradingPanelPoolFallbackData()
  const isSynthetixVault = isSynthetixV3Vault(address)

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

  // Synthetix V3 asset balance should be fetched separately
  // https://github.com/dhedge/dhedge-v2/blob/master/contracts/guards/assetGuards/synthetixV3/SynthetixV3AssetGuard.sol#L66
  const includesSynthetixV3Asset =
    isSynthetixVault &&
    !!fundAssets?.some(({ asset }) => isSynthetixV3Asset(asset))
  const synthetixV3AssetBalance = useSynthetixV3AssetBalance({
    vaultAddress: address,
    chainId,
    disabled: !includesSynthetixV3Asset,
  })

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
        isFundCompositionFetched && assetsAddresses?.length > 0 && !!chainId,
      staleTime: Infinity,
    },
  })
  useContractReadsErrorLogging(tokenData)

  return useMemo(() => {
    if (!fundAssets?.length || !tokenData?.length) {
      return []
    }

    const chunked = chunk(tokenData, 2)

    return fundAssets.map(({ asset, isDeposit }, i) => {
      const tokenAddress = asset.toLowerCase() as Address
      const isSynthetixAsset = isSynthetixV3Asset(tokenAddress)
      const [symbol, decimals] = chunked[i] ?? []
      return {
        tokenAddress,
        isDeposit,
        rate: assetsRates?.[i]?.toString() ?? '0',
        amount:
          isSynthetixAsset && synthetixV3AssetBalance
            ? synthetixV3AssetBalance
            : assetsBalances?.[i]?.toString() ?? '0',
        tokenName:
          BRIDGED_TOKENS_SYMBOLS[tokenAddress.toLowerCase()] ??
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
  }, [
    assetsBalances,
    assetsRates,
    fallbackAssetMap,
    fundAssets,
    synthetixV3AssetBalance,
    tokenData,
  ])
}
