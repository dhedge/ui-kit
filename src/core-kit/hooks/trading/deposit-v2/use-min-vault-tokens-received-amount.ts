import BigNumber from 'bignumber.js'

import { MANAGER_FEE_DENOMINATOR } from 'core-kit/const'
import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import { usePoolDynamic } from 'core-kit/hooks/pool/multicall'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading'
import { useAppliedDepositSlippage } from 'core-kit/hooks/trading/deposit-v2/use-applied-deposit-slippage'
import { useIsDepositWithSwapTransaction } from 'core-kit/hooks/trading/deposit-v2/use-is-deposit-with-swap-transaction'
import { getPercent } from 'core-kit/utils'

import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useMinVaultTokensReceivedAmount = () => {
  const { defaultNoSwapMinDepositAmountGap } = useConfigContextParams()
  const { address, chainId } = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const [receiveToken] = useReceiveTokenInput()
  const { data: { entryFee } = {} } = usePoolDynamic({ address, chainId })
  const entryFeeValue = getPercent(
    Number(entryFee ?? '0'),
    MANAGER_FEE_DENOMINATOR,
  )
  const [{ slippage }] = useTradingPanelSettings()
  const isAutoSlippage = slippage === 'auto'
  const depositSlippage = useAppliedDepositSlippage()
  const isDepositWithSwapTransaction = useIsDepositWithSwapTransaction()

  const sendTokenPrice = +useAssetPrice({
    address: sendToken.address,
    chainId,
  })
  const vaultTokenPrice = +usePoolTokenPrice({ address, chainId })

  if (isDepositWithSwapTransaction) {
    const sendValue =
      Number(sendToken.value || 0) * sendTokenPrice * (1 - entryFeeValue / 100)
    // calculate expected received vault tokens amount excluding entry fee
    const expectedReceivedVaultTokensAmount = sendValue / vaultTokenPrice

    return new BigNumber(expectedReceivedVaultTokensAmount)
      .shiftedBy(receiveToken.decimals)
      .times(1 - depositSlippage / 100)
      .toFixed(0)
  }

  const noSwapMinValueGap = isAutoSlippage
    ? defaultNoSwapMinDepositAmountGap
    : depositSlippage
  return new BigNumber(receiveToken.value || '0')
    .shiftedBy(receiveToken.decimals)
    .times(1 - noSwapMinValueGap / 100)
    .toFixed(0)
}
