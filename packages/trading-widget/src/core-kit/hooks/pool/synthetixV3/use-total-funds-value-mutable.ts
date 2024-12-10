import { AddressZero } from 'core-kit/const'
import { useStaticCallQuery } from 'core-kit/hooks/web3'
import type { Address, ChainId } from 'core-kit/types'
import { getContractAbiById } from 'core-kit/utils'

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
    address: vaultManagerLogicAddress ?? AddressZero,
    abi: getContractAbiById('poolManagerLogic'),
    chainId,
    functionName: 'totalFundValueMutable',
    args: [],
    disabled,
  })?.data?.toString() ?? ''
