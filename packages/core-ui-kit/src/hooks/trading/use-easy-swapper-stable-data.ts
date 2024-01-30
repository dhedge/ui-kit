import { DhedgeEasySwapperAbi } from 'abi'
import { useReadContracts, useContractReadsErrorLogging } from 'hooks/web3'
import type { Address, ChainId } from 'types/web3.types'
import { getContractAddressById, isSynthetixV3Vault } from 'utils'

interface EasySwapperStableData {
  poolAddress: Address
  chainId: ChainId
  skip?: boolean
}

export const useEasySwapperStableData = ({
  poolAddress,
  chainId,
  skip,
}: EasySwapperStableData) => {
  const isSynthetixVault = isSynthetixV3Vault(poolAddress)
  const { data } = useReadContracts({
    contracts: [
      {
        address: getContractAddressById('easySwapper', chainId),
        abi: DhedgeEasySwapperAbi,
        functionName: 'allowedPools',
        args: [poolAddress],
        chainId,
      },
      {
        address: getContractAddressById('easySwapper', chainId),
        abi: DhedgeEasySwapperAbi,
        functionName: 'feeNumerator',
        chainId,
      },
      {
        address: getContractAddressById('easySwapper', chainId),
        abi: DhedgeEasySwapperAbi,
        functionName: 'feeDenominator',
        chainId,
      },
    ],
    query: {
      enabled: !skip && !isSynthetixVault,
      staleTime: Infinity,
    },
  })
  useContractReadsErrorLogging(data)
  const isEasySwapperAllowedPool = !!data?.[0]?.result
  const feeNumerator = data?.[1]?.result
  const feeDenominator = data?.[2]?.result

  return {
    isEasySwapperAllowedPool,
    feeNumerator,
    feeDenominator,
  }
}
