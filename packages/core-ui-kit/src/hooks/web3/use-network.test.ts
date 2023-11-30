import * as w from 'wagmi'

import { DEFAULT_CHAIN_ID, optimism, polygon } from 'const'
import { renderHook } from 'test-utils'

import { useNetwork } from './use-network'

vi.mock('wagmi', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('wagmi')

  return {
    ...actual,
    useNetwork: vi.fn(),
    useSwitchNetwork: () => ({
      switchNetwork: 'switchNetwork',
      switchNetworkAsync: 'switchNetworkAsync',
    }),
  }
})

describe('useNetwork', () => {
  it('should return network data', () => {
    vi.mocked(w.useNetwork).mockImplementationOnce(() => ({
      chain: optimism,
      chains: [optimism],
    }))

    const { result } = renderHook(() => useNetwork())

    expect(result.current).toEqual({
      chain: optimism,
      isSupported: true,
      switchNetwork: 'switchNetwork',
      switchNetworkAsync: 'switchNetworkAsync',
      chainId: optimism.id,
      supportedChainId: optimism.id,
      chains: [optimism],
    })
  })

  it('should resolve unsupported chain', () => {
    vi.mocked(w.useNetwork).mockImplementationOnce(() => ({
      chain: polygon,
      chains: [optimism],
    }))

    const { result } = renderHook(() => useNetwork())

    expect(result.current.isSupported).toBe(false)
  })

  it('should resolve supported chain', () => {
    vi.mocked(w.useNetwork).mockImplementationOnce(() => ({
      chain: optimism,
      chains: [optimism],
    }))

    const { result } = renderHook(() => useNetwork())

    expect(result.current.isSupported).toBe(true)
  })

  it('should fallback to default chain id on supportedChainId', () => {
    vi.mocked(w.useNetwork).mockImplementationOnce(() => ({
      chain: polygon,
      chains: [optimism],
    }))

    const { result } = renderHook(() => useNetwork())

    expect(result.current.supportedChainId).toBe(DEFAULT_CHAIN_ID)
  })

  it('should return undefined for unsupported chain on chainId', () => {
    vi.mocked(w.useNetwork).mockImplementationOnce(() => ({
      chain: polygon,
      chains: [optimism],
    }))

    const { result } = renderHook(() => useNetwork())

    expect(result.current.chainId).toBeUndefined()
  })
})
