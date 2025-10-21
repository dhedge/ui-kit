import { optimism } from 'core-kit/const'
import * as poolHooks from 'core-kit/hooks/pool'
import * as stateHooks from 'core-kit/hooks/state'
import { useIsMaxSupplyCapReached } from 'core-kit/hooks/trading/deposit-v2/use-is-max-supply-cap-reached'
import { formatToUsd } from 'core-kit/utils'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolConfig: vi.fn(),
  useReceiveTokenInput: vi.fn(),
}))

vi.mock('core-kit/hooks/pool', () => ({
  useVaultSupply: vi.fn(),
  useVaultSupplyCap: vi.fn(),
}))

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
    vi.mocked(poolHooks.useVaultSupplyCap).mockReturnValue(null)
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
    // total = 1, deposit = 0.5, effective cap = 1.6
    vi.mocked(poolHooks.useVaultSupplyCap).mockReturnValue({
      totalSupplyNumber: 1,
      maxSupplyCapNumber: 1.6,
      remainingSupplyCapNumber: 0.6,
      remainingSupplyCapInUsd: 0.6,
    })
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
    // remaining tokens = 0.5; price = $2000 → $1,000
    vi.mocked(poolHooks.useVaultSupplyCap).mockReturnValue({
      totalSupplyNumber: 1,
      maxSupplyCapNumber: 1.5,
      remainingSupplyCapNumber: 0.5,
      remainingSupplyCapInUsd: 1000,
    })
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(
      () =>
        [{ value: '0' }, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useReceiveTokenInput
        >,
    )

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
    // remaining tokens = 0, already at cap → $0
    vi.mocked(poolHooks.useVaultSupplyCap).mockReturnValue({
      totalSupplyNumber: 1.2,
      maxSupplyCapNumber: 1,
      remainingSupplyCapNumber: 0,
      remainingSupplyCapInUsd: 0,
    })
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(
      () =>
        [{ value: '0' }, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useReceiveTokenInput
        >,
    )

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
    // total = 1, deposit = 0.7, effective cap = 1.6 → 1.7 > 1.6
    vi.mocked(poolHooks.useVaultSupplyCap).mockReturnValue({
      totalSupplyNumber: 1,
      maxSupplyCapNumber: 1.6,
      remainingSupplyCapNumber: 0.6,
      remainingSupplyCapInUsd: 0.6,
    })
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(
      () =>
        [{ value: '0.7' }, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useReceiveTokenInput
        >,
    )

    const { result } = renderHook(() => useIsMaxSupplyCapReached())
    expect(result.current.isMaxSupplyCapReached).toBe(true)
  })
})
