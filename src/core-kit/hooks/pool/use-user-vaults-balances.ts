import { useMemo } from 'react'

import { AddressZero } from 'core-kit/const'
import { useUserBalancesDynamic } from 'core-kit/hooks/pool/multicall'
import { useAccount } from 'core-kit/hooks/web3'

import type { Address, UserPoolBalances } from 'core-kit/types'
import { formatVaultBalance, isZeroAddress } from 'core-kit/utils'

interface UseUserVaultsBalancesParams {
  account?: Address
}

export const useUserVaultsBalances = ({
  account,
}: UseUserVaultsBalancesParams = {}): UserPoolBalances => {
  const { account: connetedAccount } = useAccount()
  const accountToUse = account ?? connetedAccount ?? AddressZero

  const { data: vaultBalances } = useUserBalancesDynamic({
    account: accountToUse,
  })

  return useMemo(() => {
    if (isZeroAddress(accountToUse)) {
      return {}
    }

    return Object.entries(vaultBalances ?? {}).reduce(
      (acc, [address, vault]) => {
        const formattedBalance = formatVaultBalance(
          BigInt(vault.balance ?? '0'),
          BigInt(vault.tokenPrice ?? '0'),
        )
        if (formattedBalance.balanceInUsdNumber > 0) {
          return { ...acc, [address]: formattedBalance }
        }

        return acc
      },
      {},
    )
  }, [accountToUse, vaultBalances])
}
