import BigNumber from 'bignumber.js'

import { MANAGER_FEE_DENOMINATOR } from 'core-kit/const'
import {
  usePoolDynamicContractData,
  usePoolTokenPrice,
} from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading'
import { getPercent } from 'core-kit/utils'

import { useAppliedDepositSlippage } from './use-applied-deposit-slippage'

export const useMinVaultTokensReceivedAmount = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const [receiveToken] = useReceiveTokenInput()
  const { entryFee = '0' } = usePoolDynamicContractData({ address, chainId })
  const entryFeeValue = getPercent(+entryFee, MANAGER_FEE_DENOMINATOR)
  const [{ slippage }] = useTradingPanelSettings()
  const isAutoSlippage = slippage === 'auto'
  const depositSlippage = useAppliedDepositSlippage()

  // calculate expected received vault tokens amount excluding entry fee
  const sendTokenPrice = +useAssetPrice({
    address: sendToken.address,
    chainId,
  })
  const vaultTokenPrice = +usePoolTokenPrice({ address, chainId })

  const sendValue =
    Number(sendToken.value || 0) * sendTokenPrice * (1 - entryFeeValue / 100)
  const expectedReceivedVaultTokensAmount = sendValue / vaultTokenPrice

  return new BigNumber(
    isAutoSlippage
      ? receiveToken.value || '0'
      : expectedReceivedVaultTokensAmount,
  )
    .shiftedBy(receiveToken.decimals)
    .times(1 - depositSlippage / 100)
    .toFixed(0)
}
