import { expect } from 'vitest'

import { DEFAULT_PRECISION, MaxUint256, optimism } from 'core-kit/const'
import * as stateHooks from 'core-kit/hooks/state'
import { useApprove } from 'core-kit/hooks/trading/allowance/use-approve'
import * as web3Hooks from 'core-kit/hooks/web3'

import type { TradingToken } from 'core-kit/types'
import { TEST_ADDRESS } from 'tests/mocks'
import { act, renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelModal: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
  useTradingPanelSettings: vi.fn(),
  useTradingPanelTransactions: vi.fn(),
}))

vi.mock('core-kit/hooks/trading', () => ({
  useTradingSettleHandler: vi.fn(),
}))

vi.mock('core-kit/hooks/web3', () => ({
  useContractFunction: vi.fn(),
}))

describe('useApprove', () => {
  it('should call send approve method on erc20 contract with spenderAddress and infinite allowance', async () => {
    const token: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const rawTokenAmount = '1'
    const spenderAddress = TEST_ADDRESS
    const poolConfig = { chainId: optimism.id }
    const settings = { isInfiniteAllowance: true }
    const updatePendingTransactionsMock = vi.fn()
    const updateTradingModalMock = vi.fn()
    const sendMock = vi.fn()

    expect(settings.isInfiniteAllowance).toBe(true)

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)
    vi.mocked(stateHooks.useTradingPanelTransactions).mockReturnValue([
      [],
      updatePendingTransactionsMock,
    ])
    vi.mocked(stateHooks.useTradingPanelModal).mockReturnValue([
      {},
      updateTradingModalMock,
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelModal>)
    vi.mocked(web3Hooks.useContractFunction).mockReturnValue({
      send: sendMock,
    } as unknown as ReturnType<typeof web3Hooks.useContractFunction>)

    const { result } = renderHook(() =>
      useApprove({
        token,
        rawTokenAmount,
        spenderAddress,
      }),
    )

    await act(() => result.current())

    expect(vi.mocked(web3Hooks.useContractFunction)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useContractFunction)).toHaveBeenCalledWith(
      expect.objectContaining({
        contractId: 'erc20',
        dynamicContractAddress: token.address,
        functionName: 'approve',
      }),
    )

    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(spenderAddress, MaxUint256)

    expect(updateTradingModalMock).toHaveBeenCalledTimes(1)
    expect(updateTradingModalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        action: 'approve',
      }),
    )
    expect(updatePendingTransactionsMock).toHaveBeenCalledTimes(1)
    expect(updatePendingTransactionsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'add',
        action: 'approve',
        symbol: token.symbol,
        chainId: poolConfig.chainId,
      }),
    )
  })

  it('should call send approve method on erc20 contract with spenderAddress and rawTokenAmount', async () => {
    const token: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const rawTokenAmount = '1'
    const spenderAddress = TEST_ADDRESS
    const poolConfig = { chainId: optimism.id }
    const settings = { isInfiniteAllowance: false }
    const updatePendingTransactionsMock = vi.fn()
    const updateTradingModalMock = vi.fn()
    const sendMock = vi.fn()

    expect(settings.isInfiniteAllowance).toBe(false)

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)
    vi.mocked(stateHooks.useTradingPanelTransactions).mockReturnValue([
      [],
      updatePendingTransactionsMock,
    ])
    vi.mocked(stateHooks.useTradingPanelModal).mockReturnValue([
      {},
      updateTradingModalMock,
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelModal>)
    vi.mocked(web3Hooks.useContractFunction).mockReturnValue({
      send: sendMock,
    } as unknown as ReturnType<typeof web3Hooks.useContractFunction>)

    const { result } = renderHook(() =>
      useApprove({
        token,
        rawTokenAmount,
        spenderAddress,
      }),
    )

    await act(() => result.current())

    expect(vi.mocked(web3Hooks.useContractFunction)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useContractFunction)).toHaveBeenCalledWith(
      expect.objectContaining({
        contractId: 'erc20',
        dynamicContractAddress: token.address,
        functionName: 'approve',
      }),
    )

    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(spenderAddress, rawTokenAmount)

    expect(updateTradingModalMock).toHaveBeenCalledTimes(1)
    expect(updateTradingModalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        action: 'approve',
      }),
    )
    expect(updatePendingTransactionsMock).toHaveBeenCalledTimes(1)
    expect(updatePendingTransactionsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'add',
        action: 'approve',
        symbol: token.symbol,
        chainId: poolConfig.chainId,
      }),
    )
  })
})
