export const GAS_ESTIMATION_ERROR = 'Gas estimate error occurred'

export const DEFAULT_ERROR_MESSAGE = 'See console logs to report error details.'

export const DEFAULT_SIMULATION_ERROR = 'Missing simulation params'

export const SIMULATION_TIMEOUT_ERROR = 'Simulation timeout'

export const DEPOSIT_SWAP_DATA_ERROR = 'swap_data_deposit_error'
export const WITHDRAW_SWAP_DATA_ERROR = 'swap_data_withdraw_error'

const lowSlippageError = {
  title: 'Low Slippage',
  hint: 'Please increase slippage tolerance and try again.',
}

export const TRANSACTION_ERRORS: Record<
  string,
  { title: string; hint?: string }
> = {
  'invalid liquidityMinted': lowSlippageError,
  'high withdraw slippage': lowSlippageError,
  'high deposit slippage': lowSlippageError,
  'high swap slippage': lowSlippageError,
  InsufficientAmountReceived: lowSlippageError,
  SwapFailed: {
    title: 'Swap Failed',
    hint: 'Please refresh the swap quote and try again.',
  },
  'assetType not handled': {
    title: 'Single Asset Withdrawal not available',
    hint: 'Please use All Assets option.',
  },
  [DEPOSIT_SWAP_DATA_ERROR]: {
    title: 'Swap Quote Fetching Error',
    hint: 'Please select a different deposit option or refresh the swap quote.',
  },
  [WITHDRAW_SWAP_DATA_ERROR]: {
    title: 'Swap Quote Fetching Error',
    hint: 'Please refresh the swap quote or claim your assets without a swap.',
  },
}
