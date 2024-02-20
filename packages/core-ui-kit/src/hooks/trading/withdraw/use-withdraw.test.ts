import BigNumber from 'bignumber.js'

import { DEFAULT_PRECISION, optimism } from 'const'
import * as stateHooks from 'hooks/state'
import { useTradingParams } from 'hooks/trading'
import * as tradingWithdrawHooks from 'hooks/trading/withdraw'
import * as web3Hooks from 'hooks/web3'
import { DefaultSellingParams } from 'models'
import { act, renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import type { TradingToken } from 'types'

import { getOrderedTxArgs } from 'utils'

import { useWithdraw } from './use-withdraw'

vi.mock('hooks/state', () => ({
  useReceiveTokenInput: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
  useTradingPanelSettings: vi.fn(),
  useTradingPanelTransactions: vi.fn(),
}))

vi.mock('hooks/trading', () => ({
  useTradingSettleHandler: vi.fn(),
  useTradingParams: vi.fn(),
}))

vi.mock('hooks/web3', () => ({
  useContractFunction: vi.fn(),
}))

vi.mock('./use-is-multi-asset-withdraw', () => ({
  useIsMultiAssetWithdraw: vi.fn(),
}))

vi.mock('./use-withdraw-slippage', () => ({
  useWithdrawSlippage: vi.fn(),
}))

describe('useWithdraw', () => {
  it('should handle multi asset withdraw', async () => {
    const receiveAssetAddress = TEST_ADDRESS
    const sendAssetAddress = TEST_ADDRESS
    const receiveAssetInputValue = '1'
    const fromTokenAmount = new BigNumber('1')

    const poolConfig = {
      address: TEST_ADDRESS,
      symbol: 'pool_symbol',
      withdrawParams: {
        customTokens: [],
      },
      chainId: optimism.id,
    }
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'all',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const settings = { minSlippage: 1, slippage: 1 }
    const isMultiAssetsWithdraw = true

    expect(isMultiAssetsWithdraw).toBe(true)

    const updatePendingTransactionsMock = vi.fn()
    const sendMock = vi.fn()
    const estimateMock = vi.fn()

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as unknown as ReturnType<
        typeof stateHooks.useTradingPanelPoolConfig
      >,
    )
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)
    vi.mocked(stateHooks.useTradingPanelTransactions).mockReturnValue([
      [],
      updatePendingTransactionsMock,
    ] as ReturnType<typeof stateHooks.useTradingPanelTransactions>)
    vi.mocked(tradingWithdrawHooks.useIsMultiAssetWithdraw).mockReturnValue(
      isMultiAssetsWithdraw,
    )
    vi.mocked(web3Hooks.useContractFunction).mockReturnValue({
      send: sendMock,
      estimate: estimateMock,
    })
    vi.mocked(useTradingParams).mockImplementation(() => ({
      receiveAssetAddress,
      sendAssetAddress,
      receiveAssetInputValue,
      fromTokenAmount,
    }))

    const { result } = renderHook(() => useWithdraw())

    await act(() => result.current())

    expect(vi.mocked(web3Hooks.useContractFunction)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useContractFunction)).toHaveBeenCalledWith(
      expect.objectContaining({
        contractId: 'poolLogic',
        dynamicContractAddress: poolConfig.address,
      }),
    )
    expect(updatePendingTransactionsMock).toHaveBeenCalledTimes(1)
    expect(updatePendingTransactionsMock).toHaveBeenCalledWith({
      type: 'add',
      action: 'withdraw',
      symbol: poolConfig.symbol,
      chainId: poolConfig.chainId,
    })
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(
      fromTokenAmount.shiftedBy(DEFAULT_PRECISION).toFixed(0),
    )
  })

  it('should handle single asset withdraw', async () => {
    const receiveAssetAddress = TEST_ADDRESS
    const sendAssetAddress = TEST_ADDRESS
    const receiveAssetInputValue = '1'
    const fromTokenAmount = new BigNumber('1')

    const poolConfig = {
      address: TEST_ADDRESS,
      symbol: 'pool_symbol',
      withdrawParams: {
        customTokens: [],
      },
      chainId: optimism.id,
    }
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const settings = { minSlippage: 1, slippage: 1 }
    const isMultiAssetsWithdraw = false

    expect(isMultiAssetsWithdraw).toBe(false)
    expect(settings.slippage).not.toEqual('auto')

    const updatePendingTransactionsMock = vi.fn()
    const sendMock = vi.fn()
    const estimateMock = vi.fn()

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as unknown as ReturnType<
        typeof stateHooks.useTradingPanelPoolConfig
      >,
    )
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)
    vi.mocked(stateHooks.useTradingPanelTransactions).mockReturnValue([
      [],
      updatePendingTransactionsMock,
    ] as ReturnType<typeof stateHooks.useTradingPanelTransactions>)
    vi.mocked(tradingWithdrawHooks.useIsMultiAssetWithdraw).mockReturnValue(
      isMultiAssetsWithdraw,
    )
    vi.mocked(web3Hooks.useContractFunction).mockReturnValue({
      send: sendMock,
      estimate: estimateMock,
    })
    vi.mocked(useTradingParams).mockImplementation(() => ({
      receiveAssetAddress,
      sendAssetAddress,
      receiveAssetInputValue,
      fromTokenAmount,
    }))

    const { result } = renderHook(() => useWithdraw())

    await act(() => result.current())

    expect(vi.mocked(web3Hooks.useContractFunction)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useContractFunction)).toHaveBeenCalledWith(
      expect.objectContaining({
        contractId: 'easySwapper',
        dynamicContractAddress: undefined,
      }),
    )
    expect(updatePendingTransactionsMock).toHaveBeenCalledTimes(1)
    expect(updatePendingTransactionsMock).toHaveBeenCalledWith({
      type: 'add',
      action: 'withdraw',
      symbol: poolConfig.symbol,
      chainId: poolConfig.chainId,
    })

    const txArgs = new DefaultSellingParams({
      sendAssetAddress,
      fromTokenAmount: fromTokenAmount.shiftedBy(DEFAULT_PRECISION).toFixed(0),
      receiveAssetAddress,
      receiveAssetInputValue,
      decimalsReceiveToken: receiveToken.decimals,
    })

    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(
      ...getOrderedTxArgs(txArgs, settings.slippage),
    )
  })

  it('should handle single asset withdraw with auto slippage', async () => {
    const receiveAssetAddress = TEST_ADDRESS
    const sendAssetAddress = TEST_ADDRESS
    const receiveAssetInputValue = '1'
    const fromTokenAmount = new BigNumber('1')

    const poolConfig = {
      address: TEST_ADDRESS,
      symbol: 'pool_symbol',
      withdrawParams: {
        customTokens: [],
      },
      chainId: optimism.id,
    }
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const settings = { minSlippage: 1, slippage: 'auto' }
    const isMultiAssetsWithdraw = false

    expect(isMultiAssetsWithdraw).toBe(false)
    expect(settings.slippage).toEqual('auto')

    const updatePendingTransactionsMock = vi.fn()
    const sendMock = vi.fn()
    const estimateMock = vi.fn()

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as unknown as ReturnType<
        typeof stateHooks.useTradingPanelPoolConfig
      >,
    )
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)
    vi.mocked(stateHooks.useTradingPanelTransactions).mockReturnValue([
      [],
      updatePendingTransactionsMock,
    ] as ReturnType<typeof stateHooks.useTradingPanelTransactions>)
    vi.mocked(tradingWithdrawHooks.useIsMultiAssetWithdraw).mockReturnValue(
      isMultiAssetsWithdraw,
    )
    vi.mocked(web3Hooks.useContractFunction).mockReturnValue({
      send: sendMock,
      estimate: estimateMock,
    })

    const { result } = renderHook(() => useWithdraw())

    await act(() => result.current())

    expect(vi.mocked(web3Hooks.useContractFunction)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useContractFunction)).toHaveBeenCalledWith(
      expect.objectContaining({
        contractId: 'easySwapper',
        dynamicContractAddress: undefined,
      }),
    )
    expect(updatePendingTransactionsMock).toHaveBeenCalledTimes(1)
    expect(updatePendingTransactionsMock).toHaveBeenCalledWith({
      type: 'add',
      action: 'withdraw',
      symbol: poolConfig.symbol,
      chainId: poolConfig.chainId,
    })

    const txArgs = new DefaultSellingParams({
      sendAssetAddress,
      fromTokenAmount: fromTokenAmount.shiftedBy(DEFAULT_PRECISION).toFixed(0),
      receiveAssetAddress,
      receiveAssetInputValue,
      decimalsReceiveToken: receiveToken.decimals,
    })

    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(
      ...getOrderedTxArgs(txArgs, settings.minSlippage),
    )
  })
})
