import { useCallback } from 'react'

import { MaxUint256 } from 'core-kit/const'
import {
  useTradingPanelModal,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useTradingSettleHandler } from 'core-kit/hooks/trading'
import { useContractFunction } from 'core-kit/hooks/web3'

import type { TradingToken } from 'core-kit/types/trading-panel.types'
import type { Address } from 'core-kit/types/web3.types'

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

  const onSettled = useTradingSettleHandler('approve')
  const { send } = useContractFunction({
    contractId: 'erc20',
    dynamicContractAddress: token.address,
    functionName: 'approve',
    onSettled,
  })

  return useCallback(async () => {
    updateTradingModal({
      isOpen: true,
      status: 'Wallet',
      link: '',
      action: 'approve',
      sendTokens: [
        {
          symbol: token.symbol,
          address: token.address,
          decimals: token.decimals,
          value: '',
        },
      ],
      receiveTokens: null,
      meta: {},
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
    updatePendingTransactions,
    updateTradingModal,
  ])
}
