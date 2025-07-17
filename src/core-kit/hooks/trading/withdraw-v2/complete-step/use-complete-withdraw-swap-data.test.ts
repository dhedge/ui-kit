import {
  DEFAULT_SWAP_TRANSACTION_SLIPPAGE,
  SWAP_QUOTE_REFRESH_INTERVAL_MS,
} from 'core-kit/const'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useSwapsDataQuery } from 'core-kit/hooks/trading/use-swaps-data-query'
import {
  useCompleteWithdrawTrackedAssets,
  useHasSwappableAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useCompleteWithdrawSwapData } from 'core-kit/hooks/trading/withdraw-v2/complete-step/use-complete-withdraw-swap-data'
import { useAccount } from 'core-kit/hooks/web3'
import { isEqualAddress } from 'core-kit/utils'

import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/state')
vi.mock('core-kit/hooks/trading/use-swaps-data-query')
vi.mock('core-kit/hooks/trading/withdraw-v2/complete-step')
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
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      { slippage: 'auto' },
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useReceiveTokenInput).mockReturnValue([
      { address: '0x456', decimals: 18 },
    ] as unknown as ReturnType<typeof useReceiveTokenInput>)
    vi.mocked(useCompleteWithdrawTrackedAssets).mockReturnValue({
      data: [{ address: '0x789', rawBalance: BigInt(1000) }],
    } as unknown as ReturnType<typeof useCompleteWithdrawTrackedAssets>)
    vi.mocked(isEqualAddress).mockImplementation((a, b) => a === b)
  })

  it('should return swap data when assets are present and not equal to receive token with auto', () => {
    vi.mocked(useHasSwappableAssets).mockReturnValue(true)
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      { slippage: 1 },
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    renderHook(() => useCompleteWithdrawSwapData())

    expect(useSwapsDataQuery).toHaveBeenCalledWith(
      [
        {
          amount: '1000',
          chainId: 10,
          destinationAddress: '0x456',
          slippage: '1',
          sourceAddress: '0x789',
          walletAddress: '0x123',
        },
      ],
      { enabled: true, refetchInterval: SWAP_QUOTE_REFRESH_INTERVAL_MS },
    )
  })

  it('should return swap data when assets are present and not equal to receive token with custom slippage', () => {
    vi.mocked(useHasSwappableAssets).mockReturnValue(true)
    renderHook(() => useCompleteWithdrawSwapData())

    expect(useSwapsDataQuery).toHaveBeenCalledWith(
      [
        {
          amount: '1000',
          chainId: 10,
          destinationAddress: '0x456',
          slippage: DEFAULT_SWAP_TRANSACTION_SLIPPAGE.toString(),
          sourceAddress: '0x789',
          walletAddress: '0x123',
        },
      ],
      { enabled: true, refetchInterval: SWAP_QUOTE_REFRESH_INTERVAL_MS },
    )
  })

  it('should not return swap data when assets are empty', () => {
    vi.mocked(useHasSwappableAssets).mockReturnValue(false)
    vi.mocked(useCompleteWithdrawTrackedAssets).mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useCompleteWithdrawTrackedAssets>)

    renderHook(() => useCompleteWithdrawSwapData())

    expect(useSwapsDataQuery).toHaveBeenCalledWith(
      expect.objectContaining([]),
      { enabled: false, refetchInterval: SWAP_QUOTE_REFRESH_INTERVAL_MS },
    )
  })

  it('should not return swap data when all assets are equal to receive token', () => {
    vi.mocked(useHasSwappableAssets).mockReturnValue(false)
    vi.mocked(useCompleteWithdrawTrackedAssets).mockReturnValue({
      data: [{ address: '0x456', rawBalance: BigInt(1000) }],
    } as unknown as ReturnType<typeof useCompleteWithdrawTrackedAssets>)

    renderHook(() => useCompleteWithdrawSwapData())

    expect(useSwapsDataQuery).toHaveBeenCalledWith(
      expect.objectContaining([]),
      { enabled: false, refetchInterval: SWAP_QUOTE_REFRESH_INTERVAL_MS },
    )
  })
})
