import { DEFAULT_PRECISION, optimism } from 'core-kit/const'
import * as poolHooks from 'core-kit/hooks/pool'
import * as multicallHooks from 'core-kit/hooks/pool/multicall'
import * as stateHooks from 'core-kit/hooks/state'
import { useIsMaxSupplyCapReached } from 'core-kit/hooks/trading/deposit-v2/use-is-max-supply-cap-reached'
import { formatToUsd, shiftBy } from 'core-kit/utils'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolConfig: vi.fn(),
  useReceiveTokenInput: vi.fn(),
}))

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolManagerStatic: vi.fn(),
  usePoolDynamic: vi.fn(),
}))

vi.mock('core-kit/hooks/pool', () => ({
  usePoolTokenPrice: vi.fn(),
}))

const toD18String = (value: string | number) =>
  shiftBy(value, DEFAULT_PRECISION)

describe('useIsMaxSupplyCapReached', () => {
  beforeEach(() => {
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({ address: TEST_ADDRESS, chainId: optimism.id }) as ReturnType<
          typeof stateHooks.useTradingPanelPoolConfig
        >,
    )

    // default token price = $1
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValue('1')
  })

  it('returns false when maxSupplyCapD18 is zero', () => {
    vi.mocked(multicallHooks.usePoolManagerStatic).mockImplementation(
      () =>
        ({ data: { maxSupplyCapD18: 0n } }) as ReturnType<
          typeof multicallHooks.usePoolManagerStatic
        >,
    )
    vi.mocked(multicallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({ data: { totalSupplyD18: '0' } }) as ReturnType<
          typeof multicallHooks.usePoolDynamic
        >,
    )
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(
      () =>
        [{ value: '0' }, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useReceiveTokenInput
        >,
    )

    const { result } = renderHook(() => useIsMaxSupplyCapReached())
    expect(result.current.isMaxSupplyCapReached).toBe(false)
    expect(result.current.supplyCapInUsd).toBe('')
  })

  it('returns false when expected total supply is below cap', () => {
    // total = 1, deposit = 0.5, cap = 101.6 (effective 1.6)
    vi.mocked(multicallHooks.usePoolManagerStatic).mockImplementation(
      () =>
        ({
          data: { maxSupplyCapD18: BigInt(toD18String(101.6)) },
        }) as ReturnType<typeof multicallHooks.usePoolManagerStatic>,
    )
    vi.mocked(multicallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({ data: { totalSupplyD18: toD18String(1) } }) as ReturnType<
          typeof multicallHooks.usePoolDynamic
        >,
    )
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(
      () =>
        [{ value: '0.5' }, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useReceiveTokenInput
        >,
    )

    const { result } = renderHook(() => useIsMaxSupplyCapReached())
    expect(result.current.isMaxSupplyCapReached).toBe(false)
  })

  it('computes supplyCapInUsd based on remaining cap and token price', () => {
    // remaining tokens = (101.5 - 100) - 1.0 = 0.5; price = $2000 → $1,000
    vi.mocked(multicallHooks.usePoolManagerStatic).mockImplementation(
      () =>
        ({
          data: { maxSupplyCapD18: BigInt(toD18String(101.5)) },
        }) as ReturnType<typeof multicallHooks.usePoolManagerStatic>,
    )
    vi.mocked(multicallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({ data: { totalSupplyD18: toD18String(1) } }) as ReturnType<
          typeof multicallHooks.usePoolDynamic
        >,
    )
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(
      () =>
        [{ value: '0' }, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useReceiveTokenInput
        >,
    )
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValue('2000')

    const { result } = renderHook(() => useIsMaxSupplyCapReached())
    expect(result.current.isMaxSupplyCapReached).toBe(false)
    expect(result.current.supplyCapInUsd).toBe(
      formatToUsd({
        value: 1000,
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }),
    )
  })

  it('returns $0 when total supply already exceeds cap', () => {
    // remaining tokens = max(0, (101.0 - 100) - 1.2) = 0 → $0
    vi.mocked(multicallHooks.usePoolManagerStatic).mockImplementation(
      () =>
        ({ data: { maxSupplyCapD18: BigInt(toD18String(101)) } }) as ReturnType<
          typeof multicallHooks.usePoolManagerStatic
        >,
    )
    vi.mocked(multicallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({ data: { totalSupplyD18: toD18String(1.2) } }) as ReturnType<
          typeof multicallHooks.usePoolDynamic
        >,
    )
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(
      () =>
        [{ value: '0' }, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useReceiveTokenInput
        >,
    )
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValue('123.45')

    const { result } = renderHook(() => useIsMaxSupplyCapReached())
    expect(result.current.isMaxSupplyCapReached).toBe(true)
    expect(result.current.supplyCapInUsd).toBe(
      formatToUsd({
        value: 0,
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }),
    )
  })

  it('returns true when expected total supply exceeds cap', () => {
    // total = 1, deposit = 0.7, cap = 101.6 (effective 1.6) → 1.7 > 1.6
    vi.mocked(multicallHooks.usePoolManagerStatic).mockImplementation(
      () =>
        ({
          data: { maxSupplyCapD18: BigInt(toD18String(101.6)) },
        }) as ReturnType<typeof multicallHooks.usePoolManagerStatic>,
    )
    vi.mocked(multicallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({ data: { totalSupplyD18: toD18String(1) } }) as ReturnType<
          typeof multicallHooks.usePoolDynamic
        >,
    )
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(
      () =>
        [{ value: '0.7' }, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useReceiveTokenInput
        >,
    )
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValue('1')

    const { result } = renderHook(() => useIsMaxSupplyCapReached())
    expect(result.current.isMaxSupplyCapReached).toBe(true)
  })
})
