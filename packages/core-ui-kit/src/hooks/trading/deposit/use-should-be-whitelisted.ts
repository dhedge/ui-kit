import { useCheckWhitelist, usePoolDynamicContractData } from 'hooks/pool'
import { useTradingPanelPoolConfig } from 'hooks/state'

export const useShouldBeWhitelisted = () => {
  const { chainId, address, deprecated } = useTradingPanelPoolConfig()
  const { isPrivate } = usePoolDynamicContractData({ address, chainId })

  const shouldBeWhitelisted = isPrivate || deprecated
  const isAccountWhitelisted = useCheckWhitelist({
    address,
    chainId: shouldBeWhitelisted ? chainId : undefined,
  })

  return { shouldBeWhitelisted, isAccountWhitelisted }
}
