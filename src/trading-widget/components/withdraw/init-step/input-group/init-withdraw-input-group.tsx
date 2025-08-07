import {
  InputArrow,
  ReceiveTokenBalance,
  SendTokenBalance,
  WidgetInput,
} from 'trading-widget/components/widget/widget-input'

import { useInitWithdrawInputGroup } from 'trading-widget/components/withdraw/init-step/input-group/init-withdraw-input-group.hooks'

export const InitWithdrawInputGroup = () => {
  const { sendToken, onInputChange, receiveToken } = useInitWithdrawInputGroup()

  return (
    <>
      <WidgetInput
        assetInput={sendToken.value}
        onInputChange={onInputChange}
        assetSymbol={sendToken.symbol}
        assetPrice={sendToken.price ?? ''}
        displayMax
        maxBalance={sendToken.balance}
        displayCalculatedValue
      >
        <SendTokenBalance />
      </WidgetInput>
      <WidgetInput
        assetInput={receiveToken.value}
        autoFocus={false}
        disabled
        assetSymbol={receiveToken.symbol}
        assetPrice={receiveToken.price}
        displayCalculatedValue
        isLoading={receiveToken.isLoading}
      >
        <InputArrow />
        {receiveToken.symbol === 'all' ? null : <ReceiveTokenBalance />}
      </WidgetInput>
    </>
  )
}
