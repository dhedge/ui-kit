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
  useWaitForTransaction: vi.fn(),
}))

describe('useTradingResultHandling', () => {
  it('should call useWaitForTransaction with pending tx hash', () => {
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

    expect(web3Hooks.useWaitForTransaction).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useWaitForTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        hash: pendingTx.txHash,
        chainId: pendingTx.chainId,
      }),
    )
  })
})
