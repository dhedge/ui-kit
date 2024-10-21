import {
  useIsDepositTradingPanelType,
  useReceiveTokenInput,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'

export const useIsMultiAssetWithdraw = (): boolean => {
  const isWithdraw = !useIsDepositTradingPanelType()
  const [{ symbol }] = useReceiveTokenInput()
  const [{ isMultiAssetWithdrawalEnabled }] = useTradingPanelSettings()

  return isWithdraw && isMultiAssetWithdrawalEnabled && symbol === 'all'
}
