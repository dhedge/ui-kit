import { AddressZero } from 'core-kit/const'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useUserMulticall } from 'core-kit/hooks/user/multicall/use-user-multicall'
import { useAccount } from 'core-kit/hooks/web3'

export const useWithdrawV2VaultContractAddress = () => {
  const { account = AddressZero } = useAccount()
  const { chainId } = useTradingPanelPoolConfig()
  const { data: { withdrawalContractAddress } = {} } = useUserMulticall({
    address: account,
    chainId,
  })

  return withdrawalContractAddress ?? AddressZero
}
