import { act } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

import {
  useOnTransactionEstimationError,
  useReceiveTokenInput,
  useTradingPanelModal,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import {
  useCompleteWithdrawSwapData,
  useCompleteWithdrawTrackedAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useAccount } from 'core-kit/hooks/web3'
import { EstimationError } from 'core-kit/models'

import type { Address } from 'core-kit/types/web3.types'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { useHandleCompleteWithdraw } from './use-handle-complete-withdraw'

vi.mock('core-kit/hooks/state', () => ({
  useOnTransactionEstimationError: vi.fn(),
  useReceiveTokenInput: vi.fn(),
  useTradingPanelModal: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
  useTradingPanelTransactions: vi.fn(),
}))

vi.mock('core-kit/hooks/trading/withdraw-v2/complete-step', () => ({
  useCompleteWithdrawSwapData: vi.fn(),
  useCompleteWithdrawTrackedAssets: vi.fn(),
}))

vi.mock('core-kit/hooks/web3', () => ({
  useAccount: vi.fn(),
}))

vi.mock('trading-widget/providers/translation-provider', () => ({
  useTranslationContext: vi.fn(),
}))

describe('useHandleCompleteWithdraw', () => {
  const withdrawMock = vi.fn()
  const onTransactionEstimationErrorMock = vi.fn()
  const updateTradingModalMock = vi.fn()
  const chainId = 10
  const vaultAddress = '0x111' as Address
  const receiveToken = {
    symbol: 'TEST_TOKEN',
    address: '0x123' as Address,
    decimals: 18,
    value: '',
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  beforeEach(() => {
    vi.mocked(useOnTransactionEstimationError).mockReturnValue(
      onTransactionEstimationErrorMock,
    )
    vi.mocked(useReceiveTokenInput).mockReturnValue([receiveToken, vi.fn()])
    vi.mocked(useTradingPanelModal).mockReturnValue([
      {},
      updateTradingModalMock,
    ] as unknown as ReturnType<typeof useTradingPanelModal>)
    vi.mocked(useTradingPanelPoolConfig).mockReturnValue({
      chainId,
      address: vaultAddress,
    } as unknown as ReturnType<typeof useTradingPanelPoolConfig>)
    vi.mocked(useTradingPanelTransactions).mockReturnValue([
      {},
      vi.fn(),
    ] as unknown as ReturnType<typeof useTradingPanelTransactions>)
    vi.mocked(useCompleteWithdrawSwapData).mockReturnValue({
      isFetching: false,
    } as unknown as ReturnType<typeof useCompleteWithdrawSwapData>)
    vi.mocked(useCompleteWithdrawTrackedAssets).mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useCompleteWithdrawTrackedAssets>)

    vi.mocked(useAccount).mockReturnValue({
      account: TEST_ADDRESS,
    } as unknown as ReturnType<typeof useAccount>)

    vi.mocked(useTranslationContext).mockReturnValue({
      claimAction: 'Claim',
      swapAction: 'Swap',
    } as unknown as ReturnType<typeof useTranslationContext>)
  })

  it('should return correct initial values', () => {
    const { result } = renderHook(() =>
      useHandleCompleteWithdraw({ withdraw: withdrawMock, isClaim: false }),
    )

    expect(result.current.disabled).toBe(false)
    expect(result.current.label).toBe('Swap')
  })

  it('should handle trade correctly', async () => {
    const { result } = renderHook(() =>
      useHandleCompleteWithdraw({ withdraw: withdrawMock, isClaim: false }),
    )

    await act(async () => {
      await result.current.handleTrade()
    })

    expect(withdrawMock).toHaveBeenCalled()
    expect(onTransactionEstimationErrorMock).not.toHaveBeenCalled()
    expect(updateTradingModalMock).toHaveBeenCalledWith({
      action: 'swap',
      isOpen: true,
      link: '',
      receiveTokens: [receiveToken],
      sendTokens: [],
      status: 'Wallet',
    })
  })

  it('should handle EstimationError correctly', async () => {
    const errorMock = new EstimationError({ message: 'Error', txArgs: [] })
    withdrawMock.mockRejectedValueOnce(errorMock)
    const onTransactionEstimationErrorMock = vi.fn()
    vi.mocked(useOnTransactionEstimationError).mockReturnValue(
      onTransactionEstimationErrorMock,
    )

    const { result } = renderHook(() =>
      useHandleCompleteWithdraw({ withdraw: withdrawMock, isClaim: false }),
    )

    await act(async () => {
      await result.current.handleTrade()
    })

    expect(onTransactionEstimationErrorMock).toHaveBeenCalledWith(
      errorMock,
      vaultAddress,
      chainId,
      TEST_ADDRESS,
    )
    expect(updateTradingModalMock).toHaveBeenCalledWith({
      isOpen: false,
      link: '',
      receiveTokens: null,
      sendTokens: null,
      status: 'None',
    })
  })
})
