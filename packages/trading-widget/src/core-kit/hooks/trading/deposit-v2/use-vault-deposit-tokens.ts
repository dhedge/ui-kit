import uniqBy from 'lodash.uniqby'

import { useMemo } from 'react'

import { erc20Abi } from 'core-kit/abi'
import {
  AddressZero,
  CHAIN_NATIVE_TOKENS,
  DEFAULT_PRECISION,
} from 'core-kit/const'
import { usePoolComposition } from 'core-kit/hooks/pool'
import {
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useIsDhedgeVaultConnected } from 'core-kit/hooks/user'
import {
  useAccount,
  useContractReadsErrorLogging,
  useReadContracts,
} from 'core-kit/hooks/web3'
import type { TradingToken } from 'core-kit/types/trading-panel.types'
import type { Address } from 'core-kit/types/web3.types'
import { normalizeNumber } from 'core-kit/utils'

interface ProductDepositToken extends TradingToken {
  balance?: number
}

export const useVaultDepositTokens = (): TradingToken[] => {
  const { address, chainId, depositParams } = useTradingPanelPoolConfig()
  const { account } = useAccount()
  const poolComposition = usePoolComposition({ address, chainId })
  const isDhedgeVaultConnected = useIsDhedgeVaultConnected()
  const [{ isCustomDepositOptionsDisabled }] = useTradingPanelSettings()

  const depositTokens = useMemo(
    () =>
      uniqBy(
        [
          ...poolComposition
            .filter(({ isDeposit }) => isDeposit)
            .map(({ tokenAddress, tokenName, precision }) => ({
              address: tokenAddress.toLowerCase() as Address,
              symbol: tokenName,
              decimals: precision,
            })),
          ...(isCustomDepositOptionsDisabled
            ? []
            : depositParams.customTokens.map((token) => ({
                ...token,
                address: token.address.toLowerCase() as Address,
              }))),
        ],
        'address',
      ),
    [
      poolComposition,
      isCustomDepositOptionsDisabled,
      depositParams.customTokens,
    ],
  )

  const hasDepositTokens = !!depositTokens.length
  const canLoadTokenBalances = !!account && hasDepositTokens

  const { data: balances } = useReadContracts({
    contracts: depositTokens.map(({ address }) => ({
      address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [account ?? AddressZero],
      chainId,
    })),
    query: {
      enabled: canLoadTokenBalances,
    },
  })
  useContractReadsErrorLogging(balances)

  return useMemo(() => {
    // wait all data for sorting and minimal re-rendering
    if (!hasDepositTokens) {
      return []
    }

    const assetData: ProductDepositToken[] = []

    for (let i = 0; i < depositTokens.length; i++) {
      assetData[i] = {
        value: '',
        address: depositTokens[i]?.address ?? AddressZero,
        symbol:
          depositTokens[i]?.symbol ?? depositTokens[i]?.address ?? AddressZero,
        balance: balances?.[i]?.result
          ? normalizeNumber(
              (balances?.[i]?.result as bigint).toString() ?? '0',
              depositTokens[i]?.decimals ?? DEFAULT_PRECISION,
            )
          : 0,
        decimals: depositTokens[i]?.decimals ?? DEFAULT_PRECISION,
      }
    }

    const productDepositTokens = assetData
      .slice()
      .sort((first, second) =>
        first.balance && second.balance ? second.balance - first.balance : 0,
      )

    const defaultDepositToken = productDepositTokens.find(
      ({ symbol }) => symbol === depositParams.defaultDepositTokenSymbol,
    )

    return [
      ...(defaultDepositToken ? [defaultDepositToken] : []),
      ...productDepositTokens.filter(
        ({ symbol }) => symbol !== depositParams.defaultDepositTokenSymbol,
      ),
      // remove native deposits from dHEDGE vaults
      ...(isDhedgeVaultConnected || isCustomDepositOptionsDisabled
        ? []
        : [
            {
              value: '',
              address: CHAIN_NATIVE_TOKENS[chainId]?.address ?? AddressZero,
              symbol: CHAIN_NATIVE_TOKENS[chainId]?.nativeTokenSymbol ?? '',
              decimals:
                CHAIN_NATIVE_TOKENS[chainId]?.decimals ?? DEFAULT_PRECISION,
            },
          ]),
    ]
  }, [
    hasDepositTokens,
    isDhedgeVaultConnected,
    isCustomDepositOptionsDisabled,
    chainId,
    depositTokens,
    balances,
    depositParams.defaultDepositTokenSymbol,
  ])
}
