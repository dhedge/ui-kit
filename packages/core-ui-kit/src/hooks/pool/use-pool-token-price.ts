import { PoolLogicAbi } from 'abi'
import { useTradingPanelPoolFallbackData } from 'hooks/state'
import { useContractRead, useContractReadErrorLogging } from 'hooks/web3'
import type { Address, ChainId } from 'types/web3.types'
import { formatEther, isZeroAddress, isSynthetixVault } from 'utils'

import { usePoolTokenPriceMutable } from './synthetixV3/use-pool-token-price-mutable'

interface PoolTokenPriceParams {
  address: Address
  chainId: ChainId
  formatter?: (tokenPrice: bigint) => string
}

export const usePoolTokenPrice = ({
  address,
  chainId,
  formatter = formatEther,
}: PoolTokenPriceParams): string => {
  const [poolData] = useTradingPanelPoolFallbackData()
  const isSynthetixV3Vault = isSynthetixVault(address)
  const {
    data: tokenPrice,
    error,
    status,
  } = useContractRead({
    address,
    abi: PoolLogicAbi,
    functionName: 'tokenPrice',
    chainId,
    enabled: !!address && !isZeroAddress(address) && !isSynthetixV3Vault,
  })
  useContractReadErrorLogging({ error, status })

  const mutableTokenPrice = usePoolTokenPriceMutable({
    address,
    chainId,
    disabled: !isSynthetixV3Vault,
  })

  const contractTokenPrice = isSynthetixV3Vault ? mutableTokenPrice : tokenPrice

  return formatter(contractTokenPrice ?? BigInt(poolData?.tokenPrice ?? '0'))
}
