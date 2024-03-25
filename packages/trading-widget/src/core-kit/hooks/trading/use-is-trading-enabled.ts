import BigNumber from 'bignumber.js'

import { useReceiveTokenInput, useSendTokenInput } from 'core-kit/hooks/state'
import { useUserTokenBalance } from 'core-kit/hooks/user'

export const useIsTradingEnabled = (): boolean => {
  const [sendToken] = useSendTokenInput()
  const [receiveToken] = useReceiveTokenInput()

  const sendAssetBalance = useUserTokenBalance({
    address: sendToken.address,
    symbol: sendToken.symbol,
  })

  const formattedSelectedSendAssetInputValue = new BigNumber(sendToken.value)
  const formattedSelectedReceiveAssetInputValue = new BigNumber(
    receiveToken.value,
  )

  return (
    (formattedSelectedSendAssetInputValue.gt(0) ||
      formattedSelectedReceiveAssetInputValue.gt(0)) &&
    formattedSelectedSendAssetInputValue.lte(sendAssetBalance ?? 0)
  )
}
