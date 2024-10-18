import { useSendTokenInput } from 'core-kit/hooks/state'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export interface WithdrawSectionProps {
  isMultiAssetWithdraw: boolean
  assetSymbol: string
}

export const useWithdrawSection = ({
  isMultiAssetWithdraw,
  assetSymbol,
}: WithdrawSectionProps) => {
  const t = useTranslationContext()
  const [sendToken] = useSendTokenInput()
  const label = isMultiAssetWithdraw ? t.receiveEstimated : ''
  return {
    isMultiAssetWithdraw,
    label,
    assetSymbol,
    vaultSymbol: sendToken.symbol,
  }
}
