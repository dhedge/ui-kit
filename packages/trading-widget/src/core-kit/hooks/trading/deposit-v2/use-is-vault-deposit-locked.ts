import {
  useCheckWhitelist,
  usePoolDynamicContractData,
} from 'core-kit/hooks/pool'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'

export const useIsVaultDepositLocked = () => {
  const { chainId, address, deprecated } = useTradingPanelPoolConfig()
  const { isPrivateVault = false } = usePoolDynamicContractData({
    address,
  })

  const isVaultDepositLocked = isPrivateVault || deprecated
  const isAccountWhitelisted = useCheckWhitelist({
    address,
    chainId,
  })

  return { isVaultDepositLocked, isAccountWhitelisted }
}
