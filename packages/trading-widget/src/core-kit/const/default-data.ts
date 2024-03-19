import { formatDuration } from 'date-fns'
import { optimism } from 'wagmi/chains'

import type { PoolConfig } from 'core-kit/types/config.types'
import type { DepositMethodName } from 'core-kit/types/trading-panel.types'
import type { PoolDepositMethodName } from 'core-kit/types/trading.types'

import { AddressZero } from './web3'

export const DEFAULT_PRECISION = 18

export const DEFAULT_POLLING_INTERVAL = 59_000
export const SHORTEN_POLLING_INTERVAL = 30_000

export const DEFAULT_LOCK_TIME = formatDuration({ hours: 24 })
export const CUSTOM_LOCK_TIME = formatDuration({ minutes: 15 })

export const DEFAULT_DEPOSIT_LOCKTIME_MAP: Record<
  PoolDepositMethodName,
  string
> = {
  deposit: DEFAULT_LOCK_TIME,
  depositWithCustomCooldown: CUSTOM_LOCK_TIME,
}
export const DEFAULT_CHAIN_ID = optimism.id
export const EMPTY_POOL_CONFIG: PoolConfig = {
  address: AddressZero,
  symbol: '',
  chainId: DEFAULT_CHAIN_ID,
  depositParams: { customTokens: [] },
  withdrawParams: { customTokens: [] },
  deprecated: false,
}

export const DEFAULT_DEPOSIT_METHOD: DepositMethodName = 'deposit'

export const DEFAULT_WITHDRAW_SLIPPAGE = 3
export const DEFAULT_DEPOSIT_SLIPPAGE = 0

export const DEFAULT_WITHDRAW_SLIPPAGE_SCALE = [
  0.1,
  0.3,
  0.5,
  1,
  1.5,
  DEFAULT_WITHDRAW_SLIPPAGE,
]
export const DEFAULT_DEPOSIT_SLIPPAGE_SCALE = [DEFAULT_DEPOSIT_SLIPPAGE]

export const DEFAULT_WITHDRAW_METHOD = 'withdraw'

export const NATIVE_TOKEN_DEPOSIT_GAS_LIMIT = 4200000

export const GAS_LIMIT_BUFFER_COEFF = 1.25

export const DEPOSIT_QUOTE_MULTIPLIER_DEFAULT = 0.9997
export const DEPOSIT_QUOTE_MULTIPLIER_CUSTOM = 0.999

export const MANAGER_FEE_DENOMINATOR = 10000 // GetMaximumFee

export const DEFAULT_PROMISE_TIMEOUT_MS = 13000
