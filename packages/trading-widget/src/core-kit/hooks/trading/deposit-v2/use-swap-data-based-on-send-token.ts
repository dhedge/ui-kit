import BigNumber from 'bignumber.js'

import { AddressZero, EXTREMELY_SHORT_POLLING_INTERVAL } from 'core-kit/const'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import {
  useSendTokenDebouncedValue,
  useSwapDataQuery,
} from 'core-kit/hooks/trading'
import { useAccount } from 'core-kit/hooks/web3'

import { useAppliedDepositSlippage } from './use-applied-deposit-slippage'
import { useIsDepositWithSwapTransaction } from './use-is-deposit-with-swap-transaction'
import { useVaultDepositParams } from './use-vault-deposit-params'

export const useSwapDataBasedOnSendToken = () => {
  const { account: walletAddress = AddressZero } = useAccount()
  const { chainId } = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const { debouncedSendTokenValue } = useSendTokenDebouncedValue()

  const { vaultDepositTokenAddress } = useVaultDepositParams()
  const isDepositWithSwapTransaction = useIsDepositWithSwapTransaction()
  const slippage = useAppliedDepositSlippage()

  return useSwapDataQuery(
    {
      sourceAddress: sendToken.address,
      destinationAddress: vaultDepositTokenAddress,
      amount: new BigNumber(debouncedSendTokenValue)
        .shiftedBy(sendToken.decimals)
        .toFixed(0),
      chainId,
      slippage: slippage.toString(),
      walletAddress,
    },
    {
      enabled: isDepositWithSwapTransaction && !!debouncedSendTokenValue,
      refetchInterval: EXTREMELY_SHORT_POLLING_INTERVAL,
    },
  )
}
