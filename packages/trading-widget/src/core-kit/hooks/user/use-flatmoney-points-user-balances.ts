import { BigNumber } from 'bignumber.js'
import { format } from 'date-fns'

import { FlatcoinPointsModuleABI } from 'core-kit/abi'
import { AddressZero, DEFAULT_PRECISION, base } from 'core-kit/const'
import {
  useAccount,
  useContractReadErrorLogging,
  useReadContracts,
} from 'core-kit/hooks/web3'

import {
  getContractAddressById,
  isEqualAddress,
  isFlatMoneyEarlyDepositorAddress,
} from 'core-kit/utils'

import { useUserTokenBalance } from './use-user-token-balance'
import { usePoolDynamicContractData } from '../pool'
import { useTradingPanelPoolConfig } from '../state'

const FMED_CHAIN_ID = base.id

const getContracts = (vaultAddress: string) => {
  const pointsContractAddress = getContractAddressById(
    'flatcoinPointsModule',
    FMED_CHAIN_ID,
  )

  return [
    {
      address: pointsContractAddress,
      chainId: FMED_CHAIN_ID,
      abi: FlatcoinPointsModuleABI,
      functionName: 'lockedBalance',
      args: [vaultAddress],
    },
    {
      address: pointsContractAddress,
      chainId: FMED_CHAIN_ID,
      abi: FlatcoinPointsModuleABI,
      functionName: 'getUnlockTax',
      args: [vaultAddress],
    },
    {
      address: pointsContractAddress,
      chainId: FMED_CHAIN_ID,
      abi: FlatcoinPointsModuleABI,
      functionName: 'unlockTime',
      args: [vaultAddress],
    },
  ]
}

export const useFlatmoneyPointsUserBalances = () => {
  const { address: vaultAddress, symbol, chainId } = useTradingPanelPoolConfig()
  const { account = AddressZero } = useAccount()
  const balance = useUserTokenBalance({ symbol, address: vaultAddress })
  const { totalSupply } = usePoolDynamicContractData({
    address: vaultAddress,
    chainId,
  })
  const userVaultPortionInPercents = totalSupply
    ? new BigNumber(balance).shiftedBy(DEFAULT_PRECISION).dividedBy(totalSupply)
    : new BigNumber(0)
  const isFmedVault = isFlatMoneyEarlyDepositorAddress(vaultAddress)
  const fetchUserPointsBalances =
    isFmedVault && !isEqualAddress(account, AddressZero)

  const result = useReadContracts({
    contracts: getContracts(vaultAddress),
    query: {
      enabled: fetchUserPointsBalances,
      select: (data) => {
        const [
          pointsLockedVaultBalance,
          pointsUnlockTaxInPercents,
          unlockTime,
        ] = data

        const userPortionOfLockedPointsBalance =
          pointsLockedVaultBalance?.result
            ? new BigNumber(pointsLockedVaultBalance.result.toString())
                .multipliedBy(userVaultPortionInPercents)
                .shiftedBy(-DEFAULT_PRECISION)
            : new BigNumber(0)

        const unlockTaxAmount = pointsUnlockTaxInPercents?.result
          ? userPortionOfLockedPointsBalance
              .multipliedBy(pointsUnlockTaxInPercents.result.toString())
              .shiftedBy(-DEFAULT_PRECISION)
          : new BigNumber(0)
        const unlockTimestamp = unlockTime?.result
          ? Number(unlockTime.result) * 1000
          : null

        return {
          userPortionOfLockedPointsBalance:
            userPortionOfLockedPointsBalance.toFixed(),
          unlockTaxAmount: unlockTaxAmount.toFixed(),
          vestedPointsAmount: userPortionOfLockedPointsBalance
            .minus(unlockTaxAmount)
            .toFixed(),
          unlockTimestamp,
          unlockDate: unlockTimestamp ? format(unlockTimestamp, 'PPP') : null,
        }
      },
    },
  })
  useContractReadErrorLogging(result)
  return result
}
