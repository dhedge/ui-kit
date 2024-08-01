import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import type { TradingParams } from 'core-kit/types/trading.types'

export const useWithdrawTradingParams = (): Omit<
  TradingParams,
  'poolDepositAddress'
> => {
  const poolConfig = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const [receiveToken] = useReceiveTokenInput()

  const intermediateWithdrawTokenAddress =
    poolConfig.withdrawParams.customTokens.find(
      ({ address }) => address === receiveToken.address,
    )?.intermediateToken?.address
  const receiveAssetAddress =
    intermediateWithdrawTokenAddress ?? receiveToken.address

  return useMemo<TradingParams>(
    () => ({
      sendAssetAddress: sendToken.address,
      fromTokenAmount: new BigNumber(sendToken.value || '0'),
      receiveAssetAddress,
      receiveAssetAmount: receiveToken.value,
    }),
    [
      sendToken.address,
      sendToken.value,
      receiveToken.value,
      receiveAssetAddress,
    ],
  )
}
