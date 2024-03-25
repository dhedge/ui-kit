import { useStaticCallQuery } from 'core-kit/hooks/web3'
import type { Address, ChainId } from 'core-kit/types'

interface UseTotalFundsValueMutable {
  vaultManagerLogicAddress: Address | undefined
  chainId: ChainId
  disabled?: boolean
}

export const useTotalFundValueMutable = ({
  vaultManagerLogicAddress,
  chainId,
  disabled,
}: UseTotalFundsValueMutable) =>
  useStaticCallQuery<bigint>({
    dynamicContractAddress: vaultManagerLogicAddress,
    contractId: 'poolManagerLogic',
    chainId,
    functionName: 'totalFundValueMutable',
    args: [],
    disabled,
  })?.data?.toString() ?? ''
