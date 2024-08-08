import BigNumber from 'bignumber.js'

import { AddressZero, SHORTEN_POLLING_INTERVAL } from 'core-kit/const'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useSwapDataQuery } from 'core-kit/hooks/trading'
import { useDebounce } from 'core-kit/hooks/utils'
import { useAccount } from 'core-kit/hooks/web3'
import { isEqualAddress } from 'core-kit/utils'

import { useVaultDepositParams } from './use-vault-deposit-params'

export const useSwapDataBasedOnSendToken = () => {
  const { account: walletAddress = AddressZero } = useAccount()
  const [sendToken] = useSendTokenInput()
  const { chainId } = useTradingPanelPoolConfig()
  const debouncedSendTokenValue = useDebounce(sendToken.value, 500)
  const { vaultDepositTokenAddress } = useVaultDepositParams()

  const isCustomDepositToken = !isEqualAddress(
    sendToken.address,
    vaultDepositTokenAddress,
  )

  return useSwapDataQuery(
    {
      sourceAddress: sendToken.address,
      destinationAddress: vaultDepositTokenAddress,
      amount: new BigNumber(debouncedSendTokenValue)
        .shiftedBy(sendToken.decimals)
        .toFixed(0),
      chainId,
      slippage: '0.1', // TODO: handle
      walletAddress,
    },
    {
      enabled: isCustomDepositToken && !!debouncedSendTokenValue,
      refetchInterval: SHORTEN_POLLING_INTERVAL,
    },
  )
}
