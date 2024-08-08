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

export type TxArgs =
  | BuyingWithEasyswapperArgs
  | BuyingWithNativeAssetArgs
  | DefaultSellingParams
  | BuyingWithPoolLogicArgs

export interface SwapDataResponse {
  dstAmount: string
  tx: { data: string }
}

export interface SwapDataRequest {
  chainId: number
  sourceAddress: Address
  destinationAddress: Address
  walletAddress: Address
  amount: string
  slippage: string
}

export interface VaultDepositParams {
  depositMethod: DepositMethodName | undefined
  vaultDepositTokenAddress: Address
}

export type DepositMethodName =
  | 'deposit'
  | 'depositWithCustomCooldown'
  | 'nativeDeposit'
  | 'nativeDepositWithCustomCooldown'
  | 'zapNativeDeposit'
  | 'zapNativeDepositWithCustomCooldown'
  | 'zapDeposit'
  | 'zapDepositWithCustomCooldown'
