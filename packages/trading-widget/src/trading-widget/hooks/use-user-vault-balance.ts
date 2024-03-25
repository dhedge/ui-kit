import type { Address } from 'core-kit/types'

import type { Balance } from 'trading-widget/types'

import { useUserVaultsBalances } from './use-user-vaults-balances'

export const useUserVaultBalance = (address: Address): Balance | undefined =>
  useUserVaultsBalances()[address]
