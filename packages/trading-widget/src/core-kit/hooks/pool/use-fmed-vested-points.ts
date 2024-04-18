import { FlatcoinPointsModuleABI } from 'core-kit/abi'
import { base } from 'core-kit/const'

import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import {
  useContractReadErrorLogging,
  useReadContracts,
} from 'core-kit/hooks/web3'
import { getContractAddressById } from 'core-kit/utils'

const FMED_CHAIN_ID = base.id

interface UseFmedVestedPointsProps {
  enabled?: boolean
}

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

export const useFmedVestedPoints = ({
  enabled,
}: UseFmedVestedPointsProps | undefined = {}) => {
  const { address: vaultAddress } = useTradingPanelPoolConfig()
  const result = useReadContracts({
    contracts: getContracts(vaultAddress),
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
  useContractReadErrorLogging(result)

  return result
}
