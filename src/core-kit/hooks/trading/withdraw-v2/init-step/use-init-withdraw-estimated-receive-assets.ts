import type { Address } from 'viem'
import { useSimulateContract } from 'wagmi'

import { EasySwapperV2Abi } from 'core-kit/abi'
import {
  EASY_SWAPPER_V2_INITIATE_WITHDRAW_METHOD,
  EXTENDED_DEBOUNCE_TIME,
} from 'core-kit/const'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useInitWithdrawTransactionArgumentsForSimulationOnly } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-get-init-withdraw-transaction-arguments'
import { useInitWithdrawAllowance } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-init-withdraw-allowance'
import { useWithdrawAssetsInfo } from 'core-kit/hooks/trading/withdraw-v2/use-withdraw-assets-info'
import { useIsInsufficientBalance } from 'core-kit/hooks/user'
import type { ComplexWithdrawAssetData } from 'core-kit/types'
import { getContractAddressById } from 'core-kit/utils'

const checkSimulateArgumentsType = (
  args: ReturnType<typeof useInitWithdrawTransactionArgumentsForSimulationOnly>,
): args is [Address, bigint, ComplexWithdrawAssetData[]] =>
  typeof args[0] === 'string' &&
  typeof args[1] === 'bigint' &&
  Array.isArray(args[2])

export const useInitWithdrawEstimatedReceiveAssets = () => {
  const poolConfig = useTradingPanelPoolConfig()
  const isInsufficientBalance = useIsInsufficientBalance()
  const { canSpend } = useInitWithdrawAllowance()

  const txArgs = useInitWithdrawTransactionArgumentsForSimulationOnly({
    debounceTime: EXTENDED_DEBOUNCE_TIME,
  })
  const enabled =
    checkSimulateArgumentsType(txArgs) &&
    txArgs[1] !== BigInt(0) &&
    !isInsufficientBalance &&
    canSpend

  const { data } = useSimulateContract({
    abi: EasySwapperV2Abi,
    address: getContractAddressById('easySwapperV2', poolConfig.chainId),
    functionName: EASY_SWAPPER_V2_INITIATE_WITHDRAW_METHOD,
    args: txArgs as never,
    query: {
      enabled,
    },
  })

  return useWithdrawAssetsInfo({
    assets: data?.result[0] ?? [],
    chainId: poolConfig.chainId,
  })
}
