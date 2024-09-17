import { getAbiItem } from 'viem'

import {
  PoolFactoryAbi,
  SynthetixV3ContractGuard,
  SynthetixV3CoreAbi,
} from 'core-kit/abi'
import { AddressZero } from 'core-kit/const'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useReadContract, useReadContracts } from 'core-kit/hooks/web3'

import { getContractAddressById, normalizeNumber } from 'core-kit/utils'

const getAccountNftTokenIdFn = 'getAccountNftTokenId'
const dHedgeVaultsWhitelistFn = 'dHedgeVaultsWhitelist'

const abi = [
  getAbiItem({ abi: SynthetixV3ContractGuard, name: getAccountNftTokenIdFn }),
  getAbiItem({ abi: SynthetixV3ContractGuard, name: dHedgeVaultsWhitelistFn }),
] as const

export const useAvailableWithdrawLiquidity = (params?: {
  enabled?: boolean
}) => {
  const { chainId, address } = useTradingPanelPoolConfig()
  const synthetixV3CoreAddress = getContractAddressById(
    'synthetixV3Core',
    chainId,
  )

  const { data: contractGuardAddress } = useReadContract({
    address: getContractAddressById('factory', chainId),
    abi: PoolFactoryAbi,
    chainId,
    functionName: 'getContractGuard',
    args: [synthetixV3CoreAddress],
    query: {
      staleTime: Infinity,
      enabled: !!params?.enabled,
    },
  })

  const guardContractData = {
    address: contractGuardAddress,
    abi,
    chainId,
  }

  const { data: contractGuardData } = useReadContracts({
    contracts: [
      {
        ...guardContractData,
        functionName: getAccountNftTokenIdFn,
        args: [address, synthetixV3CoreAddress],
      },
      {
        ...guardContractData,
        functionName: dHedgeVaultsWhitelistFn,
        args: [address],
      },
    ],
    query: {
      enabled: !!contractGuardAddress,
      staleTime: Infinity,
    },
  })

  return useReadContract({
    address: synthetixV3CoreAddress,
    abi: SynthetixV3CoreAbi,
    chainId,
    functionName: 'getAccountAvailableCollateral',
    args: [
      contractGuardData?.[0]?.result ?? BigInt(0),
      contractGuardData?.[1]?.result?.[1] ?? AddressZero,
    ],
    query: {
      enabled:
        !!contractGuardAddress &&
        contractGuardData?.every(({ result }) => !!result),
      staleTime: Infinity,
      select: (data) => {
        const value = normalizeNumber(data.toString())
        return {
          address: contractGuardData?.[1]?.result?.[1] ?? AddressZero,
          value,
          formatted: new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 2,
          }).format(value),
        }
      },
    },
  })
}
