import { keepPreviousData } from '@tanstack/react-query'
import { useSimulateContract } from 'wagmi'

import { EasySwapperV2Abi } from 'core-kit/abi'
import {
  EASY_SWAPPER_V2_INITIATE_WITHDRAW_METHOD,
  EXTENDED_DEBOUNCE_TIME,
} from 'core-kit/const'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useInitWithdrawAllowance } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-init-withdraw-allowance'
import { useInitWithdrawTransactionArguments } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-init-withdraw-transaction-arguments'
import { useWithdrawAssetsInfo } from 'core-kit/hooks/trading/withdraw-v2/use-withdraw-assets-info'
import { useIsInsufficientBalance } from 'core-kit/hooks/user'
import type { Address } from 'core-kit/types'
import { getContractAddressById } from 'core-kit/utils'

export const useInitWithdrawEstimatedReceiveAssets = () => {
  const poolConfig = useTradingPanelPoolConfig()
  const isInsufficientBalance = useIsInsufficientBalance()
  const { canSpend } = useInitWithdrawAllowance()

  const txArgs = useInitWithdrawTransactionArguments({
    debounceTime: EXTENDED_DEBOUNCE_TIME,
  })

  const { data } = useSimulateContract({
    abi: EasySwapperV2Abi,
    address: getContractAddressById('easySwapperV2', poolConfig.chainId),
    functionName: EASY_SWAPPER_V2_INITIATE_WITHDRAW_METHOD,
    args: txArgs as [Address, bigint, bigint],
    query: {
      enabled: txArgs[1] !== BigInt(0) && !isInsufficientBalance && canSpend,
      placeholderData: keepPreviousData,
    },
  })

  return useWithdrawAssetsInfo({
    assets: data?.result[0] ?? [],
    chainId: poolConfig.chainId,
  })
}
