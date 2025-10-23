import { DEFAULT_PRECISION, optimism } from 'core-kit/const'
import * as multicallHooks from 'core-kit/hooks/pool/multicall'
import { useAvailableManagerFee } from 'core-kit/hooks/pool/use-available-manager-fee'
import { usePoolTokenPrice } from 'core-kit/hooks/pool/use-pool-token-price'
import { useVaultSupplyCap } from 'core-kit/hooks/pool/use-vault-supply-cap'
import { shiftBy } from 'core-kit/utils'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolManagerStatic: vi.fn(),
  usePoolDynamic: vi.fn(),
}))

vi.mock('core-kit/hooks/pool/use-pool-token-price', () => ({
  usePoolTokenPrice: vi.fn(),
}))

vi.mock('core-kit/hooks/pool/use-available-manager-fee', () => ({
  useAvailableManagerFee: vi.fn(),
}))

const toD18String = (value: string | number) =>
  shiftBy(value, DEFAULT_PRECISION)

describe('useVaultSupplyCap', () => {
  const defaultParams = {
    address: TEST_ADDRESS,
    chainId: optimism.id,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when maxSupplyCapD18 is zero', () => {
    vi.mocked(multicallHooks.usePoolManagerStatic).mockReturnValue({
      data: { maxSupplyCapD18: 0n },
    } as ReturnType<typeof multicallHooks.usePoolManagerStatic>)
    vi.mocked(multicallHooks.usePoolDynamic).mockReturnValue({
      data: { totalSupplyD18: toD18String(100) },
    } as ReturnType<typeof multicallHooks.usePoolDynamic>)
    vi.mocked(usePoolTokenPrice).mockReturnValue('1')
    vi.mocked(useAvailableManagerFee).mockReturnValue({
      data: 10,
    } as ReturnType<typeof useAvailableManagerFee>)

    const { result } = renderHook(() => useVaultSupplyCap(defaultParams))

    expect(result.current).toBeNull()
  })

  it('returns null when maxSupplyCapD18 is undefined', () => {
    vi.mocked(multicallHooks.usePoolManagerStatic).mockReturnValue({
      data: { maxSupplyCapD18: undefined },
    } as ReturnType<typeof multicallHooks.usePoolManagerStatic>)
    vi.mocked(multicallHooks.usePoolDynamic).mockReturnValue({
      data: { totalSupplyD18: toD18String(100) },
    } as ReturnType<typeof multicallHooks.usePoolDynamic>)
    vi.mocked(usePoolTokenPrice).mockReturnValue('1')
    vi.mocked(useAvailableManagerFee).mockReturnValue({
      data: 10,
    } as ReturnType<typeof useAvailableManagerFee>)

    const { result } = renderHook(() => useVaultSupplyCap(defaultParams))

    expect(result.current).toBeNull()
  })

  it('calculates vault supply correctly with basic values', () => {
    // cap = 1000, total = 100, fee = 50, price = $2
    // effective cap = 1000 - 50 = 950
    // remaining = 950 - 100 = 850
    // remaining USD = 850 * 2 = 1700
    vi.mocked(multicallHooks.usePoolManagerStatic).mockReturnValue({
      data: { maxSupplyCapD18: BigInt(toD18String(1000)) },
    } as ReturnType<typeof multicallHooks.usePoolManagerStatic>)
    vi.mocked(multicallHooks.usePoolDynamic).mockReturnValue({
      data: { totalSupplyD18: toD18String(100) },
    } as ReturnType<typeof multicallHooks.usePoolDynamic>)
    vi.mocked(usePoolTokenPrice).mockReturnValue('2')
    vi.mocked(useAvailableManagerFee).mockReturnValue({
      data: 50,
    } as ReturnType<typeof useAvailableManagerFee>)

    const { result } = renderHook(() => useVaultSupplyCap(defaultParams))

    expect(result.current).toEqual({
      totalSupplyNumber: 100,
      maxSupplyCapNumber: 950,
      remainingSupplyCapNumber: 850,
      remainingSupplyCapInUsd: 1700,
    })
  })

  it('uses Math.ceil for totalSupplyNumber with fractional values', () => {
    // total = 123.4567 should ceil to 124
    vi.mocked(multicallHooks.usePoolManagerStatic).mockReturnValue({
      data: { maxSupplyCapD18: BigInt(toD18String(1000)) },
    } as ReturnType<typeof multicallHooks.usePoolManagerStatic>)
    vi.mocked(multicallHooks.usePoolDynamic).mockReturnValue({
      data: { totalSupplyD18: toD18String(123.4567) },
    } as ReturnType<typeof multicallHooks.usePoolDynamic>)
    vi.mocked(usePoolTokenPrice).mockReturnValue('1')
    vi.mocked(useAvailableManagerFee).mockReturnValue({
      data: 0,
    } as ReturnType<typeof useAvailableManagerFee>)

    const { result } = renderHook(() => useVaultSupplyCap(defaultParams))

    expect(result.current?.totalSupplyNumber).toBe(124)
  })

  it('prevents negative effectiveMaxSupplyCapNumber when manager fee exceeds cap', () => {
    // cap = 100, fee = 150 → effective should be 0, not -50
    vi.mocked(multicallHooks.usePoolManagerStatic).mockReturnValue({
      data: { maxSupplyCapD18: BigInt(toD18String(100)) },
    } as ReturnType<typeof multicallHooks.usePoolManagerStatic>)
    vi.mocked(multicallHooks.usePoolDynamic).mockReturnValue({
      data: { totalSupplyD18: toD18String(10) },
    } as ReturnType<typeof multicallHooks.usePoolDynamic>)
    vi.mocked(usePoolTokenPrice).mockReturnValue('1')
    vi.mocked(useAvailableManagerFee).mockReturnValue({
      data: 150,
    } as ReturnType<typeof useAvailableManagerFee>)

    const { result } = renderHook(() => useVaultSupplyCap(defaultParams))

    expect(result.current).toEqual({
      totalSupplyNumber: 10,
      maxSupplyCapNumber: 0,
      remainingSupplyCapNumber: 0,
      remainingSupplyCapInUsd: 0,
    })
  })

  it('prevents negative remainingSupplyCapNumber when total exceeds effective cap', () => {
    // cap = 200, fee = 50, total = 160
    // effective = 150, remaining should be 0, not -10
    vi.mocked(multicallHooks.usePoolManagerStatic).mockReturnValue({
      data: { maxSupplyCapD18: BigInt(toD18String(200)) },
    } as ReturnType<typeof multicallHooks.usePoolManagerStatic>)
    vi.mocked(multicallHooks.usePoolDynamic).mockReturnValue({
      data: { totalSupplyD18: toD18String(160) },
    } as ReturnType<typeof multicallHooks.usePoolDynamic>)
    vi.mocked(usePoolTokenPrice).mockReturnValue('1')
    vi.mocked(useAvailableManagerFee).mockReturnValue({
      data: 50,
    } as ReturnType<typeof useAvailableManagerFee>)

    const { result } = renderHook(() => useVaultSupplyCap(defaultParams))

    expect(result.current).toEqual({
      totalSupplyNumber: 160,
      maxSupplyCapNumber: 150,
      remainingSupplyCapNumber: 0,
      remainingSupplyCapInUsd: 0,
    })
  })

  it('correctly multiplies remaining cap by token price for USD value', () => {
    // remaining = 100 tokens, price = $123.45 → $12,345
    vi.mocked(multicallHooks.usePoolManagerStatic).mockReturnValue({
      data: { maxSupplyCapD18: BigInt(toD18String(1000)) },
    } as ReturnType<typeof multicallHooks.usePoolManagerStatic>)
    vi.mocked(multicallHooks.usePoolDynamic).mockReturnValue({
      data: { totalSupplyD18: toD18String(800) },
    } as ReturnType<typeof multicallHooks.usePoolDynamic>)
    vi.mocked(usePoolTokenPrice).mockReturnValue('123.45')
    vi.mocked(useAvailableManagerFee).mockReturnValue({
      data: 100,
    } as ReturnType<typeof useAvailableManagerFee>)

    const { result } = renderHook(() => useVaultSupplyCap(defaultParams))

    expect(result.current).toEqual({
      totalSupplyNumber: 800,
      maxSupplyCapNumber: 900,
      remainingSupplyCapNumber: 100,
      remainingSupplyCapInUsd: 12345,
    })
  })

  it('handles zero available manager fee', () => {
    vi.mocked(multicallHooks.usePoolManagerStatic).mockReturnValue({
      data: { maxSupplyCapD18: BigInt(toD18String(500)) },
    } as ReturnType<typeof multicallHooks.usePoolManagerStatic>)
    vi.mocked(multicallHooks.usePoolDynamic).mockReturnValue({
      data: { totalSupplyD18: toD18String(200) },
    } as ReturnType<typeof multicallHooks.usePoolDynamic>)
    vi.mocked(usePoolTokenPrice).mockReturnValue('1')
    vi.mocked(useAvailableManagerFee).mockReturnValue({
      data: 0,
    } as ReturnType<typeof useAvailableManagerFee>)

    const { result } = renderHook(() => useVaultSupplyCap(defaultParams))

    expect(result.current).toEqual({
      totalSupplyNumber: 200,
      maxSupplyCapNumber: 500,
      remainingSupplyCapNumber: 300,
      remainingSupplyCapInUsd: 300,
    })
  })

  it('handles undefined available manager fee (defaults to 0)', () => {
    vi.mocked(multicallHooks.usePoolManagerStatic).mockReturnValue({
      data: { maxSupplyCapD18: BigInt(toD18String(500)) },
    } as ReturnType<typeof multicallHooks.usePoolManagerStatic>)
    vi.mocked(multicallHooks.usePoolDynamic).mockReturnValue({
      data: { totalSupplyD18: toD18String(200) },
    } as ReturnType<typeof multicallHooks.usePoolDynamic>)
    vi.mocked(usePoolTokenPrice).mockReturnValue('1')
    vi.mocked(useAvailableManagerFee).mockReturnValue({
      data: undefined,
    } as ReturnType<typeof useAvailableManagerFee>)

    const { result } = renderHook(() => useVaultSupplyCap(defaultParams))

    expect(result.current).toEqual({
      totalSupplyNumber: 200,
      maxSupplyCapNumber: 500,
      remainingSupplyCapNumber: 300,
      remainingSupplyCapInUsd: 300,
    })
  })

  it('handles decimal token prices correctly', () => {
    // remaining = 50 tokens, price = $0.5 → $25
    vi.mocked(multicallHooks.usePoolManagerStatic).mockReturnValue({
      data: { maxSupplyCapD18: BigInt(toD18String(100)) },
    } as ReturnType<typeof multicallHooks.usePoolManagerStatic>)
    vi.mocked(multicallHooks.usePoolDynamic).mockReturnValue({
      data: { totalSupplyD18: toD18String(50) },
    } as ReturnType<typeof multicallHooks.usePoolDynamic>)
    vi.mocked(usePoolTokenPrice).mockReturnValue('0.5')
    vi.mocked(useAvailableManagerFee).mockReturnValue({
      data: 0,
    } as ReturnType<typeof useAvailableManagerFee>)

    const { result } = renderHook(() => useVaultSupplyCap(defaultParams))

    expect(result.current).toEqual({
      totalSupplyNumber: 50,
      maxSupplyCapNumber: 100,
      remainingSupplyCapNumber: 50,
      remainingSupplyCapInUsd: 25,
    })
  })
})
