import type { TranslationMap } from './translation-provider.types'

export const DEFAULT_TRANSLATION_DATA: TranslationMap = {
  depositSlippageWarning:
    'Includes entry fee. We recommend 2-3%, but usually it will be < 1%. Slippage may be amplified by the leverage. See the docs for more info.',
  withdrawSlippageWarning:
    'Slippage only applies to single asset withdrawals and withdrawals from vaults with debt positions in Aave.',
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
  infinite: 'Infinite approval',
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
  reduceLockupTime: 'Reduce Lockup Time',
  entryFeeSwitchWarning:
    'Your position will be locked for up to {customLockTime} instead of the normal {defaultLockTime}.',
  toggleTokenApprovalAmount:
    'Toggle between exact and infinite token approval.',
  auto: 'Auto',
  autoSlippageDescription:
    "App is testing different slippage ranges, starting low and increasing until it's likely to pass",
  reduceLockup: 'Reduce lockup to {customLockTime} by paying 0.1% fee',
  deposit: 'Buy',
  withdraw: 'Sell',
  yourBalance: 'Your Balance',
  max: 'Max',
  allAssets: 'All Assets',
  all: 'All',
  payWith: 'Pay with',
  buyEstimated: 'Buy (estimated)',
  sell: 'Sell',
  receiveEstimated: 'Receive (estimated)',
  confirmInWallet: 'Please confirm in wallet',
  pending: 'Pending...',
  approve: 'Approve',
  connectWallet: 'Connect Wallet',
  minimumPurchase: 'Minimum purchase is ${value}',
  poolIsInactive:
    '{poolSymbol} token is no longer active. Please withdraw from them.',
  poolIsPrivate: 'This vault is currently private',
  updateOracles: 'Update Oracles',
  confirmMaxSlippage: 'Confirm {slippagePercentage}% max slippage',
  withdrawalWindowDisabled:
    'You can sell your {tokenSymbol} tokens during withdrawal window period starting from {startTime}',
  withdrawCooldown:
    'You can sell your {tokenSymbol} tokens in {cooldownEndTime}',
  termsOfUse: 'Terms Of Use',
  termOfUseDepositListTitle: 'Please know the following before depositing',
  termOfUseDepositAssetSlippage:
    'When exiting, investors receive single asset or the underlying vault assets. Withdraw slippage can be customized in withdraw settings',
  termOfUseDepositBugs: 'There may be interface bugs on the platform',
  termOfUseDepositDowntime:
    'There may be interface downtime (planned and unplanned)',
  termOfUseDepositAuditRisk:
    'Smart contracts are audited but a risk is still present',
  termOfUseDepositAccept: 'Accept & Deposit',
  back: 'Back',
  highSlippage: 'High Slippage Alert',
  responsibleHighSlippage:
    'By proceeding with this trade, you acknowledge and accept the possibility of experiencing high slippage, resulting in a potential difference between the expected and executed price.',
  highSlippageListTitle: 'Please consider the following before confirming',
  highSlippageQuoteDiff:
    'Be aware that the final amount of assets you receive may be different from the initially quoted value.',
  highSlippageRisk:
    'Ensure that you understand the risks associated with high slippage and are comfortable proceeding with the trade.',
  confirm: 'Confirm',
  selectToken: 'Select token',
  sendingOrderToWallet: 'Sending order to your wallet',
  settingUpTx: 'Setting up transaction',
  updateSynthetixOracles: 'Updating Synthetix Oracles',
  approveSpending: 'Approve spending',
  pay: 'Pay',
  multiAssetFractions: 'multi asset fractions',
  explorer: 'Explorer',
}
