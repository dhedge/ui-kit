import {
  useIsDepositTradingPanelType,
  useReceiveTokenInput,
  useTradingPanelSettings,
} from 'hooks/state'

export const useIsMultiAssetWithdraw = (): boolean => {
  const isWithdraw = !useIsDepositTradingPanelType()
  const [{ symbol }] = useReceiveTokenInput()
  const [{ isMultiAssetWithdrawalEnabled }] = useTradingPanelSettings()

  return isWithdraw && isMultiAssetWithdrawalEnabled && symbol === 'all'
}
