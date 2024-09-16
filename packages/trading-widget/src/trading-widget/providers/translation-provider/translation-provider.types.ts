export type TranslationMap = {
  depositSlippageWarning: string
  withdrawSlippageWarning: string
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
  exitFee: string
  exitFeeExplanation: string
  amountToBeApproved: string
  minDepositUsd: string
  minDeposit: string
  tokensLockTime: string
  slippageTolerance: string
  reduceLockupTime: string
  toggleTokenApprovalAmount: string
  auto: string
  autoSlippageDescription: string
  reduceLockup: string
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
  checkingOracles: string
  confirmMaxSlippage: string
  withdrawalWindowDisabled: string
  withdrawalLiquidityDisabled: string
  withdrawCooldown: string
  termsOfUse: string
  termOfUseDepositListTitle: string
  termOfUseDepositAssetSlippage: string
  termOfUseDepositBugs: string
  termOfUseDepositDowntime: string
  termOfUseDepositAuditRisk: string
  termOfUseDepositAccept: string
  back: string
  highSlippage: string
  responsibleHighSlippage: string
  highSlippageListTitle: string
  highSlippageQuoteDiff: string
  highSlippageRisk: string
  confirm: string
  selectToken: string
  sendingOrderToWallet: string
  settingUpTx: string
  updateSynthetixOracles: string
  approveSpending: string
  pay: string
  multiAssetFractions: string
  explorer: string
  as: string
  switchNetwork: string
  [key: string]: string
}

export interface TranslationProviderProps {
  config?: Partial<TranslationMap>
}
