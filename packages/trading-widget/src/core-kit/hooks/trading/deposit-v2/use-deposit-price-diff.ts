import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import {
  usePoolDynamicContractData,
  usePoolTokenPrice,
} from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { getConventionalTokenPriceDecimals, getPercent } from 'core-kit/utils'

import { MANAGER_FEE_DENOMINATOR } from '../../../const'
import { useAssetPrice } from '../use-asset-price'

type UseDepositPriceDiffProps =
  | {
      includesEntryFee?: boolean
    }
  | undefined

export const useDepositPriceDiff = (props: UseDepositPriceDiffProps = {}) => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const { entryFee = '0' } = usePoolDynamicContractData({ address, chainId })
  const [sendToken] = useSendTokenInput()
  const [receiveToken] = useReceiveTokenInput()
  const sendTokenPrice = useAssetPrice({
    address: sendToken.address,
    chainId,
  })
  const vaultTokenPrice = usePoolTokenPrice({ address, chainId })
  const entryFeeValue = props.includesEntryFee
    ? getPercent(+entryFee, MANAGER_FEE_DENOMINATOR)
    : 0

  return useMemo(() => {
    const sendValue = Number(sendToken.value || '0')
    const receiveValue = Number(receiveToken.value || '0')

    const sendAmount = new BigNumber(sendValue)
      .times(sendTokenPrice ?? '0')
      .times(1 - entryFeeValue / 100)
    const receiveAmount = new BigNumber(receiveValue).times(
      vaultTokenPrice ?? '0',
    )

    if (sendAmount.isZero() || receiveAmount.isZero()) {
      return 0
    }

    const canBeCompared = sendAmount
      .decimalPlaces(getConventionalTokenPriceDecimals(sendValue))
      .comparedTo(
        receiveAmount.decimalPlaces(
          getConventionalTokenPriceDecimals(receiveValue),
        ),
      )

    if (canBeCompared) {
      return sendAmount.isGreaterThan(0)
        ? receiveAmount
            .dividedBy(sendAmount)
            .minus(1)
            .times(100)
            .decimalPlaces(2, BigNumber.ROUND_DOWN)
            .toNumber()
        : 0
    }

    return 0
  }, [receiveToken.value, sendToken.value, sendTokenPrice, vaultTokenPrice])
}
