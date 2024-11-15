import { formatDuration } from 'date-fns'
import { optimism } from 'wagmi/chains'

import type { PoolConfig } from 'core-kit/types/config.types'
import type { DepositMethodName } from 'core-kit/types/trading.types'

import { AddressZero } from './web3'

export const DEFAULT_PRECISION = 18

export const DEFAULT_POLLING_INTERVAL = 59_000
export const SHORTEN_POLLING_INTERVAL = 30_000
export const EXTREMELY_SHORT_POLLING_INTERVAL = 15_000
export const DEFAULT_RETRIES_NUMBER = 5
export const DEFAULT_DEBOUNCE_TIME = 400
export const EXTENDED_DEBOUNCE_TIME = DEFAULT_DEBOUNCE_TIME * 1.2

export const DEFAULT_LOCK_TIME = formatDuration({ hours: 24 })

export const EMPTY_POOL_CONFIG: PoolConfig = {
  address: AddressZero,
  symbol: '',
  chainId: optimism.id,
  depositParams: { customTokens: [] },
  withdrawParams: { customTokens: [] },
  deprecated: false,
}

export const DEFAULT_DEPOSIT_METHOD: DepositMethodName = 'deposit'

export const DEFAULT_WITHDRAW_SLIPPAGE = 1 // %
export const DEFAULT_DEPOSIT_SLIPPAGE = 0 // %
export const DEFAULT_NO_SWAP_MIN_DEPOSIT_AMOUNT_GAP = 0.5 // %
export const DEFAULT_SWAP_TRANSACTION_SLIPPAGE = 0.3 // %

export const DEFAULT_DEPOSIT_SLIPPAGE_SCALE = [DEFAULT_DEPOSIT_SLIPPAGE]

export const DEFAULT_MULTI_ASSET_WITHDRAW_METHOD = 'withdrawSafe'
export const EASY_SWAPPER_V2_INITIATE_WITHDRAW_METHOD = 'initWithdrawal'
export const EASY_SWAPPER_V2_UNROLL_AND_CLAIM_METHOD = 'unrollAndClaim'
export const EASY_SWAPPER_V2_COMPLETE_WITHDRAW_METHOD = 'completeWithdrawal'

export const NATIVE_TOKEN_DEPOSIT_GAS_LIMIT = 4200000

export const GAS_LIMIT_BUFFER_COEFF = 1.25

export const MANAGER_FEE_DENOMINATOR = 10000

export const DEFAULT_PROMISE_TIMEOUT_MS = 13000

export const DEFAULT_VISIBLE_ASSETS_LIMIT = 3
export const SWAP_QUOTE_REFRESH_INTERVAL = 20000
