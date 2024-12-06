import { formatDuration, intervalToDuration } from 'date-fns'

import {
  useManagerLogicAddress,
  useTotalFundValueMutable,
} from 'core-kit/hooks/pool'
import { usePoolsDynamic } from 'core-kit/hooks/pool/multicall'
import type { Address, ChainId } from 'core-kit/types/web3.types'
import { isSynthetixV3Vault } from 'core-kit/utils'

interface PoolDynamicContractDataParams {
  address: Address
  chainId: ChainId
}

export const usePoolDynamicContractData = ({
  address,
  chainId,
}: PoolDynamicContractDataParams) => {
  const isSynthetixVault = isSynthetixV3Vault(address)
  const { data: poolsMap, isFetched } = usePoolsDynamic()
  const dynamicPoolData = poolsMap?.[address]

  // logic related to Synthetix V3 vault
  const managerLogicAddress = useManagerLogicAddress({
    address,
    chainId,
  })
  const totalFundValueMutable = useTotalFundValueMutable({
    vaultManagerLogicAddress: managerLogicAddress,
    chainId,
    disabled: !isSynthetixVault,
  })

  const cooldown = dynamicPoolData?.getExitRemainingCooldown
    ? Number(dynamicPoolData.getExitRemainingCooldown) * 1000
    : 0
  const cooldownEndsInTime = formatDuration(
    intervalToDuration({ start: 0, end: cooldown }),
  )

  return {
    cooldownActive: cooldown > 0,
    cooldownEndsInTime,
    ...dynamicPoolData,
    totalValue: isSynthetixVault
      ? (totalFundValueMutable ?? dynamicPoolData?.totalValue)
      : dynamicPoolData?.totalValue,
    isFetched,
  }
}
