import { PoolLogicAbi } from 'abi'
import { useTradingPanelPoolFallbackData } from 'hooks/state'
import { useContractRead, useContractReadErrorLogging } from 'hooks/web3'
import type { Address, ChainId } from 'types/web3.types'
import { formatEther, isSynthetixV3Vault, isZeroAddress } from 'utils'

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
  const isSynthetixVault = isSynthetixV3Vault(address)
  const {
    data: tokenPrice,
    error,
    status,
  } = useContractRead({
    address,
    abi: PoolLogicAbi,
    functionName: 'tokenPrice',
    chainId,
    enabled: !!address && !isZeroAddress(address) && !isSynthetixVault,
  })
  useContractReadErrorLogging({ error, status })

  const mutableTokenPrice = usePoolTokenPriceMutable({
    address,
    chainId,
    disabled: !isSynthetixVault,
  })

  const contractTokenPrice = isSynthetixVault ? mutableTokenPrice : tokenPrice

  return formatter(contractTokenPrice ?? BigInt(poolData?.tokenPrice ?? '0'))
}
