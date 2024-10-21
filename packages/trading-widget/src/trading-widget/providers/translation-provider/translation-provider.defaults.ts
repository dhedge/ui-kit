import type { TranslationMap } from './translation-provider.types'

export const DEFAULT_TRANSLATION_DATA: TranslationMap = {
  depositSlippageWarning:
    'Excludes entry fee. Slippage may be amplified by the leverage. See the docs for more info.',
  withdrawSlippageWarning:
    'Slippage occurs in both single asset withdrawals and withdrawals from vaults with Aave debt positions. However, for vaults with Aave debt, slippage is only applied to the portion of the withdrawal that corresponds to the Aave position.',
  minSlippageWarning:
    'Flexible min slippage value that is likely enough to process the transaction.',
  highSlippageWarning:
    'We recommend using another asset to trade with lower slippage.',
  recommendedMinSlippage: 'Recommended min slippage',
  projectedDailyEarningsTooltip:
    'Projected daily earnings are based on the current APY and may differ from actual earnings.',
  dailyEarnings: 'Daily earnings',
  projectedYearlyEarningsTooltip:
    'Projected yearly earnings are based on the current APY and may differ from actual earnings.',
  yearlyEarnings: 'Yearly earnings',
  fullReceiveDetails: 'See full details influencing what you will receive.',
  tradeDetails: 'Trade details',
  maxSlippage: 'Max slippage',
  minReceiveAmount: 'You will receive no less than this amount.',
  minReceived: 'Minimum received',
  estimatedMultiAssetFractions: 'Estimated multi asset fractions',
  infinite: 'Infinite approval',
  tokenAllowance: 'Token allowance',
  entryFee: 'Entry fee',
  exitFee: 'Exit fee',
  entryFeeExplanation: "Entry fee is charged in vault's tokens.",
  exitFeeExplanation: "Exit fee is charged in vault's tokens.",
  amountToBeApproved:
    'Amount of {symbol} tokens to be approved. Can be customized in settings.',
  minDepositUsd: 'Minimum deposit in USD.',
  minDeposit: 'Minimum deposit',
  tokensLockTime: 'Purchased tokens will have a {lockTime} lock.',
  slippageTolerance: 'Slippage tolerance',
  reduceLockupTime: 'Reduce lockup time',
  toggleTokenApprovalAmount:
    'Toggle between exact and infinite token approval.',
  auto: 'Auto',
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
  checkingOracles: 'Checking Oracles',
  confirmMaxSlippage: 'Confirm {slippagePercentage}% max slippage',
  withdrawalWindowDisabled:
    'You can sell your {tokenSymbol} tokens during withdrawal window period starting from {startTime}',
  withdrawalLiquidityDisabled:
    'Intended withdraw value is greater than available liquidity ({symbol} {value})',
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
  as: 'As',
  switchNetwork: 'Switch Network',
  depositAction: 'Buy',
  withdrawAction: 'Sell',
  unrollAction: 'Unroll',
  swapAction: 'Swap',
  claimAction: 'Claim Without Swap',
  claimLabel: 'Claim',
  swapOf: 'Swap of',
  to: 'to',
  initWithdrawDescription: 'Unroll {vaultSymbol} tokens into swappable assets',
  initWithdrawTooltip:
    'Swappable assets are basic ERC20 tokens which can be converted on various platforms, including decentralized exchanges (DEXs), swap aggregators, and centralized exchanges (CEXs).',
  completeWithdrawDescription: 'Swap assets into {assetSymbol}',
  completeWithdrawTooltip:
    'The swap step can be skipped, and all swappable assets can be claimed directly.',
}
