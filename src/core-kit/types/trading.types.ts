import type { Hex } from 'viem'

import type { Address, ChainId } from 'core-kit/types/web3.types'

export type NativeTokenSymbol = 'ETH' | 'POL'

export type ChainNativeTokenMap = {
  [key in ChainId]?: {
    nativeTokenSymbol: NativeTokenSymbol
    wrappedNativeTokenName: string
    address: Address
    decimals: number
  }
}

export interface SwapDataResponse {
  destinationAmount: string
  rawTransaction: {
    data: Hex
  }
  routerKey:
    | 'ONE_INCH'
    | 'ZERO_X'
    | 'PARASWAP'
    | 'ONE_INCH_V5'
    | 'PARASWAP_V6'
    | 'ODOS_V2'
}

export interface SwapDataRequest {
  chainId: number
  sourceAddress: Address
  destinationAddress: Address
  walletAddress: Address
  fromAddress: Address
  amount: string
  slippage: string
  aggregators?: string[]
}

export interface VaultDepositParams {
  depositMethod: DepositMethodName
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
