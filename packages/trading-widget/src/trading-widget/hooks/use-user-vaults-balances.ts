import { usePoolsDynamic } from '@dhedge/core-ui-kit/hooks/pool'
import { useAccount } from '@dhedge/core-ui-kit/hooks/web3'
import { isEqualAddress } from '@dhedge/core-ui-kit/utils'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import type { UserPoolBalances } from 'trading-widget/types'

import { useUserStakedPools } from './use-user-staked-pools'
import { formatBalance } from 'trading-widget/utils/format'

export const useUserVaultsBalances = (): UserPoolBalances => {
  const { account } = useAccount()
  const stakedPools = useUserStakedPools()

  const { data = {} } = usePoolsDynamic()
  return useMemo(() => {
    if (!account) {
      return {}
    }

    return Object.entries(data).reduce((acc, [address, data]) => {
      const stakedBalance = stakedPools?.find((vault) =>
        isEqualAddress(address, vault.address),
      )
      const totalBalance = new BigNumber(stakedBalance?.amount ?? '0')
        .plus(data?.userBalance ?? '0')
        .toFixed()

      const formattedBalance = {
        ...formatBalance(
          BigInt(totalBalance),
          data?.tokenPrice ? BigInt(data.tokenPrice) : BigInt(0),
        ),
        includesStakedTokens: !!stakedBalance,
      }

      if (formattedBalance.balanceInUsdNumber > 0) {
        return { ...acc, [address]: formattedBalance }
      }

      return acc
    }, {})
  }, [account, data, stakedPools])
}
