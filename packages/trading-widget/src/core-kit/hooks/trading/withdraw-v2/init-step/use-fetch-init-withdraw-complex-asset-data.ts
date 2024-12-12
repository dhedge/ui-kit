import BigNumber from 'bignumber.js'
import { useCallback } from 'react'

import { DEFAULT_PRECISION } from 'core-kit/const'
import { usePoolManagerDynamic } from 'core-kit/hooks/pool/multicall'
import type { FetchAaveSwapParamsProps } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-fetch-aave-swap-params'
import { useFetchAaveSwapParams } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-fetch-aave-swap-params'
import { useFetchInitWithdrawAaveSwapData } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-fetch-init-withdraw-aave-swap-data'
import type { ComplexWithdrawAssetData, PoolConfig } from 'core-kit/types'
import {
  buildAaveWithdrawAssetTransactionData,
  getContractAddressById,
  getSlippageToleranceForContractTransaction,
  isEqualAddress,
} from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useFetchInitWithdrawComplexAssetData = ({
  address,
  chainId,
}: Pick<PoolConfig, 'address' | 'chainId'>) => {
  const aaveLendingPoolV3Address = getContractAddressById(
    'aaveLendingPoolV3',
    chainId,
  )
  const { aaveOffchainWithdrawMinValue } = useConfigContextParams()
  const { data: { getSupportedAssets: supportedVaultAssets } = {} } =
    usePoolManagerDynamic({
      address,
      chainId,
    })
  const fetchAaveSwapParams = useFetchAaveSwapParams({ address, chainId })
  const fetchAaveSwapData = useFetchInitWithdrawAaveSwapData({ chainId })

  return useCallback(
    async ({
      withdrawAmountD18,
      vaultTokenPrice,
      slippage,
      disabled,
    }: FetchAaveSwapParamsProps & {
      disabled?: boolean
      vaultTokenPrice: string
    }): Promise<ComplexWithdrawAssetData[]> => {
      if (disabled) {
        return []
      }
      const isOffchainAaveWithdrawSupported = new BigNumber(
        withdrawAmountD18.toString(),
      )
        .shiftedBy(-DEFAULT_PRECISION)
        .times(vaultTokenPrice)
        .gt(aaveOffchainWithdrawMinValue)

      return await Promise.all(
        (supportedVaultAssets ?? []).map(async (asset) => {
          const isAaveAsset = isEqualAddress(asset, aaveLendingPoolV3Address)
          const slippageTolerance = isAaveAsset
            ? getSlippageToleranceForContractTransaction(slippage)
            : BigInt(0)

          if (isOffchainAaveWithdrawSupported && isAaveAsset) {
            try {
              const swapParams = await fetchAaveSwapParams({
                withdrawAmountD18,
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
                slippageToleranceForContractTransaction: slippageTolerance,
              })
            } catch (error) {
              console.error(error)
            }
          }

          return {
            supportedAsset: asset,
            withdrawData: '',
            slippageTolerance,
          }
        }),
      )
    },
    [
      aaveLendingPoolV3Address,
      aaveOffchainWithdrawMinValue,
      fetchAaveSwapData,
      fetchAaveSwapParams,
      supportedVaultAssets,
    ],
  )
}
