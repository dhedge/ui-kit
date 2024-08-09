import BigNumber from 'bignumber.js'

import {
  AddressZero,
  DEFAULT_SWAP_TRANSACTION_SLIPPAGE,
  SHORTEN_POLLING_INTERVAL,
} from 'core-kit/const'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useSwapDataQuery } from 'core-kit/hooks/trading'
import { useDebounce } from 'core-kit/hooks/utils'
import { useAccount } from 'core-kit/hooks/web3'
import { getContractAddressById } from 'core-kit/utils'

import { useIsDepositWithSwapTransaction } from './use-is-deposit-with-swap-transaction'
import { useVaultDepositParams } from './use-vault-deposit-params'

export const useSwapDataBasedOnSendToken = () => {
  const { account: walletAddress = AddressZero } = useAccount()
  const [{ slippage: slippageFromSettings }] = useTradingPanelSettings()
  const { chainId } = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const debouncedSendTokenValue = useDebounce(sendToken.value, 500)
  const { vaultDepositTokenAddress } = useVaultDepositParams()
  const isDepositWithSwapTransaction = useIsDepositWithSwapTransaction()
  const easySwapperV2Address = getContractAddressById('easySwapperV2', chainId)

  const slippage =
    slippageFromSettings === 'auto'
      ? DEFAULT_SWAP_TRANSACTION_SLIPPAGE
      : slippageFromSettings

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
      fromAddress: easySwapperV2Address,
    },
    {
      enabled: isDepositWithSwapTransaction && !!debouncedSendTokenValue,
      refetchInterval: SHORTEN_POLLING_INTERVAL,
    },
  )
}
