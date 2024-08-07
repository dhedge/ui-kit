import type { BigNumber } from 'bignumber.js'

import type {
  BuyingWithEasyswapperArgs,
  BuyingWithNativeAssetArgs,
  BuyingWithPoolLogicArgs,
  DefaultSellingParams,
} from 'core-kit/models'
import type { Address, ChainId } from 'core-kit/types/web3.types'

export interface TradingParams {
  sendAssetAddress: Address
  fromTokenAmount: BigNumber
  receiveAssetAmount: string
  poolDepositAddress?: Address
  receiveAssetAddress: Address
}

export type NativeTokenSymbol = 'ETH' | 'MATIC'

export type ChainNativeTokenMap = {
  [key in ChainId]?: {
    nativeTokenSymbol: NativeTokenSymbol
    wrappedNativeTokenName: string
    address: Address
    decimals: number
  }
}

export type PoolDepositMethodName = 'deposit' | 'depositWithCustomCooldown'

export type TxArgs =
  | BuyingWithEasyswapperArgs
  | BuyingWithNativeAssetArgs
  | DefaultSellingParams
  | BuyingWithPoolLogicArgs
