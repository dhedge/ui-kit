import { PoolLogicAbi } from 'abi'
import { useTradingPanelPoolFallbackData } from 'hooks/state'
import { useContractRead, useContractReadErrorLogging } from 'hooks/web3'
import type { Address, ChainId } from 'types/web3.types'
import { formatEther, isZeroAddress } from 'utils'

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

  const {
    data: tokenPrice,
    error,
    status,
  } = useContractRead({
    address,
    abi: PoolLogicAbi,
    functionName: 'tokenPrice',
    chainId,
    enabled: !!address && !isZeroAddress(address),
  })
  useContractReadErrorLogging({ error, status })

  return formatter(tokenPrice ?? BigInt(poolData?.tokenPrice ?? '0'))
}
