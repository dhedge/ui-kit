import BigNumber from 'bignumber.js'
import { useCallback, useMemo } from 'react'

import { DEFAULT_PRECISION } from 'core-kit/const'
import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import { usePoolManagerDynamic } from 'core-kit/hooks/pool/multicall'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useFetchInitWithdrawComplexAssetData } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-fetch-init-withdraw-complex-asset-data'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-is-multi-asset-withdraw'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage'
import { useDebounce } from 'core-kit/hooks/utils'
import type { InitWithdrawTransactionArguments } from 'core-kit/types'
import { formatEther, formatNumberToLimitedDecimals } from 'core-kit/utils'

interface UseGetInitWithdrawTransactionArguments {
  debounceTime?: number
}

const tokenPriceFormatter = (tokenPrice: bigint) =>
  formatNumberToLimitedDecimals(formatEther(tokenPrice), 2)

export const useGetInitWithdrawTransactionArguments = () => {
  const poolConfig = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const isMultiAssetsWithdraw = useIsMultiAssetWithdraw()
  const slippage = useAppliedWithdrawSlippage()
  const fetchComplexAssetData = useFetchInitWithdrawComplexAssetData(poolConfig)
  const vaultTokenPrice = usePoolTokenPrice({
    address: poolConfig.address,
    formatter: tokenPriceFormatter,
    chainId: poolConfig.chainId,
  })

  return useCallback(async () => {
    const withdrawAmountD18 = BigInt(
      new BigNumber(sendToken.value || '0')
        .shiftedBy(DEFAULT_PRECISION)
        .toFixed(0, BigNumber.ROUND_DOWN),
    )
    const complexAssetData = await fetchComplexAssetData({
      withdrawAmountD18,
      vaultTokenPrice,
      slippage,
    })

    if (isMultiAssetsWithdraw) {
      return [withdrawAmountD18, complexAssetData]
    }

    return [poolConfig.address, withdrawAmountD18, complexAssetData]
  }, [
    fetchComplexAssetData,
    isMultiAssetsWithdraw,
    poolConfig.address,
    sendToken.value,
    slippage,
    vaultTokenPrice,
  ])
}

export const useInitWithdrawTransactionArgumentsForSimulationOnly = ({
  debounceTime,
}: UseGetInitWithdrawTransactionArguments = {}): InitWithdrawTransactionArguments => {
  const poolConfig = useTradingPanelPoolConfig()
  const isMultiAssetsWithdraw = useIsMultiAssetWithdraw()
  const [sendToken] = useSendTokenInput()

  const { data: { getSupportedAssets: supportedVaultAssets } = {} } =
    usePoolManagerDynamic(poolConfig)

  const withdrawAmountDebouncedD18 = useDebounce(
    new BigNumber(sendToken.value || '0')
      .shiftedBy(DEFAULT_PRECISION)
      .toFixed(0, BigNumber.ROUND_DOWN),
    debounceTime ?? 0,
  )

  return useMemo(() => {
    const withdrawAmountD18 = BigInt(withdrawAmountDebouncedD18)
    const complexAssetData = (supportedVaultAssets ?? []).map((asset) => ({
      supportedAsset: asset,
      withdrawData: '',
      slippageTolerance: BigInt(0),
    }))

    if (isMultiAssetsWithdraw) {
      return [withdrawAmountD18, complexAssetData]
    }

    return [poolConfig.address, withdrawAmountD18, complexAssetData]
  }, [
    withdrawAmountDebouncedD18,
    supportedVaultAssets,
    isMultiAssetsWithdraw,
    poolConfig.address,
  ])
}
