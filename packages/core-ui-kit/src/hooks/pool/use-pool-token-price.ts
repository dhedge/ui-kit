import { PoolLogicAbi } from 'abi'
import { useTradingPanelPoolFallbackData } from 'hooks/state'
import { useContractReadErrorLogging, useReadContract } from 'hooks/web3'
import type { Address, ChainId } from 'types/web3.types'
import { formatEther, isSynthetixV3Vault, isZeroAddress } from 'utils'

import { usePoolTokenPriceMutable } from './synthetixV3/use-pool-token-price-mutable'

interface PoolTokenPriceParams {
  address: Address
  chainId: ChainId
  formatter?: (tokenPrice: bigint) => string
  disabled?: boolean
}

export const usePoolTokenPrice = ({
  address,
  chainId,
  formatter = formatEther,
  disabled,
}: PoolTokenPriceParams): string => {
  const [poolData] = useTradingPanelPoolFallbackData()
  const isSynthetixVault = isSynthetixV3Vault(address)
  const {
    data: tokenPrice,
    error,
    status,
  } = useReadContract({
    address,
    abi: PoolLogicAbi,
    functionName: 'tokenPrice',
    chainId,
    query: {
      enabled:
        !!address && !isZeroAddress(address) && !isSynthetixVault && !disabled,
    },
  })
  useContractReadErrorLogging({ error, status })

  const mutableTokenPrice = usePoolTokenPriceMutable({
    address,
    chainId,
    disabled: !isSynthetixVault || disabled,
  })

  const contractTokenPrice = isSynthetixVault ? mutableTokenPrice : tokenPrice

  return formatter(contractTokenPrice ?? BigInt(poolData?.tokenPrice ?? '0'))
}
