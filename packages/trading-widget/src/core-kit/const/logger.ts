export const TRADING_PANEL_LOG_EVENT = {
  INVEST_INPUT_FOCUS: 'invest_input_focus',
  APPROVED_TOKEN: 'approved_token',
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  TRADING_SETTINGS_OPENED: 'trading_settings_opened',
  INFINITE_ALLOWANCE_CHANGE: 'infinite_allowance_change',
  MULTI_ASSET_WITHDRAWAL_CHANGE: 'multi_asset_withdrawal_change',
}

/**
 * Limits: Up to 50 custom event parameters per project;
 * 40 must be numeric and 10 textual
 * Parameter names can be up to 40 characters long alfanumeric with underscores
 * Parameter textual values can be up to 100 characters long
 */
export const TRADING_LOG_EVENT_PARAM = {
  IS_INFINITE: { NAME: 'is_infinite', TYPE: 'number' },
  IS_MULTI_ASSET: { NAME: 'is_multi_asset', TYPE: 'number' },
  SYMBOL: { NAME: 'symbol', TYPE: 'string' },
  CHAIN_ID: { NAME: 'chain_id', TYPE: 'number' },
  ADDRESS: { NAME: 'address', TYPE: 'string' },
}
