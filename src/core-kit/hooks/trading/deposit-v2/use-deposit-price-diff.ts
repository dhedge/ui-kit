import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import { MANAGER_FEE_DENOMINATOR } from 'core-kit/const'
import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import { usePoolDynamic } from 'core-kit/hooks/pool/multicall'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading'
import { getConventionalTokenPriceDecimals, getPercent } from 'core-kit/utils'

type UseDepositPriceDiffProps =
  | {
      includesEntryFee?: boolean
    }
  | undefined

export const useDepositPriceDiff = (props: UseDepositPriceDiffProps = {}) => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const { data } = usePoolDynamic({
    address,
    chainId,
  })
  const [sendToken] = useSendTokenInput()
  const [receiveToken] = useReceiveTokenInput()
  const sendTokenPrice = useAssetPrice({
    address: sendToken.address,
    chainId,
  })
  const vaultTokenPrice = usePoolTokenPrice({ address, chainId })
  const entryFeeValue = props.includesEntryFee
    ? getPercent(Number(data?.entryFee ?? '0'), MANAGER_FEE_DENOMINATOR)
    : 0

  return useMemo(() => {
    const sendAmount = Number(sendToken.value || '0')
    const sendAmountBN = new BigNumber(sendAmount)
      .times(sendTokenPrice ?? '0')
      .times(1 - entryFeeValue / 100)

    const receiveAmount = Number(receiveToken.value || '0')
    const receiveAmountBN = new BigNumber(receiveAmount).times(
      vaultTokenPrice ?? '0',
    )

    if (sendAmountBN.isZero() || receiveAmountBN.isZero()) {
      return 0
    }

    const canBeCompared = sendAmountBN
      .decimalPlaces(getConventionalTokenPriceDecimals(sendAmount))
      .comparedTo(
        receiveAmountBN.decimalPlaces(
          getConventionalTokenPriceDecimals(receiveAmount),
        ),
      )

    if (canBeCompared) {
      return sendAmountBN.isGreaterThan(0)
        ? receiveAmountBN
            .dividedBy(sendAmountBN)
            .minus(1)
            .times(100)
            .decimalPlaces(2, BigNumber.ROUND_DOWN)
            .toNumber()
        : 0
    }

    return 0
  }, [
    entryFeeValue,
    receiveToken.value,
    sendToken.value,
    sendTokenPrice,
    vaultTokenPrice,
  ])
}
