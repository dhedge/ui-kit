import { optimism } from 'core-kit/const'
import * as stateHooks from 'core-kit/hooks/state'
import { useTradingResultHandling } from 'core-kit/hooks/trading/trade-handlers/use-trading-result-handling'
import * as web3Hooks from 'core-kit/hooks/web3'

import type { PendingTransaction } from 'core-kit/types'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/state', () => ({
  useOnTransactionError: vi.fn(),
  useOnTransactionSuccess: vi.fn(),
  useTradingPanelModal: vi.fn(),
  useTradingPanelTransactions: vi.fn(),
  useTradingPanelSettings: vi.fn(),
}))

vi.mock('core-kit/hooks/web3', () => ({
  useWaitForTransactionReceipt: vi.fn(() => ({
    data: {},
    error: null,
  })),
  useInvalidateTradingQueries: vi.fn(() => ({
    invalidateAllowanceQueries: vi.fn(),
    invalidateTradingQueries: vi.fn(),
  })),
}))

const openLimitSellsOverlayMock = vi.fn()

beforeEach(() => {
  openLimitSellsOverlayMock.mockClear()
})

describe('useTradingResultHandling', () => {
  it('should call useWaitForTransactionReceipt with pending tx hash', () => {
    const pendingTx: PendingTransaction = {
      action: 'deposit',
      symbol: 'symbol',
      chainId: optimism.id,
      txHash: TEST_ADDRESS,
    }

    vi.mocked(stateHooks.useTradingPanelTransactions).mockReturnValue([
      [pendingTx],
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelModal).mockReturnValue([
      {},
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelModal>)

    renderHook(() => useTradingResultHandling())

    expect(web3Hooks.useWaitForTransactionReceipt).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useWaitForTransactionReceipt).toHaveBeenCalledWith(
      expect.objectContaining({
        hash: pendingTx.txHash,
        chainId: pendingTx.chainId,
      }),
    )
  })
})
