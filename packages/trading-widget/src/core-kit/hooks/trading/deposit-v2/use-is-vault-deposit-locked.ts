import { useCheckWhitelist } from 'core-kit/hooks/pool'
import { usePoolDynamic } from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'

export const useIsVaultDepositLocked = () => {
  const { chainId, address, deprecated } = useTradingPanelPoolConfig()
  const { data: { isPrivateVault } = { isPrivateVault: false } } =
    usePoolDynamic({
      address,
      chainId,
    })

  const isVaultDepositLocked = isPrivateVault || deprecated
  const isAccountWhitelisted = useCheckWhitelist({
    address,
    chainId,
  })

  return { isVaultDepositLocked, isAccountWhitelisted }
}
