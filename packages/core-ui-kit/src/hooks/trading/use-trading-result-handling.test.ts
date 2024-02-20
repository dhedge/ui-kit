import { optimism } from 'const'
import * as stateHooks from 'hooks/state'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'

import { TEST_ADDRESS } from 'tests/mocks'
import type { PendingTransaction } from 'types'

import { useTradingResultHandling } from './use-trading-result-handling'

vi.mock('hooks/state', () => ({
  useOnTransactionError: vi.fn(),
  useOnTransactionSuccess: vi.fn(),
  useTradingPanelMeta: vi.fn(),
  useTradingPanelModal: vi.fn(),
  useTradingPanelTransactions: vi.fn(),
}))

vi.mock('hooks/web3', () => ({
  useWaitForTransactionReceipt: vi.fn(() => ({
    data: {},
    error: null,
  })),
}))

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
    vi.mocked(stateHooks.useTradingPanelMeta).mockReturnValue([{}, vi.fn()])
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
