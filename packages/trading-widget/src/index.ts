export { TradingWidget } from './trading-widget/components'
export type { ProvidersProps } from './trading-widget/providers'
export { TradingPanelProvider } from './core-kit'
export {
  erc20Abi,
  AaveLendingPoolAbi,
  DhedgeEasySwapperAbi,
  DHedgeStakingV2Abi,
  PoolFactoryAbi,
  PoolLogicAbi,
  PoolManagerLogicAbi,
  RewardDistributionAbi,
  ITrustedMulticallForwarderAbi,
  IERC7412Abi,
  SynthetixV3CoreAbi,
  SynthetixV3AssetGuard,
  SynthetixV3ContractGuard,
} from './core-kit/abi'

export {
  USDC_ARBITRUM,
  arbitrum,
  base,
  optimism,
  polygon,
  SETH_OPTIMISM,
  MULTI_ASSET_TOKEN,
  PAXG_POLYGON,
  USDC_OPTIMISM,
  USDC_POLYGON,
  MANAGER_FEE_DENOMINATOR,
  LINK_OPTIMISM,
  SIMULATION_TIMEOUT_ERROR,
  MAX_GAS_LIMIT_MAP,
  GAS_LIMIT_BUFFER_COEFF,
  GAS_ESTIMATION_ERROR,
  STAKING_V2_ADDRESS_OPTIMISM,
  FACTORY_ADDRESS_OPTIMISM,
  FACTORY_ADDRESS_POLYGON,
  FACTORY_ADDRESS_ARBITRUM,
  FACTORY_ADDRESS_BASE,
  DEFAULT_SIMULATION_ERROR,
  DEFAULT_ERROR_MESSAGE,
  EMPTY_POOL_CONFIG,
  EASY_SWAPPER_ADDRESS_POLYGON,
  EASY_SWAPPER_ADDRESS_OPTIMISM,
  EASY_SWAPPER_ADDRESS_ARBITRUM,
  DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES,
  DHEDGE_SYNTHETIX_V3_ASSETS_MAP,
  DEFAULT_DEPOSIT_SLIPPAGE,
  DEFAULT_WITHDRAW_SLIPPAGE,
  DEFAULT_WITHDRAW_SLIPPAGE_SCALE,
  DEFAULT_EASY_SWAPPER_WITHDRAW_METHOD,
  DEFAULT_MULTI_ASSET_WITHDRAW_METHOD,
  DEFAULT_DEPOSIT_SLIPPAGE_SCALE,
  DEFAULT_DEPOSIT_METHOD,
  DEFAULT_PROMISE_TIMEOUT_MS,
  DEFAULT_LOCK_TIME,
  DAI_POLYGON,
  DAI_OPTIMISM,
  BRIDGED_USDC_POLYGON,
  BRIDGED_USDC_OPTIMISM,
  BRIDGED_USDC_ARBITRUM,
  CURRENCY_SYMBOL_MAP,
  contractsAddressesMap,
  contractsAbisMap,
  CBETH_BASE,
  RETH_BASE,
  BRIDGED_TOKENS_SYMBOLS,
  CHAIN_NATIVE_TOKENS,
  ALCHEMY_RPC_URL_MAP,
  CHAIN_MAP,
  AAVE_LENDING_POOL_V3_ADDRESS_POLYGON,
  AAVE_LENDING_POOL_V3_ADDRESS_OPTIMISM,
  AAVE_LENDING_POOL_V3_ADDRESS_ARBITRUM,
  AAVE_LENDING_POOL_V2_ADDRESS_POLYGON,
  MaxUint256,
  DEFAULT_PRECISION,
  AddressZero,
  DEFAULT_POLLING_INTERVAL,
  SHORTEN_POLLING_INTERVAL,
  NATIVE_TOKEN_DEPOSIT_GAS_LIMIT,
  SUSD_OPTIMISM,
  PYTH_API_LINK,
  REWARD_DISTRIBUTION_ADDRESS_OPTIMISM,
  SYNTHETIX_V3_CORE_ADDRESS_BASE,
  SYNTHETIX_V3_CORE_ADDRESS_ARBITRUM,
  USDC_BASE,
  SYNTHETIX_V3_POSITION_DEBT_ARGUMENTS,
  USDCBC_BASE,
  USDT_OPTIMISM,
  USDT_POLYGON,
  WBTC_OPTIMISM,
  WBTC_POLYGON,
  WETH_ARBITRUM,
  WETH_BASE,
  WETH_OPTIMISM,
  WETH_POLYGON,
  WETH_BY_CHAIN_ID,
  WMATIC_POLYGON,
  WBTC_ARBITRUM,
  TRADING_LOG_EVENT_PARAM,
  TRADING_PANEL_LOG_EVENT,
} from './core-kit/const'
export { DefaultSellingParams, EstimationError } from './core-kit/models'
export type {
  SendEstimationResult,
  ChainId,
  ChainNativeTokenMap,
  NativeTokenSymbol,
  Chain,
  Address,
  ApyCurrency,
  PoolComposition,
  Hex,
  TransactionRequest,
  Batcher,
  CallbackConfig,
  PoolConfig,
  PoolCompositionWithFraction,
  DynamicPoolContractData,
  PoolFallbackData,
  PoolContractAccountCallParams,
  ContractCallArgs,
  PoolContractCallParams,
  TxArgs,
  EstimateCall,
  ContractActionFunc,
  EstimatedGas,
  TradingParams,
  CallExecutionError,
  DynamicTradingToken,
  TradingToken,
  WithdrawTradingToken,
  Client,
  PublicClient,
  WalletClient,
  DepositMethodName,
  WithdrawMethodName,
  OracleAdapter,
  PendingTransaction,
  SimulateTransactionParams,
  SimulateTransactionResponse,
  SwapEntity,
  TradingPanelAction,
  TradingPanelActionsState,
  TradingPanelState,
  TradingPanelStateModal,
  TradingPanelSetters,
  TradingPanelType,
  TradingPanelContextConfig,
  TransactionAction,
  TradingModalStatus,
  TagInvestorByReferrerCallbackVariables,
  TokenSelectorPayload,
  UpdateTransactionsArguments,
  UseProjectedEarningsResult,
  UseReferralProgramProps,
  MulticallReturnType,
  ContractFunctionReturnType,
  UseReadContractsParameters,
  UseWriteContractParameters,
  WaitForTransactionReceiptReturnType,
  SwapDataRequest,
  SwapDataResponse,
} from './core-kit/types'
export {
  formatNumberToLimitedDecimals,
  formatPercentage,
  formatNumeratorToPercentage,
  formatByCurrency,
  formatToUsd,
  removeInsignificantTrailingZeros,
  isZeroAddress,
  isEqualAddress,
  getContractAbiById,
  calcMinReturnAmount,
  clientSide,
  commify,
  isNumeric,
  getContractAddressById,
  formatEther,
  formatUnits,
  getChainData,
  getExplorerLink,
  getConventionalTokenPriceDecimals,
  getErrorMessage,
  isErrorWithMessage,
  toErrorWithMessage,
  getNativeTokenInvestableBalance,
  isNativeToken,
  getOrderedTxArgs,
  getPercent,
  getPoolFraction,
  isBigInt,
  shortenAddress,
  normalizeNumber,
  shiftBy,
  isSynthetixV3Asset,
  isSynthetixV3Vault,
  trim,
  logTransactionArguments,
  validateLoggerEventParams,
  decodeErrorResult,
  hexToString,
  encodeFunctionData,
} from './core-kit/utils'

