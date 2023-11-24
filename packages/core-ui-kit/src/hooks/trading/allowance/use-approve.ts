import { MaxUint256 } from 'const'
import {
  useTradingPanelApprovingStatus,
  useTradingPanelModal,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
  useTradingPanelTransactions,
} from 'hooks/state'
import { useTradingSettleHandler } from 'hooks/trading'
import { useContractFunction } from 'hooks/web3'
import { useCallback } from 'react'

import type { TradingToken } from 'types/trading-panel.types'
import type { Address } from 'types/web3.types'

interface UseApproveParams {
  token: TradingToken
  rawTokenAmount: string
  spenderAddress: Address
}

export const useApprove = ({
  token,
  rawTokenAmount,
  spenderAddress,
}: UseApproveParams) => {
  const poolConfig = useTradingPanelPoolConfig()
  const [{ isInfiniteAllowance }] = useTradingPanelSettings()
  const updatePendingTransactions = useTradingPanelTransactions()[1]
  const updateTradingModal = useTradingPanelModal()[1]
  const updateApprovingStatus = useTradingPanelApprovingStatus()[1]

  const onSettled = useTradingSettleHandler('approve')
  const { send } = useContractFunction({
    contractId: 'erc20',
    dynamicContractAddress: token.address,
    functionName: 'approve',
    onSettled,
  })

  return useCallback(async () => {
    updateApprovingStatus('pending')

    updateTradingModal({
      isOpen: true,
      status: 'Wallet',
      link: '',
      action: 'approve',
      sendToken: {
        symbol: token.symbol,
        address: token.address,
        decimals: token.decimals,
        value: '',
      },
      receiveToken: null,
    })
    updatePendingTransactions({
      type: 'add',
      action: 'approve',
      symbol: token.symbol,
      chainId: poolConfig.chainId,
    })

    return send(
      spenderAddress,
      isInfiniteAllowance ? MaxUint256 : rawTokenAmount,
    )
  }, [
    isInfiniteAllowance,
    poolConfig.chainId,
    rawTokenAmount,
    send,
    spenderAddress,
    token.address,
    token.decimals,
    token.symbol,
    updateApprovingStatus,
    updatePendingTransactions,
    updateTradingModal,
  ])
}
