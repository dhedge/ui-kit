import BigNumber from 'bignumber.js'

import {
  CHAIN_NATIVE_TOKENS,
  NATIVE_TOKEN_DEPOSIT_GAS_LIMIT,
  STABLE_TOKEN_SYMBOLS,
} from 'core-kit/const'
import type { ChainId } from 'core-kit/types/web3.types'

export const isNativeToken = (symbol: string, chainId: ChainId): boolean =>
  CHAIN_NATIVE_TOKENS[chainId]?.nativeTokenSymbol === symbol

export const getNativeTokenInvestableBalance = ({
  nativeTokenBalance,
  tokenDecimals,
  gasPrice,
}: {
  nativeTokenBalance: string
  gasPrice: number
  tokenDecimals: number
}) => {
  const transactionFee = new BigNumber(gasPrice)
    .multipliedBy(NATIVE_TOKEN_DEPOSIT_GAS_LIMIT)
    .shiftedBy(-tokenDecimals)
  const adjustedBalance = new BigNumber(nativeTokenBalance).minus(
    transactionFee,
  )
  return adjustedBalance.gt('0') ? adjustedBalance : new BigNumber('0')
}

export const isStableSymbol = (symbol: string) =>
  STABLE_TOKEN_SYMBOLS.includes(symbol)
