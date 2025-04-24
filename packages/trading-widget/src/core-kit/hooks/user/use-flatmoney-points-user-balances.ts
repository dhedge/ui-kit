import { BigNumber } from 'bignumber.js'
import { format } from 'date-fns'

import { useMemo } from 'react'

import { AddressZero, DEFAULT_PRECISION } from 'core-kit/const'
import {
  usePoolDynamicContractData,
  useVaultVestedPoints,
} from 'core-kit/hooks/pool'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useAccount } from 'core-kit/hooks/web3'

import { isEqualAddress, isFmpAirdropVaultAddress } from 'core-kit/utils'

import { useUserTokenBalance } from './use-user-token-balance'

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
    const { address: vaultAddress, symbol } = useTradingPanelPoolConfig()
    const { account = AddressZero } = useAccount()
    const balance = useUserTokenBalance({ symbol, address: vaultAddress })
    const { totalSupply } = usePoolDynamicContractData({
      address: vaultAddress,
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
      const userVaultPortionInPercents = totalSupply
        ? new BigNumber(balance)
            .shiftedBy(DEFAULT_PRECISION)
            .dividedBy(totalSupply)
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
      totalSupply,
      balance,
      lockedVaultPointsBalance,
      unlockTaxInPercents,
      unlockTime,
      isLoading,
    ])
  }
