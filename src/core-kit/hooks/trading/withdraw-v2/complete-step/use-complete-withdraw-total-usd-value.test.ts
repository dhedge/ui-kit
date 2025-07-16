import { useCompleteWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw-v2/complete-step'

import { useCompleteWithdrawTotalUsdValue } from 'core-kit/hooks/trading/withdraw-v2/complete-step/use-complete-withdraw-total-usd-value'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/trading/withdraw-v2/complete-step', () => ({
  useCompleteWithdrawTrackedAssets: vi.fn(),
}))

describe('useCompleteWithdrawTotalUsdValue', () => {
  it('should return 0 when there are no assets', () => {
    vi.mocked(useCompleteWithdrawTrackedAssets).mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useCompleteWithdrawTrackedAssets>)

    const { result } = renderHook(() => useCompleteWithdrawTotalUsdValue())

    expect(result.current).toBe(0)
  })

  it('should calculate the total USD value of assets correctly', () => {
    vi.mocked(useCompleteWithdrawTrackedAssets).mockReturnValue({
      data: [
        { balance: 2, price: 100 },
        { balance: 3, price: 200 },
      ],
    } as unknown as ReturnType<typeof useCompleteWithdrawTrackedAssets>)

    const { result } = renderHook(() => useCompleteWithdrawTotalUsdValue())

    expect(result.current).toBe(800)
  })
})
