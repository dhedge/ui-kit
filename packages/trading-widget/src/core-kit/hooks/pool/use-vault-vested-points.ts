import { FlatcoinPointsModuleAbi } from 'core-kit/abi'
import { base } from 'core-kit/const'

import { useReadContracts } from 'core-kit/hooks/web3'
import type { Address } from 'core-kit/types'
import { getContractAddressById } from 'core-kit/utils'

const FLAT_MONEY_CHAIN_ID = base.id

interface UseFmedVestedPointsProps {
  enabled?: boolean
  address: Address
}

const getContracts = (vaultAddress: string) => {
  const pointsContractAddress = getContractAddressById(
    'flatcoinPointsModule',
    FLAT_MONEY_CHAIN_ID,
  )

  return [
    {
      address: pointsContractAddress,
      chainId: FLAT_MONEY_CHAIN_ID,
      abi: FlatcoinPointsModuleAbi,
      functionName: 'lockedBalance',
      args: [vaultAddress],
    },
    {
      address: pointsContractAddress,
      chainId: FLAT_MONEY_CHAIN_ID,
      abi: FlatcoinPointsModuleAbi,
      functionName: 'getUnlockTax',
      args: [vaultAddress],
    },
    {
      address: pointsContractAddress,
      chainId: FLAT_MONEY_CHAIN_ID,
      abi: FlatcoinPointsModuleAbi,
      functionName: 'unlockTime',
      args: [vaultAddress],
    },
  ]
}

export const useVaultVestedPoints = ({
  enabled,
  address,
}: UseFmedVestedPointsProps) =>
  useReadContracts({
    contracts: getContracts(address),
    query: {
      enabled,
      select: (data) => {
        const [lockedVaultPointsBalance, unlockTaxInPercents, unlockTime] = data

        return {
          lockedVaultPointsBalance: lockedVaultPointsBalance?.result,
          unlockTaxInPercents: unlockTaxInPercents?.result,
          unlockTime: unlockTime?.result,
        }
      },
    },
  })
