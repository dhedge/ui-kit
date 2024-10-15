import { useSendTokenInput } from 'core-kit/hooks/state'

export interface WithdrawSectionProps {
  isMultiAssetWithdraw: boolean
  assetSymbol: string
}

export const useWithdrawSection = ({
  isMultiAssetWithdraw,
  assetSymbol,
}: WithdrawSectionProps) => {
  const [sendToken] = useSendTokenInput()
  const label = isMultiAssetWithdraw ? 'Receive(estimated)' : ''
  return {
    isMultiAssetWithdraw,
    label,
    assetSymbol,
    vaultSymbol: sendToken.symbol,
  }
}
