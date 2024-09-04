import { usePoolDynamicContractData } from 'core-kit/hooks/pool'
import { usePoolStatic } from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'

export const useIsCustomCooldownDeposit = () => {
  const { chainId, address } = useTradingPanelPoolConfig()
  const { data: { isCustomCooldownDepositAllowed = false } = {} } =
    usePoolStatic({
      address,
      chainId,
    })
  const { entryFee = '0' } = usePoolDynamicContractData({ address, chainId })
  const entryFeeEnabled = +entryFee > 0
  return entryFeeEnabled && isCustomCooldownDepositAllowed
}
