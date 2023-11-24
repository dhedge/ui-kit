import { optimism } from 'const'
import * as stateHooks from 'hooks/state'
import { act, renderHook } from 'test-utils'

import { TEST_ADDRESS } from 'tests/mocks'

import { useTradingSettleHandler } from './use-trading-settle-handler'

vi.mock('hooks/state', () => ({
  useSendTokenInput: vi.fn(),
  useTradingPanelApprovingStatus: vi.fn(),
  useTradingPanelModal: vi.fn(),
  useTradingPanelTransactions: vi.fn(),
}))

describe('useTradingSettleHandler', () => {
  it('should handle error on approve action', async () => {
    const action = 'approve'
    const error = new Error('test')
    const setApprovingStatusMock = vi.fn()
    const updateTradingModalMock = vi.fn()
    const updatePendingTransactionsMock = vi.fn()

    expect(action === 'approve').toBe(true)
    expect(error).toBeInstanceOf(Error)

    vi.mocked(stateHooks.useTradingPanelApprovingStatus).mockReturnValue([
      undefined,
      setApprovingStatusMock,
    ])
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

    act(() =>
      result.current({ hash: TEST_ADDRESS }, error, { chainId: optimism.id }),
    )

    expect(setApprovingStatusMock).toHaveBeenCalledTimes(1)
    expect(setApprovingStatusMock).toHaveBeenCalledWith(undefined)
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
    const setApprovingStatusMock = vi.fn()
    const updateTradingModalMock = vi.fn()
    const updatePendingTransactionsMock = vi.fn()

    expect(action === 'deposit').toBe(true)
    expect(error).toBeInstanceOf(Error)

    vi.mocked(stateHooks.useTradingPanelApprovingStatus).mockReturnValue([
      undefined,
      setApprovingStatusMock,
    ])
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

    act(() =>
      result.current({ hash: TEST_ADDRESS }, error, { chainId: optimism.id }),
    )

    expect(setApprovingStatusMock).not.toHaveBeenCalledTimes(1)
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
    const data = { hash: TEST_ADDRESS }
    const error = null
    const setApprovingStatusMock = vi.fn()
    const updateTradingModalMock = vi.fn()
    const updatePendingTransactionsMock = vi.fn()
    const updateSendTokenMock = vi.fn()

    expect(action === 'deposit').toBe(true)
    expect(error).toBeNull()

    vi.mocked(stateHooks.useTradingPanelApprovingStatus).mockReturnValue([
      undefined,
      setApprovingStatusMock,
    ])
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

    act(() => result.current(data, error, { chainId: optimism.id }))

    expect(updatePendingTransactionsMock).toHaveBeenCalledTimes(1)
    expect(updatePendingTransactionsMock).toHaveBeenCalledWith({
      type: 'update',
      txHash: data.hash,
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
    const data = { hash: TEST_ADDRESS }
    const error = null
    const setApprovingStatusMock = vi.fn()
    const updateTradingModalMock = vi.fn()
    const updatePendingTransactionsMock = vi.fn()
    const updateSendTokenMock = vi.fn()

    expect(action === 'approve').toBe(true)
    expect(error).toBeNull()

    vi.mocked(stateHooks.useTradingPanelApprovingStatus).mockReturnValue([
      undefined,
      setApprovingStatusMock,
    ])
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

    act(() => result.current(data, error, { chainId: optimism.id }))

    expect(updatePendingTransactionsMock).toHaveBeenCalledTimes(1)
    expect(updatePendingTransactionsMock).toHaveBeenCalledWith({
      type: 'update',
      txHash: data.hash,
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
