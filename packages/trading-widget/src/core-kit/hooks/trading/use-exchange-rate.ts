import { useReceiveTokenInput, useSendTokenInput } from 'core-kit/hooks/state'

export function getExchange(
  sendAssetSymbol: string,
  receiveAssetSymbol: string,
  sendAssetInputBalance: string,
  receiveAssetInputBalance: string,
): string {
  try {
    if (receiveAssetSymbol === 'all') {
      return ''
    }

    const inputNum = Number(sendAssetInputBalance)
    const outputNum = Number(receiveAssetInputBalance)
    if (
      inputNum === 0 ||
      outputNum === 0 ||
      !isFinite(inputNum) ||
      !isFinite(outputNum)
    ) {
      return ''
    }

    return `1 ${sendAssetSymbol} = ${(outputNum / inputNum).toFixed(
      6,
    )} ${receiveAssetSymbol}`
  } catch (error) {
    return ''
  }
}

export const useExchangeRate = () => {
  const [sendToken] = useSendTokenInput()
  const [receiveToken] = useReceiveTokenInput()

  return {
    value: getExchange(
      sendToken.symbol,
      receiveToken.symbol,
      sendToken.value,
      receiveToken.value,
    ),
    isLoading: !!receiveToken.isLoading,
  }
}
