import { useCheckWhitelist, usePoolDynamicContractData } from 'hooks/pool'
import { useTradingPanelPoolConfig } from 'hooks/state'

export const useShouldBeWhitelisted = () => {
  const { chainId, address, deprecated } = useTradingPanelPoolConfig()
  const { isPrivateVault = false } = usePoolDynamicContractData({
    address,
    chainId,
  })

  const shouldBeWhitelisted = isPrivateVault || deprecated
  const isAccountWhitelisted = useCheckWhitelist({
    address,
    chainId,
  })

  return { shouldBeWhitelisted, isAccountWhitelisted }
}
