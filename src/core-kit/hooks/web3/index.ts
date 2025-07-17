export {
  useConnect,
  useWriteContract,
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
  useSendTransaction,
  useReadContract,
  useReadContracts,
  useBlockNumber,
  useDisconnect,
} from 'wagmi'
export { useAccount } from 'core-kit/hooks/web3/use-account'
export { useNetwork } from 'core-kit/hooks/web3/use-network'
export { useTokenAllowance } from 'core-kit/hooks/web3/use-token-allowance'
export { useIsWalletConnected } from 'core-kit/hooks/web3/use-is-wallet-connected'
export { useBalance } from 'core-kit/hooks/web3/use-balance'
export { useContractFunction } from 'core-kit/hooks/web3/use-contract-function'
export { useGasPrice } from 'core-kit/hooks/web3/use-gas-price'
export { useContractReadsErrorLogging } from 'core-kit/hooks/web3/use-contract-reads-error-logging'
export { useContractReadErrorLogging } from 'core-kit/hooks/web3/use-contract-read-error-logging'
export { useStaticCallQuery } from 'core-kit/hooks/web3/use-static-call-query'
export { useInvalidateOnBlock } from 'core-kit/hooks/web3/use-invalidate-on-block'
export { useInvalidateTradingQueries } from 'core-kit/hooks/web3/use-invalidate-trading-queries'
export { useIsBatchContractWritesSupported } from 'core-kit/hooks/web3/use-is-batch-contract-writes-supported'
