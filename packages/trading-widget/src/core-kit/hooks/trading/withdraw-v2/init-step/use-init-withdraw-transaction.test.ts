import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'

import { useTradingSettleHandler } from 'core-kit/hooks/trading'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-is-multi-asset-withdraw'

import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage'
import { useContractFunction } from 'core-kit/hooks/web3'

import { getSlippageToleranceForWithdrawSafe } from 'core-kit/utils'
import { act, renderHook } from 'tests/test-utils'

import { useInitWithdrawTransaction } from './use-init-withdraw-transaction'

vi.mock('core-kit/hooks/state')
vi.mock(
  'core-kit/hooks/trading/withdraw-v2/init-step/use-is-multi-asset-withdraw',
)
vi.mock('core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage')
vi.mock('core-kit/hooks/web3')
vi.mock('core-kit/hooks/trading')

describe('useInitWithdrawTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize withdraw transaction with single asset', async () => {
    const mockSendTokenInput = [{ value: '100' }]
    const mockPoolConfig = { address: '0x123', symbol: 'ETH', chainId: 10 }
    const mockUpdatePendingTransactions = vi.fn()
    const mockSend = vi.fn().mockResolvedValue('txHash')
    const mockIsMultiAssetWithdraw = false
    const mockSlippage = 0.01
    const mockOnSettled = vi.fn()

    vi.mocked(useSendTokenInput).mockReturnValue(
      mockSendTokenInput as ReturnType<typeof useSendTokenInput>,
    )
    vi.mocked(useTradingPanelPoolConfig).mockReturnValue(
      mockPoolConfig as ReturnType<typeof useTradingPanelPoolConfig>,
    )
    vi.mocked(useTradingPanelTransactions).mockReturnValue([
      [],
      mockUpdatePendingTransactions,
    ])
    vi.mocked(useIsMultiAssetWithdraw).mockReturnValue(mockIsMultiAssetWithdraw)
    vi.mocked(useAppliedWithdrawSlippage).mockReturnValue(mockSlippage)
    vi.mocked(useContractFunction).mockReturnValue({
      send: mockSend,
    } as unknown as ReturnType<typeof useContractFunction>)
    vi.mocked(useTradingSettleHandler).mockReturnValue(mockOnSettled)

    const { result } = renderHook(() => useInitWithdrawTransaction())

    await act(async () => {
      const txHash = await result.current()
      expect(txHash).toBe('txHash')
    })

    expect(mockUpdatePendingTransactions).toHaveBeenCalledWith({
      type: 'add',
      action: 'single_withdraw',
      symbol: 'ETH',
      chainId: 10,
    })
    expect(mockSend).toHaveBeenCalledWith(
      '0x123',
      '100000000000000000000',
      getSlippageToleranceForWithdrawSafe(mockSlippage),
    )
  })

  it('should initialize withdraw transaction with multi asset', async () => {
    const mockSendTokenInput = [{ value: '100' }]
    const mockPoolConfig = { address: '0x123', symbol: 'ETH', chainId: 10 }
    const mockUpdatePendingTransactions = vi.fn()
    const mockSend = vi.fn().mockResolvedValue('txHash')
    const mockIsMultiAssetWithdraw = true
    const mockSlippage = 0.2
    const mockOnSettled = vi.fn()

    vi.mocked(useSendTokenInput).mockReturnValue(
      mockSendTokenInput as ReturnType<typeof useSendTokenInput>,
    )
    vi.mocked(useTradingPanelPoolConfig).mockReturnValue(
      mockPoolConfig as ReturnType<typeof useTradingPanelPoolConfig>,
    )
    vi.mocked(useTradingPanelTransactions).mockReturnValue([
      [],
      mockUpdatePendingTransactions,
    ])
    vi.mocked(useIsMultiAssetWithdraw).mockReturnValue(mockIsMultiAssetWithdraw)
    vi.mocked(useAppliedWithdrawSlippage).mockReturnValue(mockSlippage)
    vi.mocked(useContractFunction).mockReturnValue({
      send: mockSend,
    } as unknown as ReturnType<typeof useContractFunction>)
    vi.mocked(useTradingSettleHandler).mockReturnValue(mockOnSettled)

    const { result } = renderHook(() => useInitWithdrawTransaction())

    await act(async () => {
      const txHash = await result.current()
      expect(txHash).toBe('txHash')
    })

    expect(mockUpdatePendingTransactions).toHaveBeenCalledWith({
      type: 'add',
      action: 'multi_withdraw',
      symbol: 'ETH',
      chainId: 10,
    })
    expect(mockSend).toHaveBeenCalledWith(
      '100000000000000000000',
      getSlippageToleranceForWithdrawSafe(mockSlippage),
    )
  })
})
