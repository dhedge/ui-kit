import { useTradingPanelPoolFallbackData } from 'hooks/state'
import type { Address, ChainId } from 'types/web3.types'
import { formatEther, isSynthetixV3Vault } from 'utils'

import { usePoolTokenPriceMutable } from './synthetixV3/use-pool-token-price-mutable'
import { usePoolDynamicContractData } from './use-pool-dynamic-contract-data'

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

  const { tokenPrice } = usePoolDynamicContractData({ address, chainId })

  const mutableTokenPrice = usePoolTokenPriceMutable({
    address,
    chainId,
    disabled: !isSynthetixVault || disabled,
  })

  const contractTokenPrice = isSynthetixVault ? mutableTokenPrice : tokenPrice

  return formatter(BigInt(contractTokenPrice ?? poolData?.tokenPrice ?? '0'))
}
