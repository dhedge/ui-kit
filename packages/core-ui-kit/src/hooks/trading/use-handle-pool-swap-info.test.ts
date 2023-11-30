import { optimism } from 'const'
import * as stateHooks from 'hooks/state'
import * as tradingHooks from 'hooks/trading'
import * as userHooks from 'hooks/user'
import { renderHook } from 'test-utils'

import { TEST_ADDRESS } from 'tests/mocks'

import { getPercent } from 'utils'

import { useHandlePoolSwapInfo } from './use-handle-pool-swap-info'

vi.mock('hooks/state', () => ({
  useTradingPanelDepositMethod: vi.fn(),
  useTradingPanelEntryFee: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
}))

vi.mock('./use-easy-swapper-stable-data', () => ({
  useEasySwapperStableData: vi.fn(),
}))

vi.mock('hooks/user', () => ({
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
    vi.mocked(tradingHooks.useEasySwapperStableData).mockReturnValue({
      isEasySwapperAllowedPool: isPoolSwapAllowed,
      feeNumerator: BigInt(1),
      feeDenominator: BigInt(2),
    })
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
    vi.mocked(tradingHooks.useEasySwapperStableData).mockReturnValue({
      isEasySwapperAllowedPool: isPoolSwapAllowed,
      feeNumerator: BigInt(1),
      feeDenominator: BigInt(2),
    })
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
    vi.mocked(tradingHooks.useEasySwapperStableData).mockReturnValue({
      isEasySwapperAllowedPool: isPoolSwapAllowed,
      feeNumerator,
      feeDenominator,
    })
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
    vi.mocked(tradingHooks.useEasySwapperStableData).mockReturnValue({
      isEasySwapperAllowedPool: isPoolSwapAllowed,
      feeNumerator,
      feeDenominator,
    })
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
