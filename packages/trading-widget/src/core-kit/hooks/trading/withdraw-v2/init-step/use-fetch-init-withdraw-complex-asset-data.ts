import { useCallback } from 'react'

import { usePoolManagerDynamic } from 'core-kit/hooks/pool/multicall'
import type { FetchAaveSwapParamsProps } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-fetch-aave-swap-params'
import { useFetchAaveSwapParams } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-fetch-aave-swap-params'
import { useFetchInitWithdrawAaveSwapData } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-init-withdraw-aave-swap-data'
import type { ComplexWithdrawAssetData, PoolConfig } from 'core-kit/types'
import {
  buildAaveWithdrawAssetTransactionData,
  getContractAddressById,
  isEqualAddress,
} from 'core-kit/utils'

export const useFetchInitWithdrawComplexAssetData = ({
  address,
  chainId,
}: Pick<PoolConfig, 'address' | 'chainId'>) => {
  const aaveLendingPoolV3Address = getContractAddressById(
    'aaveLendingPoolV3',
    chainId,
  )
  const { data: { getSupportedAssets: supportedVaultAssets } = {} } =
    usePoolManagerDynamic({
      address,
      chainId,
    })
  const fetchAaveSwapParams = useFetchAaveSwapParams({ address, chainId })
  const fetchAaveSwapData = useFetchInitWithdrawAaveSwapData({ chainId })

  return useCallback(
    async ({
      withdrawAmount,
      slippage,
      disabled,
    }: FetchAaveSwapParamsProps & { disabled?: boolean }): Promise<
      ComplexWithdrawAssetData[]
    > => {
      if (disabled) {
        return []
      }

      return await Promise.all(
        (supportedVaultAssets ?? []).map(async (asset) => {
          const isAaveAsset = isEqualAddress(asset, aaveLendingPoolV3Address)

          if (isAaveAsset) {
            try {
              const swapParams = await fetchAaveSwapParams({
                withdrawAmount,
                slippage,
              })
              const swapData = await fetchAaveSwapData({
                swapParams,
                slippage,
              })
              return buildAaveWithdrawAssetTransactionData({
                assetAddress: asset,
                swapData,
                swapParams,
                slippage,
              })
            } catch (error) {
              console.error(error)

              return {
                supportedAsset: asset,
                withdrawData: '',
                slippageTolerance: BigInt(0),
              }
            }
          }

          return {
            supportedAsset: asset,
            withdrawData: '',
            slippageTolerance: BigInt(0),
          }
        }),
      )
    },
    [
      aaveLendingPoolV3Address,
      fetchAaveSwapData,
      fetchAaveSwapParams,
      supportedVaultAssets,
    ],
  )
}
