import BigNumber from 'bignumber.js'

import { AaveAssetGuardAbi } from 'core-kit/abi'
import {
  AddressZero,
  DEFAULT_DEBOUNCE_TIME,
  DEFAULT_PRECISION,
  EXTREMELY_SHORT_POLLING_INTERVAL,
} from 'core-kit/const'
import { usePoolFees } from 'core-kit/hooks/pool'
import { usePoolStatic } from 'core-kit/hooks/pool/multicall'
import { useSendTokenInput } from 'core-kit/hooks/state'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage'
import { useDebounce } from 'core-kit/hooks/utils'
import { useStaticCallQuery } from 'core-kit/hooks/web3'
import type {
  CalculateSwapDataParamsResponse,
  PoolConfig,
} from 'core-kit/types'
import { getSlippageToleranceForContractTransaction } from 'core-kit/utils'

interface UseAaveSwapParamsProps
  extends Pick<PoolConfig, 'address' | 'chainId'> {
  disabled?: boolean
}

export const useAaveSwapParams = ({
  disabled,
  address,
  chainId,
}: UseAaveSwapParamsProps) => {
  const [sendToken] = useSendTokenInput()
  const { exitFeeNumber } = usePoolFees({ address, chainId })

  const withdrawAmountDebounced = useDebounce(
    new BigNumber(sendToken.value || '0')
      .shiftedBy(DEFAULT_PRECISION)
      .times((100 - exitFeeNumber) / 100)
      .toFixed(0, BigNumber.ROUND_DOWN),
    DEFAULT_DEBOUNCE_TIME,
  )
  const slippage = useAppliedWithdrawSlippage()

  const { data: { aaveAssetGuardAddress = AddressZero } = {} } = usePoolStatic({
    address,
    chainId,
  })

  return useStaticCallQuery<CalculateSwapDataParamsResponse>({
    address: aaveAssetGuardAddress,
    abi: AaveAssetGuardAbi,
    functionName: 'calculateSwapDataParams',
    chainId,
    args: [
      address,
      withdrawAmountDebounced,
      getSlippageToleranceForContractTransaction(slippage),
    ],
    refetchInterval: EXTREMELY_SHORT_POLLING_INTERVAL,
    disabled: disabled || withdrawAmountDebounced === '0',
  })
}
