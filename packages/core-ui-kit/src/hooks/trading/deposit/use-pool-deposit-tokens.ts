import uniqBy from 'lodash.uniqby'

import { useMemo } from 'react'

import { erc20Abi } from 'abi'
import { AddressZero, CHAIN_NATIVE_TOKENS, DEFAULT_PRECISION } from 'const'
import { usePoolComposition } from 'hooks/pool'
import { useTradingPanelPoolConfig } from 'hooks/state'
import { useIsPoolManagerAccount } from 'hooks/user'
import {
  useAccount,
  useReadContracts,
  useContractReadsErrorLogging,
} from 'hooks/web3'
import type { TradingToken } from 'types/trading-panel.types'
import type { Address } from 'types/web3.types'
import { normalizeNumber } from 'utils'

import { useIsEasySwapperTrading } from '../use-is-easy-swapper-trading'

interface ProductDepositToken extends TradingToken {
  balance?: number
}

export const usePoolDepositTokens = (): TradingToken[] => {
  const { address, chainId, depositParams } = useTradingPanelPoolConfig()
  const { account } = useAccount()
  const poolComposition = usePoolComposition({ address, chainId })
  const isPoolManagerAccount = useIsPoolManagerAccount()
  const isEasySwapperTrading = useIsEasySwapperTrading()

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
          ...depositParams.customTokens.map((token) => ({
            ...token,
            address: token.address.toLowerCase() as Address,
          })),
        ],
        'address',
      ),
    [poolComposition, depositParams.customTokens],
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
      // remove native deposits for dHEDGE managers and in SynthetixV3 vaults
      ...(isPoolManagerAccount || !isEasySwapperTrading
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
    isPoolManagerAccount,
    depositTokens,
    balances,
    chainId,
    depositParams.defaultDepositTokenSymbol,
    isEasySwapperTrading,
  ])
}
