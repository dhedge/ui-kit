import { usePoolFees } from 'core-kit/hooks/pool'
import { usePoolStatic } from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'

export const useIsCustomCooldownDeposit = () => {
  const { chainId, address, isCustomCooldownDeposit } =
    useTradingPanelPoolConfig()
  const { data: { isCustomCooldownDepositAllowed = false } = {} } =
    usePoolStatic({
      address,
      chainId,
    })
  const { entryFeeNumber } = usePoolFees({ address, chainId })
  const entryFeeEnabled = entryFeeNumber > 0

  if (isCustomCooldownDeposit) {
    return true
  }

  return entryFeeEnabled && isCustomCooldownDepositAllowed
}
