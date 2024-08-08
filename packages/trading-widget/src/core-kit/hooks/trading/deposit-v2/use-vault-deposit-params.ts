import { useMemo } from 'react'

import {
  BRIDGED_USDC_ARBITRUM,
  BRIDGED_USDC_OPTIMISM,
  BRIDGED_USDC_POLYGON,
  CHAIN_NATIVE_TOKENS,
  DAI_OPTIMISM,
  DAI_POLYGON,
  EASY_SWAPPER_V2_DEPOSIT_METHODS,
  USDC_ARBITRUM,
  USDC_BASE,
  USDC_OPTIMISM,
  USDC_POLYGON,
  USDT_OPTIMISM,
  USDT_POLYGON,
  WBTC_ARBITRUM,
  WBTC_OPTIMISM,
  WBTC_POLYGON,
  WETH_ARBITRUM,
  WETH_BASE,
  WETH_OPTIMISM,
  WETH_POLYGON,
  WMATIC_POLYGON,
  arbitrum,
  base,
  optimism,
  polygon,
} from 'core-kit/const'
import { usePoolComposition } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import type {
  ChainId,
  PoolComposition,
  TradingToken,
  VaultDepositParams,
} from 'core-kit/types'

import { isEqualAddress, isNativeToken } from 'core-kit/utils'

const FALLBACK_ASSETS_MAP: Record<ChainId, Record<string, TradingToken>> = {
  [optimism.id]: {
    WETH: WETH_OPTIMISM,
    USDC: USDC_OPTIMISM,
    WBTC: WBTC_OPTIMISM,
    USDCe: BRIDGED_USDC_OPTIMISM,
    USDT: USDT_OPTIMISM,
    DAI: DAI_OPTIMISM,
  },
  [polygon.id]: {
    WMATIC: WMATIC_POLYGON,
    WETH: WETH_POLYGON,
    USDC: USDC_POLYGON,
    WBTC: WBTC_POLYGON,
    USDCe: BRIDGED_USDC_POLYGON,
    USDT: USDT_POLYGON,
    DAI: DAI_POLYGON,
  },
  [arbitrum.id]: {
    WETH: WETH_ARBITRUM,
    USDC: USDC_ARBITRUM,
    WBTC: WBTC_ARBITRUM,
    USDCe: BRIDGED_USDC_ARBITRUM,
  },
  [base.id]: {
    WETH: WETH_BASE,
    USDC: USDC_BASE,
  },
}

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
  // TODO: IMPLEMENT
  const isCustomCooldownAvailable = false

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
          depositMethod: isCustomCooldownAvailable
            ? EASY_SWAPPER_V2_DEPOSIT_METHODS.NATIVE_CUSTOM
            : EASY_SWAPPER_V2_DEPOSIT_METHODS.NATIVE,
          vaultDepositTokenAddress:
            wrappedNativeTokenInComposition.tokenAddress,
        }
      }
      return {
        depositMethod: isCustomCooldownAvailable
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
        depositMethod: isCustomCooldownAvailable
          ? EASY_SWAPPER_V2_DEPOSIT_METHODS.DEPOSIT_CUSTOM
          : EASY_SWAPPER_V2_DEPOSIT_METHODS.DEPOSIT,
        vaultDepositTokenAddress: depositTokenPresentedInVault.tokenAddress,
      }
    }

    // Step 3: Handle custom token deposit
    return {
      depositMethod: isCustomCooldownAvailable
        ? EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_DEPOSIT_CUSTOM
        : EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_DEPOSIT,
      vaultDepositTokenAddress:
        getVaultDepositTokenAddress(availableDepositOptions, chainId) ??
        sendToken.address,
    }
  }, [
    chainId,
    isCustomCooldownAvailable,
    poolComposition,
    sendToken.address,
    sendToken.symbol,
  ])
}
