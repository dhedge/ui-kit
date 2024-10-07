export interface WithdrawSectionProps {
  isMultiAssetWithdraw: boolean
  assetSymbol: string
}

export const useWithdrawSection = ({
  isMultiAssetWithdraw,
  assetSymbol,
}: WithdrawSectionProps) => {
  const label = isMultiAssetWithdraw ? 'Receive(estimated)' : ''
  return { isMultiAssetWithdraw, label, assetSymbol }
}
