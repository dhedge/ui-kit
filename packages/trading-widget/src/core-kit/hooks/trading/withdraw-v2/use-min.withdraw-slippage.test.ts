import { DEFAULT_SWAP_TRANSACTION_SLIPPAGE } from 'core-kit/const'
import {
  useIsDepositTradingPanelType,
  useReceiveTokenInput,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import {
  useCompleteWithdrawReceiveDiff,
  useIsCompleteWithdrawStep,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { renderHook } from 'tests/test-utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

import { useMinWithdrawSlippage } from './use-min-withdraw-slippage'

vi.mock('trading-widget/providers/config-provider')
vi.mock('core-kit/hooks/state')
vi.mock('core-kit/hooks/trading/withdraw-v2/complete-step')

describe('useMinWithdrawSlippage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not update minSlippage when isWithdraw is false', () => {
    vi.mocked(useConfigContextParams).mockReturnValue({
      defaultWithdrawSlippage: 0.5,
      defaultSwapTransactionSlippage: 0.2,
    } as ReturnType<typeof useConfigContextParams>)

    vi.mocked(useIsDepositTradingPanelType).mockReturnValue(true)
    vi.mocked(useReceiveTokenInput).mockReturnValue([
      { isLoading: false },
    ] as unknown as ReturnType<typeof useReceiveTokenInput>)
    vi.mocked(useIsCompleteWithdrawStep).mockReturnValue({
      isCompleteWithdrawStep: false,
      isFetching: false,
    })
    const updateSettings = vi.fn()
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      {},
      updateSettings,
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useCompleteWithdrawReceiveDiff).mockReturnValue(0)

    renderHook(() => useMinWithdrawSlippage())

    expect(updateSettings).not.toHaveBeenCalled()
  })

  it('sets minSlippage to calculated value when during complete withdraw step', () => {
    vi.mocked(useConfigContextParams).mockReturnValue({
      defaultWithdrawSlippage: 0.5,
      defaultSwapTransactionSlippage: DEFAULT_SWAP_TRANSACTION_SLIPPAGE,
    } as ReturnType<typeof useConfigContextParams>)

    vi.mocked(useIsDepositTradingPanelType).mockReturnValue(false)
    vi.mocked(useReceiveTokenInput).mockReturnValue([
      { isLoading: false },
    ] as unknown as ReturnType<typeof useReceiveTokenInput>)
    vi.mocked(useIsCompleteWithdrawStep).mockReturnValue({
      isCompleteWithdrawStep: true,
      isFetching: false,
    })
    const updateSettings = vi.fn()
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      {},
      updateSettings,
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useCompleteWithdrawReceiveDiff).mockReturnValue(-0.1)

    renderHook(() => useMinWithdrawSlippage())

    expect(updateSettings).toHaveBeenCalledWith({ minSlippage: 0.4 })
  })

  it('does not update minSlippage when receivedToken is loading', () => {
    vi.mocked(useConfigContextParams).mockReturnValue({
      defaultWithdrawSlippage: 0.5,
      defaultSwapTransactionSlippage: 0.2,
    } as ReturnType<typeof useConfigContextParams>)

    vi.mocked(useIsDepositTradingPanelType).mockReturnValue(false)
    vi.mocked(useReceiveTokenInput).mockReturnValue([
      { isLoading: true },
    ] as unknown as ReturnType<typeof useReceiveTokenInput>)
    vi.mocked(useIsCompleteWithdrawStep).mockReturnValue({
      isCompleteWithdrawStep: false,
      isFetching: false,
    })
    const updateSettings = vi.fn()
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      {},
      updateSettings,
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useCompleteWithdrawReceiveDiff).mockReturnValue(0)

    renderHook(() => useMinWithdrawSlippage())

    expect(updateSettings).not.toHaveBeenCalled()
  })

  it('does not update minSlippage when isWithdrawStepFetching is true', () => {
    vi.mocked(useConfigContextParams).mockReturnValue({
      defaultWithdrawSlippage: 0.5,
      defaultSwapTransactionSlippage: 0.2,
    } as ReturnType<typeof useConfigContextParams>)

    vi.mocked(useIsDepositTradingPanelType).mockReturnValue(false)
    vi.mocked(useReceiveTokenInput).mockReturnValue([
      { isLoading: false },
    ] as unknown as ReturnType<typeof useReceiveTokenInput>)
    vi.mocked(useIsCompleteWithdrawStep).mockReturnValue({
      isCompleteWithdrawStep: false,
      isFetching: true,
    })
    const updateSettings = vi.fn()
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      {},
      updateSettings,
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useCompleteWithdrawReceiveDiff).mockReturnValue(0)

    renderHook(() => useMinWithdrawSlippage())

    expect(updateSettings).not.toHaveBeenCalled()
  })

  it('sets minSlippage to defaultWithdrawSlippage when swapDiff is positive', () => {
    vi.mocked(useConfigContextParams).mockReturnValue({
      defaultWithdrawSlippage: 0.5,
      defaultSwapTransactionSlippage: 0.2,
    } as ReturnType<typeof useConfigContextParams>)

    vi.mocked(useIsDepositTradingPanelType).mockReturnValue(false)
    vi.mocked(useReceiveTokenInput).mockReturnValue([
      { isLoading: false },
    ] as unknown as ReturnType<typeof useReceiveTokenInput>)
    vi.mocked(useIsCompleteWithdrawStep).mockReturnValue({
      isCompleteWithdrawStep: true,
      isFetching: false,
    })
    const updateSettings = vi.fn()
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      {},
      updateSettings,
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useCompleteWithdrawReceiveDiff).mockReturnValue(0.1)

    renderHook(() => useMinWithdrawSlippage())

    expect(updateSettings).toHaveBeenCalledWith({ minSlippage: 0.2 })
  })
})
