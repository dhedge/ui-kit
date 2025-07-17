import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'

import { useAppliedDepositSlippage } from 'core-kit/hooks/trading/deposit-v2/use-applied-deposit-slippage'
import { useMinVaultTokensReceivedAmount } from 'core-kit/hooks/trading/deposit-v2/use-min-vault-tokens-received-amount'
import { useSwapDataBasedOnSendToken } from 'core-kit/hooks/trading/deposit-v2/use-swap-data-based-on-send-token'
import { useVaultDepositTokenAmount } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-token-amount'
import type { VaultDepositParams } from 'core-kit/types'
import { buildZapDepositTransactionArguments } from 'core-kit/utils'

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
  const depositSlippage = useAppliedDepositSlippage()

  return useMemo(() => {
    const isZapDeposit =
      depositMethod === 'zapNativeDeposit' ||
      depositMethod === 'zapNativeDepositWithCustomCooldown' ||
      depositMethod === 'zapDeposit' ||
      depositMethod === 'zapDepositWithCustomCooldown'
    const zapDepositArguments = isZapDeposit
      ? buildZapDepositTransactionArguments({
          vaultAddress: address,
          sendTokenAddress: sendToken.address,
          sendTokenAmount,
          minVaultTokensReceivedAmount,
          vaultDepositTokenAddress,
          swapData: swapData?.rawTransaction.data ?? '0x',
          routerKey: swapData?.routerKey,
          swapDestinationAmount: swapData?.destinationAmount ?? '0',
          swapSlippage: depositSlippage,
        })
      : []

    switch (depositMethod) {
      case 'nativeDeposit':
      case 'nativeDepositWithCustomCooldown':
        return [
          address,
          minVaultTokensReceivedAmount,
          { value: vaultDepositTokenAmount },
        ]
      case 'zapNativeDeposit':
      case 'zapNativeDepositWithCustomCooldown':
        return [...zapDepositArguments, { value: sendTokenAmount }]
      case 'zapDeposit':
      case 'zapDepositWithCustomCooldown':
        return zapDepositArguments
      default:
        // deposit, deposit with custom cooldown
        return [
          address,
          vaultDepositTokenAddress,
          vaultDepositTokenAmount,
          minVaultTokensReceivedAmount,
        ]
    }
  }, [
    depositMethod,
    address,
    sendToken.address,
    sendTokenAmount,
    minVaultTokensReceivedAmount,
    vaultDepositTokenAddress,
    swapData?.rawTransaction.data,
    swapData?.routerKey,
    swapData?.destinationAmount,
    depositSlippage,
    vaultDepositTokenAmount,
  ])
}
