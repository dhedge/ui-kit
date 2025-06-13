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

export const EASY_SWAPPER_TRANSACTION_ERRORS: ErrorsMap = {
  'invalid liquidityMinted': lowSlippageError,
  'high withdraw slippage': lowSlippageError,
  'high deposit slippage': lowSlippageError,
  'high swap slippage': lowSlippageError,
  InsufficientAmountReceived: lowSlippageError,
  SwapFailed: {
    title: 'Swap Failed',
    hint: 'Please refresh the swap quote or choose another swap source and try again.',
  },
  'assetType not handled': {
    title: 'Single Asset Withdrawal not available',
    hint: 'Please use All Assets option.',
  },
  [DEPOSIT_SWAP_DATA_ERROR]: {
    title: 'Swap Quote Fetching Error',
    hint: 'Please select a different deposit option, refresh the swap quote, or choose another swap source.',
  },
  [WITHDRAW_SWAP_DATA_ERROR]: {
    title: 'Swap Quote Fetching Error',
    hint: 'Please refresh the swap quote, choose another swap source, or claim your assets without a swap.',
  },
}

export const INVALID_PRICES_LIMIT_ORDER_TITLE = 'Invalid limit order prices'
export const LIMIT_ORDER_TRANSACTION_ERRORS: ErrorsMap = {
  InvalidPrices: {
    title: INVALID_PRICES_LIMIT_ORDER_TITLE,
  },
}
