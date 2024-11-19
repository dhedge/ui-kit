export const TRADING_PANEL_LOG_EVENT = {
  INVEST_INPUT_FOCUS: 'invest_input_focus',
  APPROVED_TOKEN: 'approved_token',
  UPDATE_ORACLES: 'update_oracles',
  DEPOSIT: 'deposit',
  MULTI_ASSET_WITHDRAW: 'multi_asset_withdraw',
  SINGLE_ASSET_WITHDRAW: 'single_asset_unroll',
  SINGLE_ASSET_WITHDRAW_AND_CLAIM: 'single_asset_unroll_and_claim',
  CLAIM: 'claim_unrolled_assets',
  SWAP: 'swap_unrolled_assets',
  WITHDRAWAL: 'withdrawal',
  TRADING_SETTINGS_OPENED: 'trading_settings_opened',
  INFINITE_ALLOWANCE_CHANGE: 'infinite_allowance_change',
}

/**
 * Limits: Up to 50 custom event parameters per project;
 * 40 must be numeric and 10 textual
 * Parameter names can be up to 40 characters long alfanumeric with underscores
 * Parameter textual values can be up to 100 characters long
 */
export const TRADING_LOG_EVENT_PARAM = {
  IS_INFINITE: { NAME: 'is_infinite', TYPE: 'number' },
  SYMBOL: { NAME: 'symbol', TYPE: 'string' },
  CHAIN_ID: { NAME: 'chain_id', TYPE: 'number' },
  ADDRESS: { NAME: 'address', TYPE: 'string' },
}