export {
  usePoolDynamicContractData,
  useInvalidatePoolContractData,
  useContractPoolComposition,
  useTotalFundValueMutable,
  useIsDhedgePool,
  useSynthetixV3AssetBalance,
  useCheckWhitelist,
  usePoolComposition,
  usePoolFees,
  usePoolCompositionWithFraction,
  usePoolManagerLogicData,
  useManagerLogicAddress,
  usePoolsDynamic,
  usePoolTokenPrice,
  useFmedVestedPoints,
} from './core-kit/hooks/pool'
export { useReferralProgram } from './core-kit/hooks/referral'
export {
  useIsDepositTradingPanelType,
  useIsPoolAddress,
  useOnSimulateTransaction,
  useOnTransactionError,
  useOnTransactionEstimationError,
  useOnTransactionSuccess,
  useOnTokenSelector,
  useSetPoolAddress,
  useSetTradingType,
  useTradingPanelActions,
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelApprovingStatus,
  useTradingPanelLogger,
  useTradingPanelMeta,
  useTradingPanelModal,
  useTradingPanelPoolAddress,
  useTradingPanelPoolConfig,
  useTradingPanelPoolFallbackData,
  useTradingPanelState,
  useTradingPanelPoolConfigs,
  useTradingPanelSettings,
  useTradingPanelTransactions,
  useTradingPanelType,
  useUpdatePoolFallbackData,
  useUpdateReceiveTokenInput,
  useUpdateSendTokenInput,
  useUpdateTradingMeta,
  useUpdateTradingModal,
  useUpdateTradingSettings,
} from './core-kit/hooks/state'
export {
  useProjectedEarningsCore,
  useExchangeRate,
  useAssetPrice,
  useDepositProjectedEarnings,
  useSynthetixV3OraclesUpdate,
  useHandleTrade,
  useIsTradingEnabled,
  useRawAssetPrice,
  useTradingResultHandling,
  useMaxSlippagePlaceholder,
  useMinReceiveText,
  useTradingSettleHandler,
  useAvailableWithdrawLiquidity,
} from './core-kit/hooks/trading'
export {
  useVaultDepositTokens,
  useDepositLockTime,
} from './core-kit/hooks/trading/deposit-v2'
export {
  useIsInsufficientBalance,
  useUserTokenBalance,
  useIsPoolManagerAccount,
  useFlatmoneyPointsUserBalances,
} from './core-kit/hooks/user'
export { useDebounce, useBrowserStorage } from './core-kit/hooks/utils'
export {
  useNetwork,
  useInvalidateTradingQueries,
  useInvalidateOnBlock,
  useBlockNumber,
  useBalance,
  useAccount,
  useDisconnect,
  useConnect,
  useIsWalletConnected,
  useWalletClient,
  usePublicClient,
  useContractFunction,
  useContractReadErrorLogging,
  useContractReadsErrorLogging,
  useGasPrice,
  useReadContract,
  useReadContracts,
  useStaticCallQuery,
  useWriteContract,
  useTokenAllowance,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from './core-kit/hooks/web3'
