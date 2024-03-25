import { usePoolManagerDynamic } from './multicall'
import { useTradingPanelPoolConfig } from '../state'
import { useInvalidateOnBlock } from '../web3'

export const useInvalidatePoolContractData = () => {
  const { address, chainId } = useTradingPanelPoolConfig()

  const { queryKey: poolManagerDynamicKey } = usePoolManagerDynamic({
    address,
    chainId,
  })

  useInvalidateOnBlock({ queryKey: poolManagerDynamicKey })
}
