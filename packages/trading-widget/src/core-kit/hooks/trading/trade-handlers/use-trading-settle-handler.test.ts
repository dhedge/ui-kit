import { optimism } from 'core-kit/const'
import * as stateHooks from 'core-kit/hooks/state'

import type { UseWriteContractParameters } from 'core-kit/types/web3.types'
import { TEST_ADDRESS } from 'tests/mocks'
import { act, renderHook } from 'tests/test-utils'

import { useTradingSettleHandler } from './use-trading-settle-handler'

vi.mock('core-kit/hooks/state', () => ({
  useSendTokenInput: vi.fn(),
  useTradingPanelModal: vi.fn(),
  useTradingPanelTransactions: vi.fn(),
  useOnTradingSettleError: vi.fn(),
}))

describe('useTradingSettleHandler', () => {
  it('should handle error on approve action', async () => {
    const action = 'approve'
    const error = new Error('test')
    const updateTradingModalMock = vi.fn()
    const updatePendingTransactionsMock = vi.fn()

    expect(action === 'approve').toBe(true)
    expect(error).toBeInstanceOf(Error)

    vi.mocked(stateHooks.useTradingPanelModal).mockReturnValue([
      {},
      updateTradingModalMock,
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelModal>)
    vi.mocked(stateHooks.useTradingPanelTransactions).mockReturnValue([
      [],
      updatePendingTransactionsMock,
    ])
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      {},
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useSendTokenInput>)

    const { result } = renderHook(() => useTradingSettleHandler(action))

    const params = [TEST_ADDRESS, error, { chainId: optimism.id }, undefined]

    act(() =>
      result.current(
        ...(params as Parameters<
          Required<
            Required<UseWriteContractParameters>['mutation']
          >['onSettled']
        >),
      ),
    )

    expect(updateTradingModalMock).toHaveBeenCalledTimes(1)
    expect(updateTradingModalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: false,
      }),
    )
    expect(updatePendingTransactionsMock).toHaveBeenCalledTimes(1)
    expect(updatePendingTransactionsMock).toHaveBeenCalledWith({
      type: 'remove',
      status: 'fail',
    })
  })

  it('should handle error on deposit action', async () => {
    const action = 'deposit'
    const error = new Error('test')
    const updateTradingModalMock = vi.fn()
    const updatePendingTransactionsMock = vi.fn()

    expect(action === 'deposit').toBe(true)
    expect(error).toBeInstanceOf(Error)

    vi.mocked(stateHooks.useTradingPanelModal).mockReturnValue([
      {},
      updateTradingModalMock,
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelModal>)
    vi.mocked(stateHooks.useTradingPanelTransactions).mockReturnValue([
      [],
      updatePendingTransactionsMock,
    ])
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      {},
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useSendTokenInput>)

    const { result } = renderHook(() => useTradingSettleHandler(action))

    const params = [TEST_ADDRESS, error, { chainId: optimism.id }, undefined]

    act(() =>
      result.current(
        ...(params as Parameters<
          Required<
            Required<UseWriteContractParameters>['mutation']
          >['onSettled']
        >),
      ),
    )

    expect(updateTradingModalMock).toHaveBeenCalledTimes(1)
    expect(updateTradingModalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: false,
      }),
    )
    expect(updatePendingTransactionsMock).toHaveBeenCalledTimes(1)
    expect(updatePendingTransactionsMock).toHaveBeenCalledWith({
      type: 'remove',
      status: 'fail',
    })
  })

  it('should handle deposit action data with txHash', async () => {
    const action = 'deposit'
    const error = null
    const updateTradingModalMock = vi.fn()
    const updatePendingTransactionsMock = vi.fn()
    const updateSendTokenMock = vi.fn()

    expect(action === 'deposit').toBe(true)
    expect(error).toBeNull()

    vi.mocked(stateHooks.useTradingPanelModal).mockReturnValue([
      {},
      updateTradingModalMock,
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelModal>)
    vi.mocked(stateHooks.useTradingPanelTransactions).mockReturnValue([
      [],
      updatePendingTransactionsMock,
    ])
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      {},
      updateSendTokenMock,
    ] as unknown as ReturnType<typeof stateHooks.useSendTokenInput>)

    const { result } = renderHook(() => useTradingSettleHandler(action))

    const params = [TEST_ADDRESS, error, { chainId: optimism.id }, undefined]

    act(() =>
      result.current(
        ...(params as Parameters<
          Required<
            Required<UseWriteContractParameters>['mutation']
          >['onSettled']
        >),
      ),
    )

    expect(updatePendingTransactionsMock).toHaveBeenCalledTimes(1)
    expect(updatePendingTransactionsMock).toHaveBeenCalledWith({
      type: 'update',
      txHash: TEST_ADDRESS,
    })
    expect(updateTradingModalMock).toHaveBeenCalledTimes(1)
    expect(updateTradingModalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        status: 'Mining',
      }),
    )
    expect(updateSendTokenMock).toHaveBeenCalledTimes(1)
    expect(updateSendTokenMock).toHaveBeenCalledWith({ value: '' })
  })

  it('should handle approve action data with txHash', async () => {
    const action = 'approve'
    const error = null
    const updateTradingModalMock = vi.fn()
    const updatePendingTransactionsMock = vi.fn()
    const updateSendTokenMock = vi.fn()

    expect(action === 'approve').toBe(true)
    expect(error).toBeNull()

    vi.mocked(stateHooks.useTradingPanelModal).mockReturnValue([
      {},
      updateTradingModalMock,
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelModal>)
    vi.mocked(stateHooks.useTradingPanelTransactions).mockReturnValue([
      [],
      updatePendingTransactionsMock,
    ])
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      {},
      updateSendTokenMock,
    ] as unknown as ReturnType<typeof stateHooks.useSendTokenInput>)

    const { result } = renderHook(() => useTradingSettleHandler(action))

    const params = [TEST_ADDRESS, error, { chainId: optimism.id }, undefined]

    act(() =>
      result.current(
        ...(params as Parameters<
          Required<
            Required<UseWriteContractParameters>['mutation']
          >['onSettled']
        >),
      ),
    )

    expect(updatePendingTransactionsMock).toHaveBeenCalledTimes(1)
    expect(updatePendingTransactionsMock).toHaveBeenCalledWith({
      type: 'update',
      txHash: TEST_ADDRESS,
    })
    expect(updateTradingModalMock).toHaveBeenCalledTimes(1)
    expect(updateTradingModalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        status: 'Mining',
      }),
    )
    expect(updateSendTokenMock).toHaveBeenCalledTimes(0)
  })
})
