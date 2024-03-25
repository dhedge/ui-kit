import { optimism } from 'core-kit/const'
import { usePoolStatic } from 'core-kit/hooks/pool/multicall'
import * as stateHooks from 'core-kit/hooks/state'
import * as userHooks from 'core-kit/hooks/user'

import { getPercent } from 'core-kit/utils'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useHandlePoolSwapInfo } from './use-handle-pool-swap-info'

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelDepositMethod: vi.fn(),
  useTradingPanelEntryFee: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
}))

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolStatic: vi.fn(),
}))

vi.mock('core-kit/hooks/user', () => ({
  useIsPoolManagerAccount: vi.fn(),
}))

describe('useHandlePoolSwapInfo', () => {
  it('should set deposit method as depositWithCustomCooldown', () => {
    const address = TEST_ADDRESS
    const isPoolManagerAccount = true
    const isPoolSwapAllowed = true
    const setDepositMethodMock = vi.fn()

    expect(isPoolManagerAccount && isPoolSwapAllowed).toEqual(true)

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue({
      address,
      chainId: optimism.id,
    } as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>)
    vi.mocked(usePoolStatic).mockImplementationOnce(
      () =>
        ({
          data: {
            easySwapperAllowedPools: isPoolSwapAllowed,
            easySwapperFeeDenominator: BigInt(2),
            easySwapperFeeNumerator: BigInt(1),
          },
        }) as ReturnType<typeof usePoolStatic>,
    )
    vi.mocked(userHooks.useIsPoolManagerAccount).mockReturnValue(
      isPoolManagerAccount,
    )
    vi.mocked(stateHooks.useTradingPanelDepositMethod).mockReturnValue([
      'deposit',
      setDepositMethodMock,
    ])
    vi.mocked(stateHooks.useTradingPanelEntryFee).mockReturnValue([0, vi.fn()])

    renderHook(() => useHandlePoolSwapInfo())

    expect(setDepositMethodMock).toHaveBeenCalledTimes(1)
    expect(setDepositMethodMock).toHaveBeenCalledWith({
      address,
      method: 'depositWithCustomCooldown',
    })
  })

  it('should skip setting of deposit method as depositWithCustomCooldown', () => {
    const address = TEST_ADDRESS
    const isPoolManagerAccount = false
    const isPoolSwapAllowed = true
    const setDepositMethodMock = vi.fn()

    expect(isPoolManagerAccount && isPoolSwapAllowed).toEqual(false)

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue({
      address,
      chainId: optimism.id,
    } as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>)
    vi.mocked(usePoolStatic).mockImplementationOnce(
      () =>
        ({
          data: {
            easySwapperAllowedPools: isPoolSwapAllowed,
            easySwapperFeeDenominator: BigInt(2),
            easySwapperFeeNumerator: BigInt(1),
          },
        }) as ReturnType<typeof usePoolStatic>,
    )
    vi.mocked(userHooks.useIsPoolManagerAccount).mockReturnValue(
      isPoolManagerAccount,
    )
    vi.mocked(stateHooks.useTradingPanelDepositMethod).mockReturnValue([
      'deposit',
      setDepositMethodMock,
    ])
    vi.mocked(stateHooks.useTradingPanelEntryFee).mockReturnValue([0, vi.fn()])

    renderHook(() => useHandlePoolSwapInfo())

    expect(setDepositMethodMock).toHaveBeenCalledTimes(0)
  })

  it('should update entry fee', () => {
    const address = TEST_ADDRESS
    const isPoolManagerAccount = true
    const isPoolSwapAllowed = true
    const feeNumerator = BigInt(1)
    const feeDenominator = BigInt(2)
    const depositMethod = 'depositWithCustomCooldown'
    const updateEntryFeeMock = vi.fn()

    expect(depositMethod).toEqual('depositWithCustomCooldown')

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue({
      address,
      chainId: optimism.id,
    } as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>)
    vi.mocked(usePoolStatic).mockImplementationOnce(
      () =>
        ({
          data: {
            easySwapperAllowedPools: isPoolSwapAllowed,
            easySwapperFeeDenominator: feeDenominator,
            easySwapperFeeNumerator: feeNumerator,
          },
        }) as ReturnType<typeof usePoolStatic>,
    )
    vi.mocked(userHooks.useIsPoolManagerAccount).mockReturnValue(
      isPoolManagerAccount,
    )
    vi.mocked(stateHooks.useTradingPanelDepositMethod).mockReturnValue([
      depositMethod,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelEntryFee).mockReturnValue([
      0,
      updateEntryFeeMock,
    ])

    renderHook(() => useHandlePoolSwapInfo())

    expect(updateEntryFeeMock).toHaveBeenCalledTimes(1)
    expect(updateEntryFeeMock).toHaveBeenCalledWith({
      depositWithCustomCooldown: getPercent(
        Number(feeNumerator),
        Number(feeDenominator),
      ),
    })
  })

  it('should skip updating entry fee', () => {
    const address = TEST_ADDRESS
    const isPoolManagerAccount = true
    const isPoolSwapAllowed = true
    const feeNumerator = BigInt(1)
    const feeDenominator = BigInt(2)
    const depositMethod = 'deposit'
    const updateEntryFeeMock = vi.fn()

    expect(depositMethod).toEqual('deposit')

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue({
      address,
      chainId: optimism.id,
    } as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>)
    vi.mocked(usePoolStatic).mockImplementationOnce(
      () =>
        ({
          data: {
            easySwapperAllowedPools: isPoolSwapAllowed,
            easySwapperFeeDenominator: feeDenominator,
            easySwapperFeeNumerator: feeNumerator,
          },
        }) as ReturnType<typeof usePoolStatic>,
    )
    vi.mocked(userHooks.useIsPoolManagerAccount).mockReturnValue(
      isPoolManagerAccount,
    )
    vi.mocked(stateHooks.useTradingPanelDepositMethod).mockReturnValue([
      depositMethod,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelEntryFee).mockReturnValue([
      0,
      updateEntryFeeMock,
    ])

    renderHook(() => useHandlePoolSwapInfo())

    expect(updateEntryFeeMock).toHaveBeenCalledTimes(0)
  })
})
