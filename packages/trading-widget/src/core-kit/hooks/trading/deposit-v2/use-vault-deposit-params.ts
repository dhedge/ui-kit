import { useMemo } from 'react'

import {
  CHAIN_NATIVE_TOKENS,
  EASY_SWAPPER_V2_DEPOSIT_METHODS,
  FALLBACK_ASSETS_MAP,
} from 'core-kit/const'
import { usePoolComposition } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import type {
  ChainId,
  PoolComposition,
  VaultDepositParams,
} from 'core-kit/types'

import { isEqualAddress, isNativeToken } from 'core-kit/utils'

import { useIsCustomCooldownDeposit } from './use-is-custom-cooldown-deposit'

const getVaultDepositTokenAddress = (
  availableDepositOptions: PoolComposition[],
  chainId: ChainId,
) => {
  if (!availableDepositOptions.length) {
    return null
  }
  const fallbackToken = availableDepositOptions.find(
    ({ tokenName, tokenAddress }) =>
      Object.values(FALLBACK_ASSETS_MAP[chainId] ?? {}).some(
        (fallbackToken) =>
          fallbackToken.symbol === tokenName ||
          isEqualAddress(fallbackToken.address, tokenAddress),
      ),
  )

  return fallbackToken?.tokenAddress ?? availableDepositOptions[0]?.tokenAddress
}

export const useVaultDepositParams = (): VaultDepositParams => {
  const [sendToken] = useSendTokenInput()
  const { chainId, address } = useTradingPanelPoolConfig()
  const poolComposition = usePoolComposition({
    address,
    chainId,
  })
  const isCustomCooldownDeposit = useIsCustomCooldownDeposit()

  return useMemo<VaultDepositParams>(() => {
    const availableDepositOptions = poolComposition.filter(
      ({ isDeposit }) => isDeposit,
    )
    const isNativeTokenDeposit = isNativeToken(sendToken.symbol, chainId)

    // Step 1: Check if the token is native
    if (isNativeTokenDeposit) {
      const wrappedNativeTokenInComposition = availableDepositOptions.find(
        ({ tokenName }) =>
          CHAIN_NATIVE_TOKENS[chainId]?.wrappedNativeTokenName === tokenName,
      )
      if (wrappedNativeTokenInComposition) {
        return {
          depositMethod: isCustomCooldownDeposit
            ? EASY_SWAPPER_V2_DEPOSIT_METHODS.NATIVE_CUSTOM
            : EASY_SWAPPER_V2_DEPOSIT_METHODS.NATIVE,
          vaultDepositTokenAddress:
            wrappedNativeTokenInComposition.tokenAddress,
        }
      }
      return {
        depositMethod: isCustomCooldownDeposit
          ? EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_NATIVE_DEPOSIT_CUSTOM
          : EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_NATIVE_DEPOSIT,
        vaultDepositTokenAddress:
          getVaultDepositTokenAddress(availableDepositOptions, chainId) ??
          sendToken.address,
      }
    }

    const depositTokenPresentedInVault = availableDepositOptions.find(
      ({ tokenName, tokenAddress }) =>
        tokenName === sendToken.symbol ||
        isEqualAddress(tokenAddress, sendToken.address),
    )

    // Step 2: Check if the token is presented in the vault
    if (depositTokenPresentedInVault) {
      return {
        depositMethod: isCustomCooldownDeposit
          ? EASY_SWAPPER_V2_DEPOSIT_METHODS.DEPOSIT_CUSTOM
          : EASY_SWAPPER_V2_DEPOSIT_METHODS.DEPOSIT,
        vaultDepositTokenAddress: depositTokenPresentedInVault.tokenAddress,
      }
    }

    // Step 3: Handle custom token deposit
    return {
      depositMethod: isCustomCooldownDeposit
        ? EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_DEPOSIT_CUSTOM
        : EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_DEPOSIT,
      vaultDepositTokenAddress:
        getVaultDepositTokenAddress(availableDepositOptions, chainId) ??
        sendToken.address,
    }
  }, [
    chainId,
    isCustomCooldownDeposit,
    poolComposition,
    sendToken.address,
    sendToken.symbol,
  ])
}
