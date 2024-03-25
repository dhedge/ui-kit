import { act } from '@testing-library/react'

import { optimism } from 'core-kit/const'
import * as poolHooks from 'core-kit/hooks/pool'
import { usePoolStatic } from 'core-kit/hooks/pool/multicall'
import * as stateHooks from 'core-kit/hooks/state'
import { useIsPoolManagerAccount } from 'core-kit/hooks/user'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useDepositMethodHandler } from './use-deposit-method-handler'

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelDepositMethod: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
}))

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolStatic: vi.fn(),
}))

vi.mock('core-kit/hooks/user', () => ({
  useIsPoolManagerAccount: vi.fn(),
}))

vi.mock('core-kit/hooks/pool', () => ({
  usePoolDynamicContractData: vi.fn(),
}))

describe('useDepositMethodHandler', () => {
  beforeEach(() => {
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({
          address: TEST_ADDRESS,
          chainId: optimism.id,
        }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )

    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          entryFee: '10',
        }) as ReturnType<typeof poolHooks.usePoolDynamicContractData>,
    )
  })

  it('should return deposit method, deposit method updater and hasDepositOptions flag when vault is allowed and manager is not vault account', () => {
    const setDepositMethodMock = vi.fn()
    const isPoolManagerAccount = false
    const isEasySwapperAllowedPool = true
    const method = 'deposit'
    const entryFee = ''
    vi.mocked(stateHooks.useTradingPanelDepositMethod).mockImplementation(
      () => [method, setDepositMethodMock],
    )
    vi.mocked(useIsPoolManagerAccount).mockImplementation(
      () => isPoolManagerAccount,
    )
    vi.mocked(usePoolStatic).mockImplementationOnce(
      () =>
        ({
          data: { easySwapperAllowedPools: isEasySwapperAllowedPool },
        }) as ReturnType<typeof usePoolStatic>,
    )
    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          entryFee,
        }) as ReturnType<typeof poolHooks.usePoolDynamicContractData>,
    )

    const { result } = renderHook(() => useDepositMethodHandler())
    expect(result.current[0]).toBe(method)
    expect(result.current[1]).toBeInstanceOf(Function)
    expect(result.current[2]).toBe(true)

    act(() => result.current[1]('depositWithCustomCooldown'))

    expect(setDepositMethodMock).toHaveBeenCalledTimes(1)
    expect(setDepositMethodMock).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      method: 'depositWithCustomCooldown',
    })
  })

  it('should return hasDepositOptions flag as false when vault is not allowed', () => {
    const isPoolManagerAccount = false
    const isEasySwapperAllowedPool = false
    const method = 'depositWithCustomCooldown'
    const setDepositMethodMock = vi.fn()
    vi.mocked(stateHooks.useTradingPanelDepositMethod).mockImplementation(
      () => [method, setDepositMethodMock],
    )
    vi.mocked(useIsPoolManagerAccount).mockImplementation(
      () => isPoolManagerAccount,
    )
    vi.mocked(usePoolStatic).mockImplementationOnce(
      () =>
        ({
          data: { easySwapperAllowedPools: isEasySwapperAllowedPool },
        }) as ReturnType<typeof usePoolStatic>,
    )

    const { result } = renderHook(() => useDepositMethodHandler())
    expect(result.current[0]).toBe(method)
    expect(result.current[2]).toBe(false)
  })

  it('should return hasDepositOptions flag as false when vault is allowed but manager is vault account', () => {
    const isPoolManagerAccount = true
    const isEasySwapperAllowedPool = true
    const method = 'depositWithCustomCooldown'
    const setDepositMethodMock = vi.fn()
    vi.mocked(stateHooks.useTradingPanelDepositMethod).mockImplementation(
      () => [method, setDepositMethodMock],
    )
    vi.mocked(useIsPoolManagerAccount).mockImplementation(
      () => isPoolManagerAccount,
    )
    vi.mocked(usePoolStatic).mockImplementationOnce(
      () =>
        ({
          data: { easySwapperAllowedPools: isEasySwapperAllowedPool },
        }) as ReturnType<typeof usePoolStatic>,
    )

    const { result } = renderHook(() => useDepositMethodHandler())
    expect(result.current[2]).toBe(false)
  })

  it('should return falsy hasDepositOptions flag when entry fee is defined', () => {
    const setDepositMethodMock = vi.fn()
    const isPoolManagerAccount = false
    const isEasySwapperAllowedPool = true
    const method = 'deposit'
    const entryFee = '1'

    expect(isPoolManagerAccount).toBe(false)
    expect(isEasySwapperAllowedPool).toBe(true)
    expect(+entryFee).toBeGreaterThan(0)

    vi.mocked(stateHooks.useTradingPanelDepositMethod).mockImplementation(
      () => [method, setDepositMethodMock],
    )
    vi.mocked(useIsPoolManagerAccount).mockImplementation(
      () => isPoolManagerAccount,
    )
    vi.mocked(usePoolStatic).mockImplementationOnce(
      () =>
        ({
          data: { easySwapperAllowedPools: isEasySwapperAllowedPool },
        }) as ReturnType<typeof usePoolStatic>,
    )
    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({ entryFee }) as ReturnType<
          typeof poolHooks.usePoolDynamicContractData
        >,
    )

    const { result } = renderHook(() => useDepositMethodHandler())
    expect(result.current[2]).toBe(false)
  })

  it('should return truthy hasDepositOptions flag when entry fee is not defined', () => {
    const setDepositMethodMock = vi.fn()
    const isPoolManagerAccount = false
    const isEasySwapperAllowedPool = true
    const method = 'deposit'
    const entryFee = ''

    expect(isPoolManagerAccount).toBe(false)
    expect(isEasySwapperAllowedPool).toBe(true)
    expect(+entryFee).not.toBeGreaterThan(0)

    vi.mocked(stateHooks.useTradingPanelDepositMethod).mockImplementation(
      () => [method, setDepositMethodMock],
    )
    vi.mocked(useIsPoolManagerAccount).mockImplementation(
      () => isPoolManagerAccount,
    )
    vi.mocked(usePoolStatic).mockImplementationOnce(
      () =>
        ({
          data: { easySwapperAllowedPools: isEasySwapperAllowedPool },
        }) as ReturnType<typeof usePoolStatic>,
    )
    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({ entryFee }) as ReturnType<
          typeof poolHooks.usePoolDynamicContractData
        >,
    )

    const { result } = renderHook(() => useDepositMethodHandler())
    expect(result.current[2]).toBe(true)
  })
})
