import type BigNumber from 'bignumber.js'
import debounce from 'lodash.debounce'
import noop from 'lodash.noop'
import { useEffect, useRef } from 'react'

import { SHORTEN_POLLING_INTERVAL } from 'const'
import { usePoolDynamicContractData } from 'hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelMeta,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'hooks/state'
import { useIsInsufficientBalance } from 'hooks/user'
import { useBlockNumber } from 'hooks/web3'
import type { SendEstimationResult } from 'types/web3.types'

interface WithdrawSlippageParams {
  estimateSell: () => Promise<Map<number, SendEstimationResult>>
  fromTokenAmount: BigNumber
  isMultiAssetsWithdraw: boolean
}
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
    watch: { enabled: true, pollingInterval: SHORTEN_POLLING_INTERVAL },
    query: { staleTime: SHORTEN_POLLING_INTERVAL },
  })

  const debouncedEstimateSell = useRef(noop)
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
      1000,
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
    // Temporary disable slippage estimation when manual slippage is set
    if (sendToken.value && !insufficientBalance && slippage === 'auto') {
      debouncedEstimateSell.current()
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
