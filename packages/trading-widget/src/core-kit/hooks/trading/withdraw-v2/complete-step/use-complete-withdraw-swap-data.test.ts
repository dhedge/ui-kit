import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useSwapsDataQuery } from 'core-kit/hooks/trading/use-swaps-data-query'
import { useCompleteWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage'
import { useAccount } from 'core-kit/hooks/web3'
import { isEqualAddress } from 'core-kit/utils'

import { renderHook } from 'tests/test-utils'

import { useCompleteWithdrawSwapData } from './use-complete-withdraw-swap-data'

vi.mock('core-kit/hooks/state')
vi.mock('core-kit/hooks/trading/use-swaps-data-query')
vi.mock('core-kit/hooks/trading/withdraw-v2/complete-step')
vi.mock('core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage')
vi.mock('core-kit/hooks/web3')
vi.mock('core-kit/utils')

describe('useCompleteWithdrawSwapData', () => {
  beforeEach(() => {
    vi.mocked(useTradingPanelPoolConfig).mockReturnValue({
      chainId: 10,
    } as unknown as ReturnType<typeof useTradingPanelPoolConfig>)
    vi.mocked(useAccount).mockReturnValue({
      account: '0x123',
    } as unknown as ReturnType<typeof useAccount>)
    vi.mocked(useAppliedWithdrawSlippage).mockReturnValue(0.5)
    vi.mocked(useReceiveTokenInput).mockReturnValue([
      { address: '0x456', decimals: 18 },
    ] as unknown as ReturnType<typeof useReceiveTokenInput>)
    vi.mocked(useCompleteWithdrawTrackedAssets).mockReturnValue({
      data: [{ address: '0x789', rawBalance: BigInt(1000) }],
    } as unknown as ReturnType<typeof useCompleteWithdrawTrackedAssets>)
    vi.mocked(isEqualAddress).mockImplementation((a, b) => a === b)
  })

  it('should return swap data when assets are present and not equal to receive token', () => {
    renderHook(() => useCompleteWithdrawSwapData())

    expect(useSwapsDataQuery).toHaveBeenCalledWith(
      [
        {
          amount: '1000',
          chainId: 10,
          destinationAddress: '0x456',
          slippage: '0.5',
          sourceAddress: '0x789',
          walletAddress: '0x123',
        },
      ],
      { enabled: true },
    )
  })

  it('should not return swap data when assets are empty', () => {
    vi.mocked(useCompleteWithdrawTrackedAssets).mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useCompleteWithdrawTrackedAssets>)

    renderHook(() => useCompleteWithdrawSwapData())

    expect(useSwapsDataQuery).toHaveBeenCalledWith(
      expect.objectContaining([]),
      { enabled: false },
    )
  })

  it('should not return swap data when all assets are equal to receive token', () => {
    vi.mocked(useCompleteWithdrawTrackedAssets).mockReturnValue({
      data: [{ address: '0x456', rawBalance: BigInt(1000) }],
    } as unknown as ReturnType<typeof useCompleteWithdrawTrackedAssets>)

    renderHook(() => useCompleteWithdrawSwapData())

    expect(useSwapsDataQuery).toHaveBeenCalledWith(
      expect.objectContaining([]),
      { enabled: false },
    )
  })
})
