import { expect } from 'vitest'

import {
  DEFAULT_MULTI_ASSET_WITHDRAW_METHOD,
  EASY_SWAPPER_V2_INITIATE_WITHDRAW_METHOD,
  EASY_SWAPPER_V2_UNROLL_AND_CLAIM_METHOD,
} from 'core-kit/const'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'

import { useTradingSettleHandler } from 'core-kit/hooks/trading'
import { useGetInitWithdrawTransactionArguments } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-get-init-withdraw-transaction-arguments'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-is-multi-asset-withdraw'

import { useIsUnrollAndClaimTransaction } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-is-unroll-and-claim-transaction'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage'
import { useContractFunction } from 'core-kit/hooks/web3'

import { act, renderHook } from 'tests/test-utils'

import { useInitWithdrawTransaction } from './use-init-withdraw-transaction'

vi.mock('core-kit/hooks/state')
vi.mock(
  'core-kit/hooks/trading/withdraw-v2/init-step/use-is-multi-asset-withdraw',
)
vi.mock('core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage')
vi.mock('core-kit/hooks/web3')
vi.mock('core-kit/hooks/trading')
vi.mock(
  'core-kit/hooks/trading/withdraw-v2/init-step/use-is-unroll-and-claim-transaction',
)
vi.mock(
  'core-kit/hooks/trading/withdraw-v2/init-step/use-get-init-withdraw-transaction-arguments',
)

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
    const txArgs = [BigInt('100')]
    const mockGetInitWithdrawTransactionArguments = vi
      .fn()
      .mockReturnValue(txArgs)

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
    vi.mocked(useGetInitWithdrawTransactionArguments).mockReturnValueOnce(
      mockGetInitWithdrawTransactionArguments,
    )

    const { result } = renderHook(() => useInitWithdrawTransaction())

    await act(async () => {
      const txHash = await result.current.withdraw()
      expect(txHash).toBe('txHash')
    })

    expect(mockUpdatePendingTransactions).toHaveBeenCalledWith({
      type: 'add',
      action: 'single_withdraw',
      symbol: 'ETH',
      chainId: 10,
    })
    expect(mockGetInitWithdrawTransactionArguments).toHaveBeenCalled()
    expect(useContractFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: EASY_SWAPPER_V2_INITIATE_WITHDRAW_METHOD,
      }),
    )
    expect(mockSend).toHaveBeenCalledWith(...txArgs)
  })

  it('should initialize withdraw and claim transaction with single asset', async () => {
    const mockSendTokenInput = [{ value: '100' }]
    const mockPoolConfig = { address: '0x123', symbol: 'ETH', chainId: 10 }
    const mockUpdatePendingTransactions = vi.fn()
    const mockSend = vi.fn().mockResolvedValue('txHash')
    const mockIsMultiAssetWithdraw = false
    const mockSlippage = 0.01
    const mockOnSettled = vi.fn()
    const txArgs = [BigInt('10000')]
    const mockGetInitWithdrawTransactionArguments = vi
      .fn()
      .mockReturnValue(txArgs)

    vi.mocked(useGetInitWithdrawTransactionArguments).mockReturnValueOnce(
      mockGetInitWithdrawTransactionArguments,
    )
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
    vi.mocked(useIsUnrollAndClaimTransaction).mockReturnValue(true)

    const { result } = renderHook(() => useInitWithdrawTransaction())

    await act(async () => {
      const txHash = await result.current.withdraw()
      expect(txHash).toBe('txHash')
    })

    expect(mockUpdatePendingTransactions).toHaveBeenCalledWith({
      type: 'add',
      action: 'single_withdraw_and_claim',
      symbol: 'ETH',
      chainId: 10,
    })
    expect(useContractFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: EASY_SWAPPER_V2_UNROLL_AND_CLAIM_METHOD,
      }),
    )
    expect(mockSend).toHaveBeenCalledWith(...txArgs)
  })

  it('should initialize withdraw transaction with multi asset', async () => {
    const mockSendTokenInput = [{ value: '100' }]
    const mockPoolConfig = { address: '0x123', symbol: 'ETH', chainId: 10 }
    const mockUpdatePendingTransactions = vi.fn()
    const mockSend = vi.fn().mockResolvedValue('txHash')
    const mockIsMultiAssetWithdraw = true
    const mockSlippage = 0.2
    const mockOnSettled = vi.fn()
    const txArgs = [BigInt('99000')]
    const mockGetInitWithdrawTransactionArguments = vi
      .fn()
      .mockReturnValue(txArgs)

    vi.mocked(useGetInitWithdrawTransactionArguments).mockReturnValueOnce(
      mockGetInitWithdrawTransactionArguments,
    )

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
      const txHash = await result.current.withdraw()
      expect(txHash).toBe('txHash')
    })

    expect(mockUpdatePendingTransactions).toHaveBeenCalledWith({
      type: 'add',
      action: 'multi_withdraw',
      symbol: 'ETH',
      chainId: 10,
    })
    expect(useContractFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: DEFAULT_MULTI_ASSET_WITHDRAW_METHOD,
      }),
    )
    expect(mockSend).toHaveBeenCalledWith(...txArgs)
  })
})
