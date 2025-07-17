import { arbitrum, mainnet, optimism, polygon } from 'wagmi/chains'

import { getExplorerLink } from 'core-kit/utils/url'

describe('getExplorerLink', () => {
  it('should return transaction explorer link, Optimism', () => {
    expect(getExplorerLink('0x123abc', 'transaction', optimism.id)).toBe(
      'https://optimistic.etherscan.io/tx/0x123abc',
    )
  })

  it('should return address explorer link, Polygon', () => {
    expect(getExplorerLink('0x456def', 'address', polygon.id)).toBe(
      'https://polygonscan.com/address/0x456def',
    )
  })

  it('should return address explorer link, Arbitrum', () => {
    expect(getExplorerLink('0x456def', 'address', arbitrum.id)).toBe(
      'https://arbiscan.io/address/0x456def',
    )
  })

  it('should return undefined if chainId is not provided', () => {
    expect(getExplorerLink('0x123abc', 'transaction', mainnet.id)).toBe(
      'https://etherscan.io/tx/0x123abc',
    )
  })
})
