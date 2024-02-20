import * as w from 'wagmi'

import { DEFAULT_CHAIN_ID, optimism, polygon } from 'const'
import { renderHook } from 'test-utils'

import { useNetwork } from './use-network'

vi.mock('wagmi', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('wagmi')

  return {
    ...actual,
    useAccount: vi.fn(),
    useConfig: vi.fn(),
    useSwitchChain: () => ({
      switchChain: 'switchNetwork',
      switchChainAsync: 'switchNetworkAsync',
    }),
  }
})

describe('useNetwork', () => {
  it('should return network data', () => {
    vi.mocked(w.useAccount).mockImplementationOnce(
      () =>
        ({
          chain: optimism,
        }) as unknown as ReturnType<typeof w.useAccount>,
    )

    vi.mocked(w.useConfig).mockImplementationOnce(
      () =>
        ({
          chains: [optimism],
        }) as unknown as ReturnType<typeof w.useConfig>,
    )

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
    vi.mocked(w.useAccount).mockImplementationOnce(
      () =>
        ({
          chain: polygon,
        }) as unknown as ReturnType<typeof w.useAccount>,
    )

    vi.mocked(w.useConfig).mockImplementationOnce(
      () =>
        ({
          chains: [optimism],
        }) as unknown as ReturnType<typeof w.useConfig>,
    )

    const { result } = renderHook(() => useNetwork())

    expect(result.current.isSupported).toBe(false)
  })

  it('should resolve supported chain', () => {
    vi.mocked(w.useAccount).mockImplementationOnce(
      () =>
        ({
          chain: optimism,
        }) as unknown as ReturnType<typeof w.useAccount>,
    )

    vi.mocked(w.useConfig).mockImplementationOnce(
      () =>
        ({
          chains: [optimism],
        }) as unknown as ReturnType<typeof w.useConfig>,
    )

    const { result } = renderHook(() => useNetwork())

    expect(result.current.isSupported).toBe(true)
  })

  it('should fallback to default chain id on supportedChainId', () => {
    vi.mocked(w.useAccount).mockImplementationOnce(
      () =>
        ({
          chain: polygon,
        }) as unknown as ReturnType<typeof w.useAccount>,
    )

    vi.mocked(w.useConfig).mockImplementationOnce(
      () =>
        ({
          chains: [optimism],
        }) as unknown as ReturnType<typeof w.useConfig>,
    )

    const { result } = renderHook(() => useNetwork())

    expect(result.current.supportedChainId).toBe(DEFAULT_CHAIN_ID)
  })

  it('should return undefined for unsupported chain on chainId', () => {
    vi.mocked(w.useAccount).mockImplementationOnce(
      () =>
        ({
          chain: polygon,
        }) as unknown as ReturnType<typeof w.useAccount>,
    )

    vi.mocked(w.useConfig).mockImplementationOnce(
      () =>
        ({
          chains: [optimism],
        }) as unknown as ReturnType<typeof w.useConfig>,
    )

    const { result } = renderHook(() => useNetwork())

    expect(result.current.chainId).toBeUndefined()
  })
})
