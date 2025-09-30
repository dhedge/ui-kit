export const GAS_ESTIMATION_ERROR = 'Gas estimate error occurred'

export const DEFAULT_ERROR_MESSAGE = 'See console logs to report error details.'

export const DEFAULT_SIMULATION_ERROR = 'Missing simulation params'

export const SIMULATION_TIMEOUT_ERROR = 'Simulation timeout'

export const DEPOSIT_SWAP_DATA_ERROR = 'swap_data_deposit_error'
export const WITHDRAW_SWAP_DATA_ERROR = 'swap_data_withdraw_error'

type ErrorsMap = Record<string, { title: string; hint?: string }>
const lowSlippageError = {
  title: 'Low Slippage',
  hint: 'Please increase slippage tolerance and try again.',
}

export const TRANSACTION_ERRORS: ErrorsMap = {
  'invalid liquidityMinted': lowSlippageError,
  'high withdraw slippage': lowSlippageError,
  'high deposit slippage': lowSlippageError,
  'high swap slippage': lowSlippageError,
  InsufficientAmountReceived: lowSlippageError,
  SwapFailed: {
    title: 'Swap Failed',
    hint: 'Please refresh the swap quote or choose another swap source in settings and try again.',
  },
  'assetType not handled': {
    title: 'Single Asset Withdrawal not available',
    hint: 'Please use All Assets option.',
  },
  [DEPOSIT_SWAP_DATA_ERROR]: {
    title: 'Swap Quote Fetching Error',
    hint: 'Please select a different deposit option, refresh the swap quote, or choose another swap source in settings.',
  },
  [WITHDRAW_SWAP_DATA_ERROR]: {
    title: 'Swap Quote Fetching Error',
    hint: 'Please refresh the swap quote, choose another swap source in settings, or claim your assets without a swap.',
  },
  dh1: {
    title: 'Factory contract is paused',
    hint: 'Try again later or contact the team on Discord if the issue persists.',
  },
  dh2: {
    title: 'Vault is paused',
    hint: 'Try again later or contact the team on Discord if the issue persists.',
  },
  dh3: {
    title: 'Vault tokens are in cooldown period',
    hint: 'Wait for the cooldown period to expire and try again.',
  },
  dh4: {
    title: 'Only vault manager allowed',
    hint: 'Only the vault manager can perform this action.',
  },
  dh5: {
    title: 'Only allowed addresses can use custom cooldown',
    hint: 'Only whitelisted addresses can perform this action.',
  },
  dh6: {
    title: 'Invalid cooldown duration',
    hint: 'Cooldown must be between 5 minutes and the maximum exit cooldown.',
  },
  dh7: {
    title: 'Only whitelisted vault members allowed',
    hint: 'Only the manager or whitelisted members can deposit to this private vault.',
  },
  dh8: {
    title: 'Asset not supported for deposits',
    hint: 'Use a supported deposit asset.',
  },
  dh9: {
    title: 'ERC721 tokens not supported as deposit asset',
    hint: 'Use an ERC20 token for deposits.',
  },
  dh10: {
    title: 'Amount below minimum threshold',
    hint: 'Change amount to meet the minimum threshold.',
  },
  dh11: {
    title: 'Withdrawal too soon after deposit',
    hint: 'Wait at least one block after deposit before withdrawing.',
  },
  dh12: {
    title: 'Insufficient balance for withdrawal',
    hint: 'Check if you have enough vault tokens for withdrawal.',
  },
  dh13: {
    title: 'Liquidity allocation invariant breach',
    hint: 'Contact the team on Discord.',
  },
  dh14: {
    title: 'Exit fee transfer failed',
    hint: 'Contact the team on Discord.',
  },
  dh15: {
    title: 'Withdraw asset can not be zero',
    hint: 'Contact the team on Discord.',
  },
  dh16: {
    title: 'Value calculation mismatch during withdrawal',
    hint: 'Try again later or contact the team on Discord if the issue persists.',
  },
  dh17: {
    title: 'Supply calculation mismatch during withdrawal',
    hint: 'Try again later or contact the team on Discord if the issue persists.',
  },
  dh18: {
    title: 'Address can not be zero',
    hint: 'Contact the team on Discord.',
  },
  dh19: {
    title: 'Asset mismatch in complex asset data',
    hint: 'Contact the team on Discord.',
  },
  dh20: {
    title: 'Trading is paused for this vault',
    hint: 'Try again later or contact the team on Discord if the issue persists.',
  },
  dh21: {
    title: 'ERC721 transfer not verified',
    hint: 'If you believe this is a bug, contact the team on Discord.',
  },
  dh22: {
    title: 'Asset not enabled in vault',
    hint: "Add the asset to the vault's supported assets.",
  },
  dh23: {
    title: 'Invalid transaction',
    hint: 'dHEDGE protocol either does not support this action or this is a bug.',
  },
  dh24: {
    title: 'Unauthorized transaction executor',
    hint: 'Only manager, trader, or public transactions are allowed.',
  },
  dh25: {
    title: 'Deposit value below minimum USD requirement',
    hint: 'Increase deposit amount to meet the minimum USD value requirement.',
  },
  dh26: {
    title: 'Withdrawal slippage tolerance exceeded',
    hint: 'Increase slippage tolerance or try again with better market conditions.',
  },
  dh27: {
    title: 'High withdrawal slippage protection triggered',
    hint: 'Try again with better market conditions or contact the team on Discord if the issue persists.',
  },
  dh28: {
    title: 'Unauthorized sender',
    hint: 'Only factory or owner can peform this action.',
  },
  dh29: {
    title: 'Invalid flash loan initiator',
    hint: 'If you believe this is a bug, contact the team on Discord.',
  },
  dh30: {
    title: 'Invalid flash loan sender',
    hint: 'If you believe this is a bug, contact the team on Discord.',
  },
  dh31: {
    title: 'Only PoolManagerLogic contract allowed',
    hint: 'If you believe this is a bug, contact the team on Discord.',
  },
  dh32: {
    title: 'Maximum supply cap reached',
    hint: 'Cannot mint such amount of vault tokens as it would exceed the maximum supply cap.',
  },
}

export const INVALID_PRICES_LIMIT_ORDER_TITLE = 'Invalid limit order prices'
export const LIMIT_ORDER_TRANSACTION_ERRORS: ErrorsMap = {
  InvalidPrices: {
    title: INVALID_PRICES_LIMIT_ORDER_TITLE,
  },
}

export const TRANSACTION_ERROR_KEYS = [
  ...Object.keys(TRANSACTION_ERRORS),
  ...Object.keys(LIMIT_ORDER_TRANSACTION_ERRORS),
]
