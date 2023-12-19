import { formatDuration, intervalToDuration } from 'date-fns'

import { PoolLogicAbi } from 'abi'
import { AddressZero } from 'const'
import { useManagerLogicAddress, useTotalFundValueMutable } from 'hooks/pool'
import {
  useAccount,
  useContractReads,
  useContractReadsErrorLogging,
} from 'hooks/web3'
import type { Address, ChainId } from 'types/web3.types'
import { isSynthetixVault, isZeroAddress } from 'utils'

interface FundSummary {
  creationTime: bigint
  exitFeeDenominator: bigint
  exitFeeNumerator: bigint
  manager: Address
  managerFeeDenominator: bigint
  managerFeeNumerator: bigint
  managerName: string
  name: string
  performanceFeeNumerator: bigint
  privatePool: boolean
  totalFundValue: bigint
  totalSupply: bigint
  entryFeeNumerator: bigint
}

export const getDataFromSummary = (summary?: FundSummary) => {
  const totalSupply = summary?.totalSupply?.toString() ?? ''
  const totalValue = summary?.totalFundValue?.toString() ?? ''
  const isPrivate = summary?.privatePool
  const performanceFee = summary?.performanceFeeNumerator?.toString() ?? ''
  const streamingFee = summary?.managerFeeNumerator?.toString() ?? ''
  const entryFee = summary?.entryFeeNumerator?.toString() ?? ''

  return {
    isPrivate,
    performanceFee,
    streamingFee,
    totalSupply,
    totalValue,
    entryFee,
  }
}

interface PoolDynamicContractDataParams {
  address: Address
  chainId: ChainId
}

export const usePoolDynamicContractData = ({
  address,
  chainId,
}: PoolDynamicContractDataParams) => {
  const { account } = useAccount()
  const isSynthetixV3Vault = isSynthetixVault(address)
  const managerLogicAddress = useManagerLogicAddress({
    address,
    chainId,
  })
  const totalFundValueMutable = useTotalFundValueMutable({
    vaultManagerLogicAddress: managerLogicAddress,
    chainId,
    disabled: !isSynthetixV3Vault,
  })

  const { data, isFetched } = useContractReads({
    contracts: [
      {
        address,
        abi: PoolLogicAbi,
        functionName: 'getExitRemainingCooldown',
        chainId,
        args: [account ?? AddressZero],
      },
      {
        address,
        abi: PoolLogicAbi,
        functionName: 'getFundSummary',
        chainId,
      },
    ],
    enabled: !isZeroAddress(address),
  })
  useContractReadsErrorLogging(data)
  const exitCooldown = data?.[0]?.result
  const summary = getDataFromSummary(data?.[1]?.result)

  const cooldown = exitCooldown ? Number(exitCooldown) * 1000 : 0
  const cooldownEndsInTime = formatDuration(
    intervalToDuration({ start: 0, end: cooldown }),
  )

  return {
    cooldownActive: cooldown > 0,
    cooldownEndsInTime,
    ...summary,
    totalValue: isSynthetixV3Vault
      ? totalFundValueMutable ?? summary.totalValue
      : summary.totalValue,
    isFetched,
  }
}
