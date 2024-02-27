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
  [key: string]: string
}

export const DEFAULT_TRANSLATION_DATA: TranslationMap = {
  slippageWarning:
    'Includes entry fee. We recommend 2-3%, but usually it will be < 1%. Slippage may be amplified by the leverage. See the docs for more info.',
  minSlippageWarning:
    'Flexible min slippage value that is likely enough to process the transaction.',
  highSlippageWarning:
    'We recommend using another asset to trade with lower slippage.',
  recommendedMinSlippage: 'Recommended Min Slippage',
  projectedDailyEarningsTooltip:
    'Projected daily earnings are based on the current APY and may differ from actual earnings.',
  dailyEarnings: 'Daily Earnings',
  projectedYearlyEarningsTooltip:
    'Projected yearly earnings are based on the current APY and may differ from actual earnings.',
  yearlyEarnings: 'Yearly Earnings',
  fullReceiveDetails: 'See full details influencing what you will receive.',
  tradeDetails: 'Trade details',
  maxSlippage: 'Max slippage',
  minReceiveAmount: 'You will receive no less than this amount.',
  minReceived: 'Minimum Received',
  estimatedMultiAssetFractions: 'Estimated multi asset fractions',
  infinite: 'Infinite',
  tokenAllowance: 'Token Allowance',
  entryFee: 'Entry Fee',
  entryFeeExplanation:
    "When you deposit, the token takes a small entry fee. This fee helps cover the costs when we rebalance the underlying funds, and it's shared among all token holders.",
  easySwapperEntryFee:
    'Entry fee is charged when a cooldown of {time} is selected. Bypass Entry Fee at trading settings.',
  amountToBeApproved:
    'Amount of {symbol} tokens to be approved. Can be customized in settings.',
  minDepositUsd: 'Minimum deposit in USD.',
  minDeposit: 'Minimum Deposit',
  tokensLockTime: 'Purchased tokens will have a {lockTime} lock.',
  slippageTolerance: 'Slippage tolerance',
  bypassEntryFee: 'Bypass Entry Fee',
  entryFeeSwitchWarning:
    'By removing the entry fee, your position is locked for up to {defaultLockTime} instead of the normal {customLockTime}.',
  tokenAmountToApprove: 'Amount of tokens to be approved.',
  auto: 'Auto',
  autoSlippageDescription:
    "App is testing different slippage ranges, starting low and increasing until it's likely to pass",
  lengthenLockup: 'Lengthen lockup to remove entry fee',
  deposit: 'Buy',
  withdraw: 'Sell',
}
