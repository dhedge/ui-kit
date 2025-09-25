import BigNumber from 'bignumber.js'

import type { Address } from 'viem'

import { erc20Abi } from 'core-kit/abi'
import {
  DEFAULT_RECEIVED_VALUE_GAP,
  SHORTEN_POLLING_INTERVAL,
} from 'core-kit/const'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'

import {
  useAssetPrice,
  useSendTokenDebouncedValue,
} from 'core-kit/hooks/trading'
import { useIsDepositWithSwapTransaction } from 'core-kit/hooks/trading/deposit-v2/use-is-deposit-with-swap-transaction'
import { useVaultDepositParams } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-params'
import { useReadContract } from 'core-kit/hooks/web3'

interface UseVaultDepositTokenAmountParams {
  isDepositWithSwapTransaction: boolean
  sendTokenAddress: Address
  sendTokenValue: string
}

const useVaultDepositTokenAmountBasedOnSendToken = ({
  isDepositWithSwapTransaction,
  sendTokenAddress,
  sendTokenValue,
}: UseVaultDepositTokenAmountParams) => {
  const { chainId } = useTradingPanelPoolConfig()

  const sendTokenPrice = +useAssetPrice({
    address: sendTokenAddress,
    chainId,
  })

  const { vaultDepositTokenAddress } = useVaultDepositParams()
  const { data: decimals } = useReadContract({
    address: vaultDepositTokenAddress,
    abi: erc20Abi,
    functionName: 'decimals',
    chainId,
  })
  const vaultDepositTokenPrice = +useAssetPrice({
    address: vaultDepositTokenAddress,
    chainId,
    refetchInterval: SHORTEN_POLLING_INTERVAL,
    disabled: !isDepositWithSwapTransaction,
  })

  const sendValueInUsd = Number(sendTokenValue || '0') * sendTokenPrice

  return decimals && vaultDepositTokenPrice !== 0
    ? new BigNumber(sendValueInUsd / vaultDepositTokenPrice)
        .shiftedBy(decimals)
        .times(1 - DEFAULT_RECEIVED_VALUE_GAP / 100)
        .toFixed(0)
    : '0'
}

export const useVaultDepositTokenAmount = () => {
  const [sendToken] = useSendTokenInput()
  const { debouncedSendTokenValue } = useSendTokenDebouncedValue()

  const isDepositWithSwapTransaction = useIsDepositWithSwapTransaction()
  const vaultDepositTokenAmountBasedOnSendToken =
    useVaultDepositTokenAmountBasedOnSendToken({
      isDepositWithSwapTransaction,
      sendTokenAddress: sendToken.address,
      sendTokenValue: debouncedSendTokenValue,
    })

  return isDepositWithSwapTransaction
    ? vaultDepositTokenAmountBasedOnSendToken
    : new BigNumber(debouncedSendTokenValue || '0')
        .shiftedBy(sendToken.decimals)
        .toFixed(0)
}
