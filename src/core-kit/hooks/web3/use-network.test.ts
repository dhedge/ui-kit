import * as w from 'wagmi'

import { base, optimism, polygon } from 'core-kit/const'
import * as stateHooks from 'core-kit/hooks/state'
import { useNetwork } from 'core-kit/hooks/web3/use-network'
import { renderHook } from 'tests/test-utils'

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

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelDefaultChainId: vi.fn(),
}))

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

  it('should fallback to first chain id on supportedChainId', () => {
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

    expect(result.current.supportedChainId).toBe(optimism.id)
  })

  it('should fallback to state defaultChainId on supportedChainId', () => {
    vi.mocked(w.useAccount).mockImplementationOnce(
      () =>
        ({
          chain: polygon,
        }) as unknown as ReturnType<typeof w.useAccount>,
    )

    vi.mocked(w.useConfig).mockImplementationOnce(
      () =>
        ({
          chains: [optimism, base],
        }) as unknown as ReturnType<typeof w.useConfig>,
    )

    vi.mocked(stateHooks.useTradingPanelDefaultChainId).mockImplementation(
      () => base.id,
    )

    const { result } = renderHook(() => useNetwork())

    expect(result.current.supportedChainId).toBe(base.id)
  })

  it('should fallback to first chain id on supportedChainId if state defaultChainId is out of chains list', () => {
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

    vi.mocked(stateHooks.useTradingPanelDefaultChainId).mockImplementation(
      () => base.id,
    )

    const { result } = renderHook(() => useNetwork())

    expect(result.current.supportedChainId).toBe(optimism.id)
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
