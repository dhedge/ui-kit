import BigNumber from 'bignumber.js'

import {
  useIsDepositTradingPanelType,
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'hooks/state'
import { usePoolDepositAssetAddress } from 'hooks/trading/deposit'
import { useMemo } from 'react'
import type { TradingParams } from 'types/trading.types'

export const useTradingParams = (): TradingParams => {
  const poolConfig = useTradingPanelPoolConfig()
  const isDeposit = useIsDepositTradingPanelType()
  const [sendToken] = useSendTokenInput()
  const [receiveToken] = useReceiveTokenInput()

  const intermediateWithdrawTokenAddress =
    poolConfig.withdrawParams.customTokens.find(
      ({ address }) => address === receiveToken.address,
    )?.intermediateToken?.address
  const receiveAssetAddress = isDeposit
    ? receiveToken.address
    : intermediateWithdrawTokenAddress ?? receiveToken.address

  const poolDepositAssetAddress = usePoolDepositAssetAddress({
    investAssetAddress: sendToken.address,
    symbol: sendToken.symbol,
    productPoolAddress: poolConfig.address,
    chainId: poolConfig.chainId,
  })

  return useMemo<TradingParams>(
    () => ({
      sendAssetAddress: sendToken.address,
      fromTokenAmount: new BigNumber(sendToken.value || '0'),
      receiveAssetAddress,
      receiveAssetInputValue: receiveToken.value,
      poolDepositAddress: poolDepositAssetAddress,
    }),
    [
      sendToken.address,
      sendToken.value,
      receiveToken.value,
      receiveAssetAddress,
      poolDepositAssetAddress,
    ],
  )
}
