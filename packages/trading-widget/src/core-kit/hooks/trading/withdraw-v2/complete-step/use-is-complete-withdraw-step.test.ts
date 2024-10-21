import { useCompleteWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw-v2/complete-step/use-complete-withdraw-tracked-assets'

import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useIsCompleteWithdrawStep } from './use-is-complete-withdraw-step'

vi.mock(
  'core-kit/hooks/trading/withdraw-v2/complete-step/use-complete-withdraw-tracked-assets',
)

describe('useIsCompleteWithdrawStep', () => {
  it('should return isCompleteWithdrawStep as true when assets are present', () => {
    vi.mocked(useCompleteWithdrawTrackedAssets).mockReturnValue({
      data: [{ address: TEST_ADDRESS }],
      isFetching: false,
    } as unknown as ReturnType<typeof useCompleteWithdrawTrackedAssets>)

    const { result } = renderHook(() => useIsCompleteWithdrawStep())

    expect(result.current.isCompleteWithdrawStep).toBe(true)
    expect(result.current.isFetching).toBe(false)
  })

  it('should return isCompleteWithdrawStep as false when no assets are present', () => {
    vi.mocked(useCompleteWithdrawTrackedAssets).mockReturnValue({
      data: [],
      isFetching: false,
    } as unknown as ReturnType<typeof useCompleteWithdrawTrackedAssets>)

    const { result } = renderHook(() => useIsCompleteWithdrawStep())

    expect(result.current.isCompleteWithdrawStep).toBe(false)
    expect(result.current.isFetching).toBe(false)
  })

  it('should return isFetching as true when assets are being fetched', () => {
    vi.mocked(useCompleteWithdrawTrackedAssets).mockReturnValue({
      data: [],
      isFetching: true,
    } as unknown as ReturnType<typeof useCompleteWithdrawTrackedAssets>)

    const { result } = renderHook(() => useIsCompleteWithdrawStep())

    expect(result.current.isCompleteWithdrawStep).toBe(false)
    expect(result.current.isFetching).toBe(true)
  })
})
