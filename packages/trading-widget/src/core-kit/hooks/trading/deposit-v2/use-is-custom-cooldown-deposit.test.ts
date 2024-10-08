import { act } from '@testing-library/react'

import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useIsCustomCooldownDeposit } from './use-is-custom-cooldown-deposit'
import { usePoolDynamicContractData } from '../../pool'
import { usePoolStatic } from '../../pool/multicall'

vi.mock('core-kit/hooks/pool', () => ({
  usePoolDynamicContractData: vi.fn(),
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
    vi.mocked(usePoolDynamicContractData).mockReturnValueOnce({
      entryFee: '0',
    } as ReturnType<typeof usePoolDynamicContractData>)

    const { result, rerender } = renderHook(() => useIsCustomCooldownDeposit())

    expect(result.current).toBe(false)

    vi.mocked(usePoolStatic).mockReturnValueOnce({
      data: { isCustomCooldownDepositAllowed: true },
    } as ReturnType<typeof usePoolStatic>)
    vi.mocked(usePoolDynamicContractData).mockReturnValueOnce({
      entryFee: '0',
    } as ReturnType<typeof usePoolDynamicContractData>)

    act(() => {
      rerender()
    })
    expect(result.current).toBe(false)

    vi.mocked(usePoolStatic).mockReturnValueOnce({
      data: { isCustomCooldownDepositAllowed: false },
    } as ReturnType<typeof usePoolStatic>)
    vi.mocked(usePoolDynamicContractData).mockReturnValueOnce({
      entryFee: '100',
    } as ReturnType<typeof usePoolDynamicContractData>)

    act(() => {
      rerender()
    })
    expect(result.current).toBe(false)
  })

  it('should return true when entry fee is greater than 0 and custom cooldown deposit is allowed', () => {
    vi.mocked(usePoolStatic).mockReturnValueOnce({
      data: { isCustomCooldownDepositAllowed: true },
    } as ReturnType<typeof usePoolStatic>)
    vi.mocked(usePoolDynamicContractData).mockReturnValueOnce({
      entryFee: '100',
    } as ReturnType<typeof usePoolDynamicContractData>)

    const { result } = renderHook(() => useIsCustomCooldownDeposit())

    expect(result.current).toBe(true)
  })
})
