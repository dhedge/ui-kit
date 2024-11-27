import { useMemo } from 'react'

import { usePoolManagerDynamic } from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useAaveSwapParams } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-aave-swap-params'
import { useInitWithdrawAaveSwapData } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-init-withdraw-aave-swap-data'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage'
import type { ComplexWithdrawAssetData } from 'core-kit/types'
import {
  buildAaveWithdrawAssetTransactionData,
  getContractAddressById,
  isEqualAddress,
} from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

interface UseInitWithdrawComplexAssetDataReturn {
  isLoading: boolean
  complexAssetData: ComplexWithdrawAssetData[]
}

export const useInitWithdrawComplexAssetData =
  (): UseInitWithdrawComplexAssetDataReturn => {
    const { aaveOffchainWithdrawChainIds } = useConfigContextParams()
    const { address, chainId } = useTradingPanelPoolConfig()
    const slippage = useAppliedWithdrawSlippage()
    const aaveLendingPoolV3Address = getContractAddressById(
      'aaveLendingPoolV3',
      chainId,
    )
    const { data: { getSupportedAssets: supportedVaultAssets } = {} } =
      usePoolManagerDynamic({
        address,
        chainId,
      })

    const isOffchainAaveWithdrawSupported =
      aaveOffchainWithdrawChainIds.includes(chainId)
    const hasAaveAsset = !!supportedVaultAssets?.some((asset) =>
      isEqualAddress(asset, aaveLendingPoolV3Address),
    )
    const disabled = !isOffchainAaveWithdrawSupported || !hasAaveAsset

    const { data: swapParams, isFetching: isSwapParamsFetching } =
      useAaveSwapParams({
        address,
        chainId,
        disabled,
      })
    const { data: swapData, isFetching: isSwapDataFetching } =
      useInitWithdrawAaveSwapData({
        disabled,
      })

    return useMemo(
      () => ({
        isLoading: isSwapParamsFetching || isSwapDataFetching,
        complexAssetData: (supportedVaultAssets ?? []).map((asset) => {
          const isAaveAsset = isEqualAddress(asset, aaveLendingPoolV3Address)

          if (isAaveAsset && swapParams && swapData) {
            return buildAaveWithdrawAssetTransactionData({
              assetAddress: asset,
              swapData,
              swapParams,
              slippage,
            })
          }

          return {
            supportedAsset: asset,
            withdrawData: '',
            slippageTolerance: BigInt(0),
          }
        }),
      }),
      [
        supportedVaultAssets,
        aaveLendingPoolV3Address,
        swapData,
        swapParams,
        slippage,
        isSwapParamsFetching,
        isSwapDataFetching,
      ],
    )
  }
