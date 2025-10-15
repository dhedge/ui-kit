import type { TransactionAction } from 'core-kit/types'

export const TRADING_PANEL_LOG_EVENT = {
  INVEST_INPUT_FOCUS: 'invest_input_focus',
  APPROVED_TOKEN: 'approved_token',
  DEPOSIT: 'deposit',
  MULTI_ASSET_WITHDRAW: 'multi_asset_withdraw',
  SINGLE_ASSET_WITHDRAW: 'single_asset_unroll',
  SINGLE_ASSET_WITHDRAW_AND_CLAIM: 'single_asset_unroll_and_claim',
  CLAIM: 'claim_unrolled_assets',
  SWAP: 'swap_unrolled_assets',
  WITHDRAWAL: 'withdrawal',
  TRADING_SETTINGS_OPENED: 'trading_settings_opened',
  INFINITE_ALLOWANCE_CHANGE: 'infinite_allowance_change',
  BATCH_TRANSACTIONS_CHANGE: 'batch_transactions_change',
  CREATE_LIMIT_SELL_ORDER: 'create_limit_sell_order',
  OPEN_LIMIT_SELL_VIEW: 'open_limit_sell_view',
  LIMIT_ORDER_WITHDRAW: 'limit_order_withdraw',
  LIMIT_ORDER_WITHDRAW_DELETE: 'limit_order_withdraw_delete',
}

export const LOG_EVENT_BY_TRANSACTION_ACTION_MAP: Record<
  TransactionAction,
  string[]
> = {
  approve: [TRADING_PANEL_LOG_EVENT.APPROVED_TOKEN],
  deposit: [TRADING_PANEL_LOG_EVENT.DEPOSIT],
  multi_withdraw: [
    TRADING_PANEL_LOG_EVENT.WITHDRAWAL,
    TRADING_PANEL_LOG_EVENT.MULTI_ASSET_WITHDRAW,
  ],
  single_withdraw: [
    TRADING_PANEL_LOG_EVENT.WITHDRAWAL,
    TRADING_PANEL_LOG_EVENT.SINGLE_ASSET_WITHDRAW,
  ],
  single_withdraw_and_claim: [
    TRADING_PANEL_LOG_EVENT.WITHDRAWAL,
    TRADING_PANEL_LOG_EVENT.SINGLE_ASSET_WITHDRAW_AND_CLAIM,
  ],
  claim: [TRADING_PANEL_LOG_EVENT.CLAIM],
  swap: [TRADING_PANEL_LOG_EVENT.SWAP],
  create_limit_sell_order: [TRADING_PANEL_LOG_EVENT.CREATE_LIMIT_SELL_ORDER],
  limit_order_withdraw: [TRADING_PANEL_LOG_EVENT.LIMIT_ORDER_WITHDRAW],
  delete_limit_order_withdraw: [
    TRADING_PANEL_LOG_EVENT.LIMIT_ORDER_WITHDRAW_DELETE,
  ],
}

/**
 * Limits: Up to 50 custom event parameters per project;
 * 40 must be numeric and 10 textual
 * Parameter names can be up to 40 characters long alphanumeric with underscores
 * Parameter textual values can be up to 100 characters long
 */
export const TRADING_LOG_EVENT_PARAM = {
  IS_INFINITE: { NAME: 'is_infinite', TYPE: 'number' },
  SYMBOL: { NAME: 'symbol', TYPE: 'string' },
  CHAIN_ID: { NAME: 'chain_id', TYPE: 'number' },
  ADDRESS: { NAME: 'address', TYPE: 'string' },
  IS_BATCH_TRANSACTIONS_ENABLED: { NAME: 'is_batch_enabled', TYPE: 'number' },
  SOURCE: { NAME: 'source', TYPE: 'string' },
}
