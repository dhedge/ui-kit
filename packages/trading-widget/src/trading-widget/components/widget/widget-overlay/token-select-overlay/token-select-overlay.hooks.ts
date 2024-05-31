import { useCallback, useMemo } from 'react'

import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
  useTradingPanelType,
} from 'core-kit/hooks/state'
import { usePoolDepositTokens } from 'core-kit/hooks/trading/deposit'
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
  const depositTokens = usePoolDepositTokens()
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
  // TODO: Remove the isPoolManagerAccount duplicate check in useWithdrawTypeHandler during trading widget build
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
    isMultiAssetWithdrawalEnabled:
      isMultiAssetWithdrawalEnabled &&
      tradingType === 'withdraw' &&
      !isPoolManagerAccount,
  }
}
