import type BigNumber from 'bignumber.js'
import debounce from 'lodash.debounce'
import { useEffect, useRef } from 'react'

import { SHORTEN_POLLING_INTERVAL } from 'core-kit/const'
import { usePoolDynamicContractData } from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelMeta,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useIsInsufficientBalance } from 'core-kit/hooks/user'
import { useBlockNumber } from 'core-kit/hooks/web3'
import type { SendEstimationResult } from 'core-kit/types/web3.types'

interface WithdrawSlippageParams {
  estimateSell: () => Promise<Map<number, SendEstimationResult>>
  fromTokenAmount: BigNumber
  isMultiAssetsWithdraw: boolean
}
const noop = () => undefined
export const useWithdrawSlippage = ({
  estimateSell,
  fromTokenAmount,
  isMultiAssetsWithdraw,
}: WithdrawSlippageParams) => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const { cooldownActive } = usePoolDynamicContractData({ address, chainId })
  const [sendToken] = useSendTokenInput()
  const [receiveToken] = useReceiveTokenInput()
  const [{ slippage }, updateSettings] = useTradingPanelSettings()
  const [{ approvingStatus }] = useTradingPanelMeta()

  const isApproved = approvingStatus === 'success'
  const insufficientBalance = useIsInsufficientBalance()
  const { data: blockNumber } = useBlockNumber({
    query: { refetchInterval: SHORTEN_POLLING_INTERVAL },
  })

  const debouncedEstimateSell = useRef<() => Promise<void> | undefined>(noop)
  useEffect(() => {
    debouncedEstimateSell.current = debounce(
      async () => {
        if (fromTokenAmount.isZero() || !isApproved || cooldownActive) return
        updateSettings({ isMaxSlippageLoading: true })
        const estimationMap = await estimateSell()
        updateSettings({
          minSlippage: estimationMap.size
            ? Math.min(...estimationMap.keys())
            : undefined,
        })
        updateSettings({ isMaxSlippageLoading: false })
      },
      500,
      { leading: false, trailing: true },
    )
  }, [
    updateSettings,
    estimateSell,
    fromTokenAmount,
    isApproved,
    cooldownActive,
    // added receiveTokenSymbol to update debouncedEstimateSell func on token change
    receiveToken.symbol,
  ])

  useEffect(() => {
    if (isMultiAssetsWithdraw) {
      updateSettings({ minSlippage: 0 })
      return
    }
    if (sendToken.value && !insufficientBalance) {
      // TODO: added timeout to wait until debouncedEstimateSell will be updated. Temporary solution, can be improved
      const id = setTimeout(() => {
        debouncedEstimateSell.current()
      }, 1000)

      return () => clearTimeout(id)
    } else {
      updateSettings({ minSlippage: undefined })
    }
  }, [
    updateSettings,
    insufficientBalance,
    isMultiAssetsWithdraw,
    sendToken.value,
    blockNumber, // added block number to auto update slippage
    receiveToken.symbol, // added receiveTokenSymbol to update slippage on receive token change
    slippage,
  ])
}
