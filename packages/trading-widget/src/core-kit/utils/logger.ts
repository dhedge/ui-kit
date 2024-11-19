import {
  TRADING_LOG_EVENT_PARAM,
  TRADING_PANEL_LOG_EVENT,
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
  switch (action) {
    case 'approve':
      log?.(TRADING_PANEL_LOG_EVENT.APPROVED_TOKEN, payload)
      break
    case 'oraclesUpdate':
      log?.(TRADING_PANEL_LOG_EVENT.UPDATE_ORACLES, payload)
      break
    case 'deposit':
      log?.(TRADING_PANEL_LOG_EVENT.DEPOSIT, payload)
      break
    case 'multi_withdraw':
      log?.(TRADING_PANEL_LOG_EVENT.MULTI_ASSET_WITHDRAW, payload)
      break
    case 'single_withdraw':
      log?.(TRADING_PANEL_LOG_EVENT.SINGLE_ASSET_WITHDRAW, payload)
      break
    case 'single_withdraw_and_claim':
      log?.(TRADING_PANEL_LOG_EVENT.SINGLE_ASSET_WITHDRAW_AND_CLAIM, payload)
      break
    case 'claim':
      log?.(TRADING_PANEL_LOG_EVENT.CLAIM, payload)
      break
    case 'swap':
      log?.(TRADING_PANEL_LOG_EVENT.SWAP, payload)
      break
  }
}
