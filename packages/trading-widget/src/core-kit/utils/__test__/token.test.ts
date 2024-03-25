import { mainnet, polygon } from 'wagmi/chains'

import type { NativeTokenSymbol } from '../../types'
import { isNativeToken } from '../token'

describe('isNativeToken', () => {
  it('should return true when the symbol matches the native token symbol for the given chainId', () => {
    const symbol: NativeTokenSymbol = 'MATIC'
    const chainId = polygon.id
    expect(isNativeToken(symbol, chainId)).toBe(true)
  })

  it('should return false when the symbol does not match the native token symbol for the given chainId', () => {
    const symbol: NativeTokenSymbol = 'ETH'
    expect(isNativeToken(symbol, polygon.id)).toBe(false)
  })

  it('should return false when the chainId is not found in the CHAIN_NATIVE_TOKENS map', () => {
    const symbol: NativeTokenSymbol = 'MATIC'
    expect(isNativeToken(symbol, mainnet.id)).toBe(false)
  })
})
