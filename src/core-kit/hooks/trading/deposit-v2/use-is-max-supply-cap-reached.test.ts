import { DEFAULT_PRECISION, optimism } from 'core-kit/const'
import * as multicallHooks from 'core-kit/hooks/pool/multicall'
import * as stateHooks from 'core-kit/hooks/state'
import { useIsMaxSupplyCapReached } from 'core-kit/hooks/trading/deposit-v2/use-is-max-supply-cap-reached'
import { shiftBy } from 'core-kit/utils'
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
    expect(result.current).toBe(false)
  })

  it('returns false when expected total supply is below cap', () => {
    // total = 1, deposit = 0.5, cap = 1.6
    vi.mocked(multicallHooks.usePoolManagerStatic).mockImplementation(
      () =>
        ({ data: { maxSupplyCapD18: BigInt(toD18String(1.6)) } }) as ReturnType<
          typeof multicallHooks.usePoolManagerStatic
        >,
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
    expect(result.current).toBe(false)
  })

  it('returns false when expected total supply equals cap', () => {
    // total = 1, deposit = 0.6, cap = 1.6
    vi.mocked(multicallHooks.usePoolManagerStatic).mockImplementation(
      () =>
        ({ data: { maxSupplyCapD18: BigInt(toD18String(1.6)) } }) as ReturnType<
          typeof multicallHooks.usePoolManagerStatic
        >,
    )
    vi.mocked(multicallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({ data: { totalSupplyD18: toD18String(1) } }) as ReturnType<
          typeof multicallHooks.usePoolDynamic
        >,
    )
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(
      () =>
        [{ value: '0.6' }, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useReceiveTokenInput
        >,
    )

    const { result } = renderHook(() => useIsMaxSupplyCapReached())
    expect(result.current).toBe(false)
  })
})
