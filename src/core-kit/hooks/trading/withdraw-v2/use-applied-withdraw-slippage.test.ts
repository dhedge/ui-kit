import { useTradingPanelSettings } from 'core-kit/hooks/state'
import { useIsCompleteWithdrawStep } from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage'
import { renderHook } from 'tests/test-utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

vi.mock('core-kit/hooks/state')
vi.mock('core-kit/hooks/trading/withdraw-v2/complete-step')
vi.mock('trading-widget/providers/config-provider')

describe('useAppliedWithdrawSlippage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns defaultWithdrawSlippage when slippage is not auto and step is not complete', () => {
    vi.mocked(useConfigContextParams).mockReturnValue({
      defaultWithdrawSlippage: 0.5,
    } as ReturnType<typeof useConfigContextParams>)

    vi.mocked(useIsCompleteWithdrawStep).mockReturnValue({
      isCompleteWithdrawStep: false,
      isFetching: false,
    })
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      { slippage: 0.3, minSlippage: 0.1 },
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)

    const { result } = renderHook(() => useAppliedWithdrawSlippage())

    expect(result.current).toBe(0.3)
  })

  it('returns minSlippage when slippage is auto and step is complete', () => {
    vi.mocked(useConfigContextParams).mockReturnValue({
      defaultWithdrawSlippage: 0.5,
    } as ReturnType<typeof useConfigContextParams>)

    vi.mocked(useIsCompleteWithdrawStep).mockReturnValue({
      isCompleteWithdrawStep: true,
      isFetching: false,
    })

    vi.mocked(useTradingPanelSettings).mockReturnValue([
      { slippage: 'auto', minSlippage: 0.1 },
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)

    const { result } = renderHook(() => useAppliedWithdrawSlippage())

    expect(result.current).toBe(0.1)
  })

  it('returns defaultWithdrawSlippage when slippage is auto and minSlippage is undefined', () => {
    vi.mocked(useConfigContextParams).mockReturnValue({
      defaultWithdrawSlippage: 0.5,
    } as ReturnType<typeof useConfigContextParams>)

    vi.mocked(useIsCompleteWithdrawStep).mockReturnValue({
      isCompleteWithdrawStep: true,
      isFetching: false,
    })

    vi.mocked(useTradingPanelSettings).mockReturnValue([
      { slippage: 'auto', minSlippage: undefined },
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)

    const { result } = renderHook(() => useAppliedWithdrawSlippage())

    expect(result.current).toBe(0.5)
  })
})
