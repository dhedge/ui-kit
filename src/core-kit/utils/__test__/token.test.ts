import { mainnet, polygon } from 'wagmi/chains'

import type { NativeTokenSymbol } from 'core-kit/types'
import { isNativeToken } from 'core-kit/utils/token'

describe('isNativeToken', () => {
  it('should return true when the symbol matches the native token symbol for the given chainId', () => {
    const symbol: NativeTokenSymbol = 'POL'
    const chainId = polygon.id
    expect(isNativeToken(symbol, chainId)).toBe(true)
  })

  it('should return false when the symbol does not match the native token symbol for the given chainId', () => {
    const symbol: NativeTokenSymbol = 'ETH'
    expect(isNativeToken(symbol, polygon.id)).toBe(false)
  })

  it('should return false when the chainId is not found in the CHAIN_NATIVE_TOKENS map', () => {
    const symbol: NativeTokenSymbol = 'POL'
    expect(isNativeToken(symbol, mainnet.id)).toBe(false)
  })
})
