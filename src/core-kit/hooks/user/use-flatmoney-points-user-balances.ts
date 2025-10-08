import { BigNumber } from 'bignumber.js'
import { format } from 'date-fns'

import { useMemo } from 'react'

import { AddressZero, DEFAULT_PRECISION } from 'core-kit/const'
import { useVaultVestedPoints } from 'core-kit/hooks/pool'
import { usePoolDynamic } from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useUserTokenBalance } from 'core-kit/hooks/user/use-user-token-balance'
import { useAccount } from 'core-kit/hooks/web3'

import { isEqualAddress, isFmpAirdropVaultAddress } from 'core-kit/utils'

interface UseFlatmoneyPointsUserBalancesData {
  userPortionOfLockedPointsBalance: string
  unlockTaxAmount: string
  vestedPointsAmount: string
  unlockTimestamp: number | null
  unlockDate: string | null
  isLoading: boolean
}

export const useFlatmoneyPointsUserBalances =
  (): UseFlatmoneyPointsUserBalancesData => {
    const {
      address: vaultAddress,
      symbol,
      chainId,
    } = useTradingPanelPoolConfig()
    const { account = AddressZero } = useAccount()
    const balance = useUserTokenBalance({ symbol, address: vaultAddress })
    const { data: { totalSupplyD18 } = {} } = usePoolDynamic({
      address: vaultAddress,
      chainId,
    })

    const isFmpAirdropVault = isFmpAirdropVaultAddress(vaultAddress)
    const fetchUserPointsBalances =
      isFmpAirdropVault && !isEqualAddress(account, AddressZero)

    const {
      data: { lockedVaultPointsBalance, unlockTaxInPercents, unlockTime } = {},
      isLoading,
    } = useVaultVestedPoints({
      enabled: fetchUserPointsBalances,
      address: vaultAddress,
    })

    return useMemo(() => {
      const userVaultPortionInPercents = totalSupplyD18
        ? new BigNumber(balance)
            .shiftedBy(DEFAULT_PRECISION)
            .dividedBy(totalSupplyD18)
        : new BigNumber(0)
      const userPortionOfLockedPointsBalance = lockedVaultPointsBalance
        ? new BigNumber(lockedVaultPointsBalance.toString())
            .multipliedBy(userVaultPortionInPercents)
            .shiftedBy(-DEFAULT_PRECISION)
        : new BigNumber(0)

      const unlockTaxAmount = unlockTaxInPercents
        ? userPortionOfLockedPointsBalance
            .multipliedBy(unlockTaxInPercents.toString())
            .shiftedBy(-DEFAULT_PRECISION)
        : new BigNumber(0)
      const unlockTimestamp = unlockTime ? Number(unlockTime) * 1000 : null

      return {
        userPortionOfLockedPointsBalance:
          userPortionOfLockedPointsBalance.toFixed(),
        unlockTaxAmount: unlockTaxAmount.toFixed(),
        vestedPointsAmount: userPortionOfLockedPointsBalance
          .minus(unlockTaxAmount)
          .toFixed(),
        unlockTimestamp,
        unlockDate: unlockTimestamp ? format(unlockTimestamp, 'PPP') : null,
        isLoading,
      }
    }, [
      totalSupplyD18,
      balance,
      lockedVaultPointsBalance,
      unlockTaxInPercents,
      unlockTime,
      isLoading,
    ])
  }
