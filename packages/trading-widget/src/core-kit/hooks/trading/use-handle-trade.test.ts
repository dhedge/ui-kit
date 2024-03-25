import { DEFAULT_PRECISION, optimism } from 'core-kit/const'
import * as stateHooks from 'core-kit/hooks/state'
import * as tradingHooks from 'core-kit/hooks/trading'
import * as userHooks from 'core-kit/hooks/user'
import * as web3Hooks from 'core-kit/hooks/web3'

import type { TradingToken } from 'core-kit/types'
import { TEST_ADDRESS } from 'tests/mocks'
import { act, renderHook } from 'tests/test-utils'

import { useHandleTrade } from './use-handle-trade'

vi.mock('core-kit/hooks/state', () => ({
  useOnTransactionEstimationError: vi.fn(),
  useReceiveTokenInput: vi.fn(),
  useSendTokenInput: vi.fn(),
  useTradingPanelModal: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
  useTradingPanelTransactions: vi.fn(),
  useTradingPanelType: vi.fn(),
}))

vi.mock('./use-is-trading-enabled', () => ({
  useIsTradingEnabled: vi.fn(),
}))

vi.mock('core-kit/hooks/user', () => ({
  useIsInsufficientBalance: vi.fn(),
}))

vi.mock('core-kit/hooks/web3', () => ({
  useAccount: vi.fn(),
}))

describe('useHandleTrade::handleTrade', () => {
  it('should call updateTradingModal', async () => {
    const tradeMock = vi.fn()
    const updateTradingModalMock = vi.fn()
    const account = TEST_ADDRESS
    const poolConfig = { address: TEST_ADDRESS, chainId: optimism.id }
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'send_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '2',
      decimals: DEFAULT_PRECISION,
    }
    const panelType = 'deposit'
    const isTradingEnabled = true
    const isInsufficientBalance = false

    vi.mocked(web3Hooks.useAccount).mockReturnValue({ account } as ReturnType<
      typeof web3Hooks.useAccount
    >)
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useReceiveTokenInput>)
    vi.mocked(stateHooks.useTradingPanelType).mockReturnValue([
      panelType,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useTradingPanelType>)
    vi.mocked(stateHooks.useTradingPanelModal).mockReturnValue([
      {},
      updateTradingModalMock,
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelModal>)
    vi.mocked(stateHooks.useTradingPanelTransactions).mockReturnValue([
      [],
      vi.fn(),
    ])
    vi.mocked(tradingHooks.useIsTradingEnabled).mockReturnValue(
      isTradingEnabled,
    )
    vi.mocked(userHooks.useIsInsufficientBalance).mockReturnValue(
      isInsufficientBalance,
    )

    const { result } = renderHook(() => useHandleTrade(tradeMock))

    await act(async () => result.current.handleTrade())

    expect(updateTradingModalMock).toHaveBeenCalledTimes(1)
    expect(updateTradingModalMock).toHaveBeenCalledWith({
      isOpen: true,
      status: 'Wallet',
      action: 'deposit',
      link: '',
      sendToken,
      receiveToken,
    })
  })

  it('should call trade method', async () => {
    const tradeMock = vi.fn()
    const updateTradingModalMock = vi.fn()
    const account = TEST_ADDRESS
    const poolConfig = { address: TEST_ADDRESS, chainId: optimism.id }
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'send_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '2',
      decimals: DEFAULT_PRECISION,
    }
    const panelType = 'deposit'
    const isTradingEnabled = true
    const isInsufficientBalance = false

    vi.mocked(web3Hooks.useAccount).mockReturnValue({ account } as ReturnType<
      typeof web3Hooks.useAccount
    >)
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useReceiveTokenInput>)
    vi.mocked(stateHooks.useTradingPanelType).mockReturnValue([
      panelType,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useTradingPanelType>)
    vi.mocked(stateHooks.useTradingPanelModal).mockReturnValue([
      {},
      updateTradingModalMock,
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelModal>)
    vi.mocked(stateHooks.useTradingPanelTransactions).mockReturnValue([
      [],
      vi.fn(),
    ])
    vi.mocked(tradingHooks.useIsTradingEnabled).mockReturnValue(
      isTradingEnabled,
    )
    vi.mocked(userHooks.useIsInsufficientBalance).mockReturnValue(
      isInsufficientBalance,
    )

    const { result } = renderHook(() => useHandleTrade(tradeMock))

    await act(async () => result.current.handleTrade())

    expect(tradeMock).toHaveBeenCalledTimes(1)
  })

  it('should catch and handle trade fn error', async () => {
    const tradeMock = vi.fn().mockRejectedValue(new Error('test'))
    const updateTradingModalMock = vi.fn()
    const updatePendingTransactionsMock = vi.fn()
    const account = TEST_ADDRESS
    const poolConfig = { address: TEST_ADDRESS, chainId: optimism.id }
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'send_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '2',
      decimals: DEFAULT_PRECISION,
    }
    const panelType = 'deposit'
    const isTradingEnabled = true
    const isInsufficientBalance = false

    vi.mocked(web3Hooks.useAccount).mockReturnValue({ account } as ReturnType<
      typeof web3Hooks.useAccount
    >)
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useReceiveTokenInput>)
    vi.mocked(stateHooks.useTradingPanelType).mockReturnValue([
      panelType,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useTradingPanelType>)
    vi.mocked(stateHooks.useTradingPanelModal).mockReturnValue([
      {},
      updateTradingModalMock,
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelModal>)
    vi.mocked(stateHooks.useTradingPanelTransactions).mockReturnValue([
      [],
      updatePendingTransactionsMock,
    ])
    vi.mocked(tradingHooks.useIsTradingEnabled).mockReturnValue(
      isTradingEnabled,
    )
    vi.mocked(userHooks.useIsInsufficientBalance).mockReturnValue(
      isInsufficientBalance,
    )

    const { result } = renderHook(() => useHandleTrade(tradeMock))

    await act(async () => result.current.handleTrade())

    expect(updateTradingModalMock).toHaveBeenCalledTimes(2)
    expect(updateTradingModalMock).toHaveBeenCalledWith({
      isOpen: true,
      status: 'Wallet',
      action: 'deposit',
      link: '',
      sendToken,
      receiveToken,
    })
    expect(updateTradingModalMock).toHaveBeenCalledWith({
      isOpen: false,
      status: 'None',
      link: '',
      sendToken: null,
      receiveToken: null,
    })
    expect(updatePendingTransactionsMock).toHaveBeenCalledTimes(1)
    expect(updatePendingTransactionsMock).toHaveBeenCalledWith({
      type: 'remove',
      status: 'fail',
    })
  })
})
