import BigNumber from 'bignumber.js'

import {
  CHAIN_NATIVE_TOKENS,
  DEFAULT_PRECISION,
  NATIVE_TOKEN_DEPOSIT_GAS_LIMIT,
} from 'const'
import type { ChainId } from 'types/web3.types'

export const isNativeToken = (symbol: string, chainId: ChainId): boolean =>
  CHAIN_NATIVE_TOKENS[chainId]?.nativeTokenSymbol === symbol

export const getNativeTokenInvestableBalance = (
  nativeTokenBalance: string,
  gasPrice: number,
) => {
  const transactionFee = new BigNumber(gasPrice)
    .multipliedBy(NATIVE_TOKEN_DEPOSIT_GAS_LIMIT)
    .shiftedBy(-DEFAULT_PRECISION)
  const adjustedBalance = new BigNumber(nativeTokenBalance).minus(
    transactionFee,
  )
  return adjustedBalance.gt('0') ? adjustedBalance : new BigNumber('0')
}
