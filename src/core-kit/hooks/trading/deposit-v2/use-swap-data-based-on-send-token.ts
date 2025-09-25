import BigNumber from 'bignumber.js'

import { AddressZero, SWAP_QUOTE_REFRESH_INTERVAL_MS } from 'core-kit/const'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'

import {
  useSendTokenDebouncedValue,
  useSwapDataQuery,
} from 'core-kit/hooks/trading'
import { useIsDepositWithSwapTransaction } from 'core-kit/hooks/trading/deposit-v2/use-is-deposit-with-swap-transaction'
import { useVaultDepositParams } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-params'
import { useAccount } from 'core-kit/hooks/web3'

export const useSwapDataBasedOnSendToken = () => {
  const { account: walletAddress = AddressZero } = useAccount()
  const { chainId } = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const { debouncedSendTokenValue } = useSendTokenDebouncedValue()

  const { vaultDepositTokenAddress } = useVaultDepositParams()
  const isDepositWithSwapTransaction = useIsDepositWithSwapTransaction()

  return useSwapDataQuery(
    {
      sourceAddress: sendToken.address,
      destinationAddress: vaultDepositTokenAddress,
      amount: new BigNumber(debouncedSendTokenValue)
        .shiftedBy(sendToken.decimals)
        .toFixed(0),
      chainId,
      slippage: '33', // hardcode 33% slippage to get a quote due to api quotes being unrealistically high, actual slippage is handled by buildZapDepositTransactionArguments and useMinVaultTokensReceivedAmount
      walletAddress,
    },
    {
      enabled: isDepositWithSwapTransaction && !!debouncedSendTokenValue,
      refetchInterval: SWAP_QUOTE_REFRESH_INTERVAL_MS,
    },
  )
}
