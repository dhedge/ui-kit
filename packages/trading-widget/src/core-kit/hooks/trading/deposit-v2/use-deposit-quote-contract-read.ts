import { keepPreviousData } from '@tanstack/react-query'
import { useReadContract } from 'wagmi'

import { EasySwapperV2Abi } from 'core-kit/abi'
import { EXTREMELY_SHORT_POLLING_INTERVAL } from 'core-kit/const'
import {
  useIsDepositTradingPanelType,
  useSendTokenInput,
} from 'core-kit/hooks/state'
import { useDebounce } from 'core-kit/hooks/utils'
import { useContractReadErrorLogging } from 'core-kit/hooks/web3'
import type { PoolConfig } from 'core-kit/types/config.types'
import { getContractAddressById } from 'core-kit/utils'

import { useVaultDepositParams } from './use-vault-deposit-params'
import { useVaultDepositTokenAmount } from './use-vault-deposit-token-amount'

export const useDepositQuoteContractRead = ({
  address,
  chainId,
}: Pick<PoolConfig, 'address' | 'chainId'>) => {
  const [sendToken] = useSendTokenInput()
  const isDeposit = useIsDepositTradingPanelType()
  const { vaultDepositTokenAddress } = useVaultDepositParams()

  const sendAmount = useVaultDepositTokenAmount()
  const debouncedSendAmount = useDebounce(sendAmount, 500)

  const hasSendInputValue = !!(debouncedSendAmount && +debouncedSendAmount > 0)

  const quoteResponse = useReadContract({
    address: getContractAddressById('easySwapperV2', chainId),
    abi: EasySwapperV2Abi,
    functionName: 'depositQuote',
    args: [address, vaultDepositTokenAddress, BigInt(sendAmount ?? 0)],
    chainId,
    query: {
      enabled:
        isDeposit && hasSendInputValue && !!sendToken.address && !!sendAmount,
      refetchInterval: EXTREMELY_SHORT_POLLING_INTERVAL,
      placeholderData: keepPreviousData,
    },
  })

  useContractReadErrorLogging(quoteResponse)

  return quoteResponse
}
