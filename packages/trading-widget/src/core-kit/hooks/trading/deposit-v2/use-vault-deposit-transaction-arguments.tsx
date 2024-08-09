import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import type { VaultDepositParams } from 'core-kit/types'

import { buildZapDepositTransactionArguments } from 'core-kit/utils'

import { useMinVaultTokensReceivedAmount } from './use-min-vault-tokens-received-amount'
import { useSwapDataBasedOnSendToken } from './use-swap-data-based-on-send-token'
import { useVaultDepositTokenAmount } from './use-vault-deposit-token-amount'

export const useVaultDepositTransactionArguments = ({
  depositMethod,
  vaultDepositTokenAddress,
}: VaultDepositParams): unknown[] => {
  const { address } = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const sendTokenAmount = new BigNumber(sendToken.value)
    .shiftedBy(sendToken.decimals)
    .toFixed(0)
  const vaultDepositTokenAmount = useVaultDepositTokenAmount()
  const { data: swapData } = useSwapDataBasedOnSendToken()
  const minVaultTokensReceivedAmount = useMinVaultTokensReceivedAmount()

  return useMemo(() => {
    switch (depositMethod) {
      case 'nativeDeposit':
      case 'nativeDepositWithCustomCooldown':
        return [address, { value: vaultDepositTokenAmount }]
      case 'zapNativeDeposit':
      case 'zapNativeDepositWithCustomCooldown':
        return [
          ...buildZapDepositTransactionArguments({
            vaultAddress: address,
            sendTokenAddress: sendToken.address,
            sendTokenAmount,
            minVaultTokensReceivedAmount,
            vaultDepositTokenAddress,
            swapData: swapData?.tx?.data ?? '',
          }),
          { value: sendTokenAmount },
        ]
      case 'zapDeposit':
      case 'zapDepositWithCustomCooldown':
        return [
          ...buildZapDepositTransactionArguments({
            vaultAddress: address,
            sendTokenAddress: sendToken.address,
            sendTokenAmount,
            minVaultTokensReceivedAmount,
            vaultDepositTokenAddress,
            swapData: swapData?.tx.data ?? '',
          }),
        ]
      default:
        // deposit, deposit with custom cooldown
        return [address, vaultDepositTokenAddress, vaultDepositTokenAmount]
    }
  }, [
    depositMethod,
    address,
    vaultDepositTokenAmount,
    sendToken.address,
    sendTokenAmount,
    minVaultTokensReceivedAmount,
    vaultDepositTokenAddress,
    swapData?.tx?.data,
  ])
}
