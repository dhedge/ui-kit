import { useStaticCall } from 'hooks/web3'
import type { Address, ChainId } from 'types'

interface UseTotalFundsValueMutable {
  vaultManagerLogicAddress: Address | undefined
  chainId?: ChainId
  disabled?: boolean
}

export const useTotalFundValueMutable = ({
  vaultManagerLogicAddress,
  chainId,
  disabled,
}: UseTotalFundsValueMutable) =>
  useStaticCall<bigint>({
    dynamicContractAddress: vaultManagerLogicAddress,
    contractId: 'poolManagerLogic',
    chainId,
    functionName: 'totalFundValueMutable',
    args: [],
    disabled,
  })?.toString() ?? ''
