import {
  LOG_EVENT_BY_TRANSACTION_ACTION_MAP,
  TRADING_LOG_EVENT_PARAM,
} from 'core-kit/const'
import type {
  TradingPanelActionsState,
  TransactionAction,
} from 'core-kit/types'
import type { Address } from 'core-kit/types/web3.types'

/**
 * Transforms an Ethereum address to ensure it's treated as a string in Firebase Analytics.
 * Adds a prefix to avoid scientific notation or numeric interpretation.
 *
 * @param {string} ethereumAddress - The Ethereum address to transform.
 * @returns {string} - The transformed Ethereum address.
 */
export const transformAddressForAnalytics = (
  ethereumAddress: Address,
): string => `eth_${ethereumAddress}`

export const logTransactionByActionType = ({
  action,
  log,
  symbol,
  vaultAddress,
  chainId,
}: {
  action: TransactionAction
  symbol: string
  log: TradingPanelActionsState['onLog']
  chainId: number
  vaultAddress: Address
}) => {
  const payload = {
    [TRADING_LOG_EVENT_PARAM.SYMBOL.NAME]: symbol,
    [TRADING_LOG_EVENT_PARAM.CHAIN_ID.NAME]: chainId,
    [TRADING_LOG_EVENT_PARAM.ADDRESS.NAME]:
      transformAddressForAnalytics(vaultAddress),
  }

  LOG_EVENT_BY_TRANSACTION_ACTION_MAP[action].forEach((event) => {
    log?.(event, payload)
  })
}
