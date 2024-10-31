import { act } from '@testing-library/react'

import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useIsCustomCooldownDeposit } from './use-is-custom-cooldown-deposit'
import { usePoolFees } from '../../pool'
import { usePoolStatic } from '../../pool/multicall'

vi.mock('core-kit/hooks/pool', () => ({
  usePoolFees: vi.fn(),
}))
vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolStatic: vi.fn(),
}))
vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolConfig: vi.fn(),
}))

describe('useIsCustomCooldownDeposit', () => {
  beforeEach(() => {
    vi.mocked(useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({ chainId: 1, address: TEST_ADDRESS }) as ReturnType<
          typeof useTradingPanelPoolConfig
        >,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return false when entry fee is 0 or custom cooldown deposit is not allowed', () => {
    vi.mocked(usePoolStatic).mockReturnValueOnce({
      data: { isCustomCooldownDepositAllowed: false },
    } as ReturnType<typeof usePoolStatic>)
    vi.mocked(usePoolFees).mockReturnValueOnce({
      entryFeeNumber: 0,
    } as ReturnType<typeof usePoolFees>)

    const { result, rerender } = renderHook(() => useIsCustomCooldownDeposit())

    expect(result.current).toBe(false)

    vi.mocked(usePoolStatic).mockReturnValueOnce({
      data: { isCustomCooldownDepositAllowed: true },
    } as ReturnType<typeof usePoolStatic>)
    vi.mocked(usePoolFees).mockReturnValueOnce({
      entryFeeNumber: 0,
    } as ReturnType<typeof usePoolFees>)

    act(() => {
      rerender()
    })
    expect(result.current).toBe(false)

    vi.mocked(usePoolStatic).mockReturnValueOnce({
      data: { isCustomCooldownDepositAllowed: false },
    } as ReturnType<typeof usePoolStatic>)
    vi.mocked(usePoolFees).mockReturnValueOnce({
      entryFeeNumber: 0.1,
    } as ReturnType<typeof usePoolFees>)

    act(() => {
      rerender()
    })
    expect(result.current).toBe(false)
  })

  it('should return true when entry fee is greater than 0 and custom cooldown deposit is allowed', () => {
    vi.mocked(usePoolStatic).mockReturnValueOnce({
      data: { isCustomCooldownDepositAllowed: true },
    } as ReturnType<typeof usePoolStatic>)
    vi.mocked(usePoolFees).mockReturnValueOnce({
      entryFeeNumber: 0.11,
    } as ReturnType<typeof usePoolFees>)

    const { result } = renderHook(() => useIsCustomCooldownDeposit())

    expect(result.current).toBe(true)
  })

  it('should return true when useCustomCooldownDeposit was set to true in vault config', () => {
    vi.mocked(usePoolStatic).mockReturnValueOnce({
      data: { isCustomCooldownDepositAllowed: false },
    } as ReturnType<typeof usePoolStatic>)
    vi.mocked(usePoolFees).mockReturnValueOnce({
      entryFeeNumber: 0,
    } as ReturnType<typeof usePoolFees>)
    vi.mocked(useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({
          chainId: 10,
          address: TEST_ADDRESS,
          isCustomCooldownDeposit: true,
        }) as ReturnType<typeof useTradingPanelPoolConfig>,
    )

    const { result } = renderHook(() => useIsCustomCooldownDeposit())

    expect(result.current).toBe(true)
  })
})
