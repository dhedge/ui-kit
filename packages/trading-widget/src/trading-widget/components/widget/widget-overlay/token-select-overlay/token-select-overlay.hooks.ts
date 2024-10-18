import { useCallback, useMemo } from 'react'

import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
  useTradingPanelType,
} from 'core-kit/hooks/state'
import { useVaultDepositTokens } from 'core-kit/hooks/trading/deposit-v2'
import { useIsCompleteWithdrawStep } from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useIsPoolManagerAccount } from 'core-kit/hooks/user'
import type { TradingPanelActionsState, TradingToken } from 'core-kit/types'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import type { OverlayProps } from 'trading-widget/types'

export interface TokenSelectOverlayProps extends OverlayProps {
  searchQuery: string
}

const useTokens = (): {
  tokens: TradingToken[]
  activeTokens: TradingToken[]
  updater: TradingPanelActionsState['updateSendTokenInput']
} => {
  const [type] = useTradingPanelType()
  const [sendToken, updateSendToken] = useSendTokenInput()
  const [receiveToken, updateReceiveToken] = useReceiveTokenInput()

  const poolConfig = useTradingPanelPoolConfig()
  const depositTokens = useVaultDepositTokens()
  const withdrawTokens = poolConfig.withdrawParams.customTokens

  return useMemo(
    () => ({
      tokens: type === 'deposit' ? depositTokens : withdrawTokens,
      updater: type === 'deposit' ? updateSendToken : updateReceiveToken,
      activeTokens: [sendToken, receiveToken],
    }),
    [
      type,
      depositTokens,
      withdrawTokens,
      updateSendToken,
      updateReceiveToken,
      sendToken,
      receiveToken,
    ],
  )
}

export const useTokenSelectOverlay = ({
  searchQuery,
  type,
}: TokenSelectOverlayProps) => {
  const [{ isMultiAssetWithdrawalEnabled }] = useTradingPanelSettings()
  const { isCompleteWithdrawStep } = useIsCompleteWithdrawStep()
  const isPoolManagerAccount = useIsPoolManagerAccount()
  const [tradingType] = useTradingPanelType()
  const { handleReject } = useOverlayHandlers({ type })

  const { tokens, updater, activeTokens } = useTokens()

  const tokenList = useMemo(
    () =>
      searchQuery
        ? tokens.filter(({ symbol }) =>
            symbol.toLowerCase().includes(searchQuery),
          )
        : tokens,
    [searchQuery, tokens],
  )

  const onSelect = useCallback(
    ({ address, value, decimals, symbol }: TradingToken) => {
      updater({ address, value, decimals, symbol })
      handleReject()
    },
    [updater, handleReject],
  )

  return {
    tokenList,
    activeTokens,
    onSelect,
    onClose: handleReject,
    showMultiAssetWithdrawalOption:
      isMultiAssetWithdrawalEnabled &&
      tradingType === 'withdraw' &&
      !isPoolManagerAccount &&
      !isCompleteWithdrawStep,
  }
}
