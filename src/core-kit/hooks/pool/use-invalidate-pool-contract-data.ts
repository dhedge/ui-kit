import { usePoolManagerDynamic } from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useInvalidateOnBlock } from 'core-kit/hooks/web3'

export const useInvalidatePoolContractData = () => {
  const { address, chainId } = useTradingPanelPoolConfig()

  const { queryKey: poolManagerDynamicKey } = usePoolManagerDynamic({
    address,
    chainId,
  })

  useInvalidateOnBlock({ queryKey: poolManagerDynamicKey })
}
