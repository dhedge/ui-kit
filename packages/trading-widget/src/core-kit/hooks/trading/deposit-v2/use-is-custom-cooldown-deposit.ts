import { usePoolStatic } from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'

// Defaults to always try to use custom cooldown deposit, except when we know it's explicitly disallowed on the contracts side.
// Can help to avoid cases when regular deposit was made due to some errors. Custom (lower) lockup time is always better (if it's available on the vault) than 24 hours.

// Worst case scenarios:
// 1. isCustomCooldownDepositAllowed is true, but vault has no entry fee set -> custom cooldown deposit will revert.
//    Revert is better than fallback to regular deposit, which will silently execute regular deposit and won't let us know that vault is not properly configured.
// 2. isCustomCooldownDepositAllowed is true, and there was an error fetching entry fee -> custom cooldown deposit will either succeed (if entry fee is actually set) or revert (if it's not set).
//    Revert is better than fallback to regular deposit, because we can't guarantee it's what user wants.
// 3. isCustomCooldownDepositAllowed didn't return anything, vault is set to customCooldownDepositsWhitelist -> custom cooldown deposit will succeed.
// 4. isCustomCooldownDepositAllowed didn't return anything, vault is not set to customCooldownDepositsWhitelist -> custom cooldown deposit will revert.
//    Revert is OK, because otherwise fallback to regular deposit is made and silently executed, which might be not what user wants. Not being able to deposit at all is safer than depositing with unexpected lockup time.
export const useIsCustomCooldownDeposit = () => {
  const { chainId, address } = useTradingPanelPoolConfig()
  const { data: { isCustomCooldownDepositAllowed } = {} } = usePoolStatic({
    address,
    chainId,
  })

  if (isCustomCooldownDepositAllowed === false) return false

  return true
}
