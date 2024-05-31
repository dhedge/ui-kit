import { useCallback, useMemo } from 'react'

import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolAddress,
  useTradingPanelPoolConfig,
  useTradingPanelPoolConfigs,
  useTradingPanelType,
} from 'core-kit/hooks/state'
import type { PoolConfig, TradingToken } from 'core-kit/types'
import { formatToUsd } from 'core-kit/utils'
import { useUserVaultsBalances } from 'trading-widget/hooks/use-user-vaults-balances'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import type {
  Balance,
  OverlayProps,
  UserPoolBalances,
} from 'trading-widget/types'

export interface PoolSelectOverlayProps extends OverlayProps {
  searchQuery: string
}

const getUsdBalance = (
  config: Pick<PoolConfig, 'address'>,
  usePoolBalances: UserPoolBalances,
): Pick<Balance, 'balanceInUsd' | 'balanceInUsdNumber'> => {
  if (config.address in usePoolBalances) {
    return {
      balanceInUsd:
        usePoolBalances[config.address]?.balanceInUsd ??
        formatToUsd({ value: 0 }),
      balanceInUsdNumber:
        usePoolBalances[config.address]?.balanceInUsdNumber ?? 0,
    }
  }

  return { balanceInUsd: formatToUsd({ value: 0 }), balanceInUsdNumber: 0 }
}

const compareByBalanceInUsd =
  (userPoolBalances: UserPoolBalances) =>
  (first: PoolConfig, second: PoolConfig) => {
    return (
      getUsdBalance(second, userPoolBalances).balanceInUsdNumber -
      getUsdBalance(first, userPoolBalances).balanceInUsdNumber
    )
  }

export const usePoolSelectOverlay = ({
  searchQuery,
  type,
}: PoolSelectOverlayProps) => {
  const allUserPoolBalances = useUserVaultsBalances()
  const poolConfigs: PoolConfig[] = useTradingPanelPoolConfigs()
  const poolConfig = useTradingPanelPoolConfig()
  const { handleReject } = useOverlayHandlers({ type })
  const [tradingType] = useTradingPanelType()
  const updateSendToken = useSendTokenInput()[1]
  const updateReceiveToken = useReceiveTokenInput()[1]
  const setTradingPanelPoolAddress = useTradingPanelPoolAddress()[1]

  const onSelect = useCallback(
    ({ address, value, decimals, symbol }: TradingToken) => {
      const updater =
        tradingType === 'deposit' ? updateReceiveToken : updateSendToken
      updater({ address, value, decimals, symbol })
      setTradingPanelPoolAddress(address)
      handleReject()
    },
    [
      tradingType,
      updateSendToken,
      updateReceiveToken,
      handleReject,
      setTradingPanelPoolAddress,
    ],
  )

  const poolList = useMemo(
    () =>
      Array.from(new Set(poolConfigs.map(({ chainId }) => chainId))).map(
        (chainId) => ({
          chainId,
          configs: [
            ...poolConfigs
              .filter(
                (config) => config.chainId === chainId && !config.deprecated,
              )
              .map((config) => ({
                ...config,
                ...getUsdBalance(config, allUserPoolBalances),
                isActive: poolConfig.address === config.address,
              }))
              .filter(({ symbol }) =>
                searchQuery ? symbol.toLowerCase().includes(searchQuery) : true,
              )
              .slice()
              .sort(compareByBalanceInUsd(allUserPoolBalances)),
          ],
        }),
      ),
    [searchQuery, allUserPoolBalances, poolConfigs, poolConfig],
  )

  return {
    poolList,
    onClose: handleReject,
    onSelect,
  }
}
