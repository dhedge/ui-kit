import { useReceiveTokenInput } from 'core-kit/hooks/state'
import {
  useCompleteWithdrawSwapData,
  useCompleteWithdrawTrackedAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { formatUnits, isEqualAddress } from 'core-kit/utils'

import { renderHook } from 'tests/test-utils'

import { useCompleteWithdrawQuote } from './use-complete-withdraw-quote'

vi.mock('core-kit/hooks/state')
vi.mock('core-kit/hooks/trading/withdraw-v2/complete-step')
vi.mock('core-kit/utils')

const updateReceiveTokenMock = vi.fn()

describe('useCompleteWithdrawQuote', () => {
  beforeEach(() => {
    vi.mocked(useReceiveTokenInput).mockReturnValue([
      { address: '0xToken', decimals: 18 },
      updateReceiveTokenMock,
    ] as unknown as ReturnType<typeof useReceiveTokenInput>)
    vi.mocked(useCompleteWithdrawTrackedAssets).mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useCompleteWithdrawTrackedAssets>)
    vi.mocked(useCompleteWithdrawSwapData).mockReturnValue({
      data: {},
      isFetching: false,
      isError: false,
    } as unknown as ReturnType<typeof useCompleteWithdrawSwapData>)
    vi.mocked(formatUnits).mockImplementation((value) => value.toString())
    vi.mocked(isEqualAddress).mockImplementation((a, b) => a === b)
  })

  it('should update receive token loading state', () => {
    renderHook(() => useCompleteWithdrawQuote())

    expect(updateReceiveTokenMock).toHaveBeenCalledWith({ isLoading: false })
  })

  it('should calculate total received amount correctly', () => {
    vi.mocked(useCompleteWithdrawTrackedAssets).mockReturnValue({
      data: [
        { address: '0xToken', rawBalance: BigInt(1000) },
        { address: '0xOtherToken', rawBalance: BigInt(2000) },
      ],
    } as unknown as ReturnType<typeof useCompleteWithdrawTrackedAssets>)
    vi.mocked(useCompleteWithdrawSwapData).mockReturnValue({
      data: {
        '0xOtherToken': { destinationAmount: '3000' },
      },
      isFetching: false,
      isError: false,
    } as unknown as ReturnType<typeof useCompleteWithdrawSwapData>)

    renderHook(() => useCompleteWithdrawQuote())

    expect(updateReceiveTokenMock).toHaveBeenCalledWith({
      value: '4000',
    })
  })

  it('should handle empty assets array', () => {
    renderHook(() => useCompleteWithdrawQuote())

    expect(updateReceiveTokenMock).not.toHaveBeenCalledWith()
  })

  it('should handle fetching state', () => {
    vi.mocked(useCompleteWithdrawSwapData).mockReturnValue({
      data: {},
      isFetching: true,
      isError: false,
    } as ReturnType<typeof useCompleteWithdrawSwapData>)

    renderHook(() => useCompleteWithdrawQuote())

    expect(updateReceiveTokenMock).toHaveBeenCalledWith({ isLoading: true })
  })

  it('should handle error state', () => {
    vi.mocked(useCompleteWithdrawSwapData).mockReturnValue({
      data: {},
      isFetching: false,
      isError: true,
    } as ReturnType<typeof useCompleteWithdrawSwapData>)

    renderHook(() => useCompleteWithdrawQuote())

    expect(updateReceiveTokenMock).not.toHaveBeenCalledWith({
      value: expect.anything(),
    })
  })
})
