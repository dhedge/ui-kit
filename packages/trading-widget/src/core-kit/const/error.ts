export const GAS_ESTIMATION_ERROR = 'Gas estimate error occurred'

export const DEFAULT_ERROR_MESSAGE = 'See console logs to report error details.'

export const DEFAULT_SIMULATION_ERROR = 'Missing simulation params'

export const SIMULATION_TIMEOUT_ERROR = 'Simulation timeout'

export const TRANSACTION_ERRORS: Record<
  string,
  { title: string; hint?: string }
> = {
  'invalid liquidityMinted': {
    title: 'Low Slippage',
    hint: 'Please increase slippage tolerance and try again.',
  },
  'high withdraw slippage': {
    title: 'Low Slippage',
    hint: 'Please increase slippage tolerance and try again.',
  },
  'high deposit slippage!': {
    title: 'Low Slippage',
    hint: 'Please increase slippage tolerance and try again.',
  },
  'assetType not handled': {
    title: 'Single Asset Withdrawal not available',
    hint: 'Please use All Assets option.',
  },
}
