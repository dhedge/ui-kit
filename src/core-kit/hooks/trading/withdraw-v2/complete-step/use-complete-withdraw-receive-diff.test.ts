import { useReceiveTokenInput } from 'core-kit/hooks/state'
import { useCompleteWithdrawExpectedAmount } from 'core-kit/hooks/trading/withdraw-v2/complete-step/use-complete-withdraw-expected-amount'

import { useCompleteWithdrawReceiveDiff } from 'core-kit/hooks/trading/withdraw-v2/complete-step/use-complete-withdraw-receive-diff'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/state')
vi.mock(
  'core-kit/hooks/trading/withdraw-v2/complete-step/use-complete-withdraw-expected-amount',
)

describe('useCompleteWithdrawReceiveDiff', () => {
  beforeEach(() => {
    vi.mocked(useReceiveTokenInput).mockReturnValue([
      { value: '1950', decimals: 18 },
    ] as unknown as ReturnType<typeof useReceiveTokenInput>)
    vi.mocked(useCompleteWithdrawExpectedAmount).mockReturnValue({
      expectedReceiveAmount: '2000000000000000000000',
    } as unknown as ReturnType<typeof useCompleteWithdrawExpectedAmount>)
  })

  it('should return 0 if sendAmount is 0', () => {
    vi.mocked(useCompleteWithdrawExpectedAmount).mockReturnValue({
      expectedReceiveAmount: '0',
    } as unknown as ReturnType<typeof useCompleteWithdrawExpectedAmount>)

    const { result } = renderHook(() => useCompleteWithdrawReceiveDiff())

    expect(result.current).toBe(0)
  })

  it('should return 0 if estimatedReceiveAmount is 0', () => {
    vi.mocked(useReceiveTokenInput).mockReturnValue([
      { value: '0', decimals: 18 },
    ] as unknown as ReturnType<typeof useReceiveTokenInput>)

    const { result } = renderHook(() => useCompleteWithdrawReceiveDiff())

    expect(result.current).toBe(0)
  })

  it('should calculate the receive difference correctly', () => {
    const { result } = renderHook(() => useCompleteWithdrawReceiveDiff())

    expect(result.current).toBe(-2.5)
  })
})
