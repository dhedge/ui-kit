import { renderHook } from '@testing-library/react'

import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useRawAssetPrice } from 'core-kit/hooks/trading/use-raw-asset-price'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2'
import { useCompleteWithdrawTotalUsdValue } from 'core-kit/hooks/trading/withdraw-v2/complete-step'

import { useCompleteWithdrawExpectedAmount } from 'core-kit/hooks/trading/withdraw-v2/complete-step/use-complete-withdraw-expected-amount'

vi.mock('core-kit/hooks/state')
vi.mock('core-kit/hooks/trading/use-raw-asset-price')
vi.mock('core-kit/hooks/trading/withdraw-v2')
vi.mock('core-kit/hooks/trading/withdraw-v2/complete-step')

describe('useCompleteWithdrawExpectedAmount', () => {
  beforeEach(() => {
    vi.mocked(useReceiveTokenInput).mockReturnValue([
      { address: '0xToken', decimals: 3 },
    ] as unknown as ReturnType<typeof useReceiveTokenInput>)
    vi.mocked(useTradingPanelPoolConfig).mockReturnValue({
      chainId: 10,
    } as unknown as ReturnType<typeof useTradingPanelPoolConfig>)
    vi.mocked(useRawAssetPrice).mockReturnValue(BigInt(100))
    vi.mocked(useAppliedWithdrawSlippage).mockReturnValue(1)
    vi.mocked(useCompleteWithdrawTotalUsdValue).mockReturnValue(1000)
  })

  it('should calculate expectedReceiveAmount and minExpectedReceiveAmount correctly including DEFAULT_RECEIVED_VALUE_GAP', () => {
    const { result } = renderHook(() => useCompleteWithdrawExpectedAmount())

    expect(result.current.expectedReceiveAmount).toBe('10000000000000000000000')
    expect(result.current.minExpectedReceiveAmount).toBe(
      '9898020000000000000000',
    )
  })

  it('should handle slippage being 0 including DEFAULT_RECEIVED_VALUE_GAP', () => {
    vi.mocked(useAppliedWithdrawSlippage).mockReturnValue(0)
    const { result } = renderHook(() => useCompleteWithdrawExpectedAmount())

    expect(result.current.expectedReceiveAmount).toBe('10000000000000000000000')
    expect(result.current.minExpectedReceiveAmount).toBe(
      '9998000000000000000000',
    )
  })

  it('should handle totalUsdAmountToBeSwapped being 0', () => {
    vi.mocked(useCompleteWithdrawTotalUsdValue).mockReturnValue(0)
    const { result } = renderHook(() => useCompleteWithdrawExpectedAmount())

    expect(result.current.expectedReceiveAmount).toBe('0')
    expect(result.current.minExpectedReceiveAmount).toBe('0')
  })
})
