export type TranslationMap = {
  slippageWarning: string
  minSlippageWarning: string
  highSlippageWarning: string
  recommendedMinSlippage: string
  projectedDailyEarningsTooltip: string
  dailyEarnings: string
  projectedYearlyEarningsTooltip: string
  yearlyEarnings: string
  fullReceiveDetails: string
  tradeDetails: string
  maxSlippage: string
  minReceiveAmount: string
  minReceived: string
  estimatedMultiAssetFractions: string
  infinite: string
  tokenAllowance: string
  entryFee: string
  entryFeeExplanation: string
  easySwapperEntryFee: string
  amountToBeApproved: string
  minDepositUsd: string
  minDeposit: string
  tokensLockTime: string
  slippageTolerance: string
  bypassEntryFee: string
  entryFeeSwitchWarning: string
  tokenAmountToApprove: string
  auto: string
  autoSlippageDescription: string
  lengthenLockup: string
  deposit: string
  withdraw: string
  yourBalance: string
  max: string
  allAssets: string
  all: string
  payWith: string
  buyEstimated: string
  sell: string
  receiveEstimated: string
  confirmInWallet: string
  pending: string
  approve: string
  connectWallet: string
  minimumPurchase: string
  poolIsInactive: string
  poolIsPrivate: string
  updateOracles: string
  confirmMaxSlippage: string
  withdrawalWindowDisabled: string
  withdrawCooldown: string
  [key: string]: string
}

export interface TranslationProviderProps {
  config?: Partial<TranslationMap>
}
