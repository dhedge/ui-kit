import BigNumber from 'bignumber.js'
import { useCallback, useMemo } from 'react'

import { DEFAULT_PRECISION } from 'core-kit/const'
import { usePoolManagerDynamic } from 'core-kit/hooks/pool/multicall'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useFetchInitWithdrawComplexAssetData } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-fetch-init-withdraw-complex-asset-data'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-is-multi-asset-withdraw'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage'
import { useDebounce } from 'core-kit/hooks/utils'
import { getSlippageToleranceForContractTransaction } from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

interface UseInitWithdrawTransactionArguments {
  debounceTime?: number
}

export const useGetInitWithdrawTransactionArguments = () => {
  const poolConfig = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const { aaveOffchainWithdrawChainIds } = useConfigContextParams()
  const isMultiAssetsWithdraw = useIsMultiAssetWithdraw()
  const isOffchainAaveWithdrawSupported = aaveOffchainWithdrawChainIds.includes(
    poolConfig.chainId,
  )
  const slippage = useAppliedWithdrawSlippage()
  const fetchComplexAssetData = useFetchInitWithdrawComplexAssetData(poolConfig)

  return useCallback(async () => {
    const withdrawAmount = BigInt(
      new BigNumber(sendToken.value || '0')
        .shiftedBy(DEFAULT_PRECISION)
        .toFixed(0, BigNumber.ROUND_DOWN),
    )
    const slippageTolerance = BigInt(
      getSlippageToleranceForContractTransaction(slippage),
    )
    const complexAssetData = await fetchComplexAssetData({
      withdrawAmount,
      slippage,
      disabled: !isOffchainAaveWithdrawSupported,
    })

    const lastArg =
      isOffchainAaveWithdrawSupported && complexAssetData.length
        ? complexAssetData
        : slippageTolerance

    if (isMultiAssetsWithdraw) {
      return [withdrawAmount, lastArg]
    }

    return [poolConfig.address, withdrawAmount, lastArg]
  }, [
    fetchComplexAssetData,
    isMultiAssetsWithdraw,
    isOffchainAaveWithdrawSupported,
    poolConfig.address,
    sendToken.value,
    slippage,
  ])
}

export const useInitWithdrawTransactionArgumentsForSimulationOnly = ({
  debounceTime,
}: UseInitWithdrawTransactionArguments = {}) => {
  const poolConfig = useTradingPanelPoolConfig()
  const { aaveOffchainWithdrawChainIds } = useConfigContextParams()
  const isMultiAssetsWithdraw = useIsMultiAssetWithdraw()
  const [sendToken] = useSendTokenInput()
  const isOffchainAaveWithdrawSupported = aaveOffchainWithdrawChainIds.includes(
    poolConfig.chainId,
  )
  const { data: { getSupportedAssets: supportedVaultAssets } = {} } =
    usePoolManagerDynamic(poolConfig)

  const slippage = useAppliedWithdrawSlippage()

  const withdrawAmountDebounced = useDebounce(
    new BigNumber(sendToken.value || '0')
      .shiftedBy(DEFAULT_PRECISION)
      .toFixed(0, BigNumber.ROUND_DOWN),
    debounceTime ?? 0,
  )

  return useMemo(() => {
    const withdrawAmount = BigInt(withdrawAmountDebounced)
    const slippageTolerance = BigInt(
      getSlippageToleranceForContractTransaction(slippage),
    )
    const complexAssetData = (supportedVaultAssets ?? []).map((asset) => ({
      supportedAsset: asset,
      withdrawData: '',
      slippageTolerance: BigInt(0),
    }))
    const lastArg = isOffchainAaveWithdrawSupported
      ? complexAssetData
      : slippageTolerance

    if (isMultiAssetsWithdraw) {
      return [withdrawAmount, lastArg]
    }

    return [poolConfig.address, withdrawAmount, lastArg]
  }, [
    withdrawAmountDebounced,
    slippage,
    supportedVaultAssets,
    isOffchainAaveWithdrawSupported,
    isMultiAssetsWithdraw,
    poolConfig.address,
  ])
}
