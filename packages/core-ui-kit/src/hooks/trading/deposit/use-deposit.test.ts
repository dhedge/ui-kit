import { act } from '@testing-library/react'
import BigNumber from 'bignumber.js'

import { AddressZero, BRIDGED_USDC_OPTIMISM, optimism } from 'const'
import * as stateHooks from 'hooks/state'

import { useTradingSettleHandler } from 'hooks/trading'
import { useDepositSlippage } from 'hooks/trading/deposit'
import { useContractFunction } from 'hooks/web3'
import { renderHook } from 'test-utils'
import type { Address, DynamicTradingToken } from 'types'

import { useDeposit } from './use-deposit'

vi.mock('hooks/state', () => ({
  useReceiveTokenInput: vi.fn(),
  useSendTokenInput: vi.fn(),
  useTradingPanelDepositMethod: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
  useTradingPanelSettings: vi.fn(),
  useTradingPanelTransactions: vi.fn(),
}))
vi.mock('hooks/trading', () => ({
  useTradingSettleHandler: vi.fn(),
}))
vi.mock('hooks/trading/deposit', () => ({
  useDepositSlippage: vi.fn(),
}))
vi.mock('hooks/web3', () => ({
  useContractFunction: vi.fn(),
}))
const { logTransactionArguments } = vi.hoisted(() => ({
  logTransactionArguments: vi.fn(),
}))
vi.mock('utils', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('utils')
  return {
    ...actual,
    logTransactionArguments,
  }
})
describe('useDeposit', () => {
  const chainId = optimism.id
  const updatePendingTransactionsMock = vi.fn()
  const onSettledMock = vi.fn()
  const sendMock = vi.fn()

  beforeEach(() => {
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({ chainId }) as ReturnType<
          typeof stateHooks.useTradingPanelPoolConfig
        >,
    )
    vi.mocked(stateHooks.useTradingPanelTransactions).mockImplementation(() => [
      [],
      updatePendingTransactionsMock,
    ])
    vi.mocked(useTradingSettleHandler).mockImplementation(() => onSettledMock)
    vi.mocked(useContractFunction).mockImplementation(
      () =>
        ({
          send: sendMock,
        }) as unknown as ReturnType<typeof useContractFunction>,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should process deposits with auto slippage and not native token', async () => {
    const depositMethod = 'deposit'
    const sendToken = { ...BRIDGED_USDC_OPTIMISM, value: '5', isLoading: false }
    const receiveToken = {
      symbol: 'USDy',
      address: '0x123',
      value: '10',
    } as unknown as DynamicTradingToken
    const slippage = 'auto'
    const tradingParams = {
      poolDepositAddress: '0x111' as Address,
      receiveAssetAddress: receiveToken.address,
      sendAssetAddress: sendToken.address,
      receiveAssetInputValue: receiveToken.value,
      fromTokenAmount: new BigNumber(sendToken.value),
    }
    vi.mocked(stateHooks.useTradingPanelDepositMethod).mockImplementation(
      () => [depositMethod, vi.fn()],
    )
    vi.mocked(stateHooks.useSendTokenInput).mockImplementation(() => [
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(() => [
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockImplementation(
      () =>
        [
          {
            slippage,
          },
          vi.fn,
        ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>,
    )

    const { result } = renderHook(() => useDeposit(tradingParams))

    expect(useDepositSlippage).toHaveBeenCalledTimes(1)
    expect(useDepositSlippage).toHaveBeenCalledWith(
      tradingParams.receiveAssetInputValue,
    )
    expect(useTradingSettleHandler).toHaveBeenCalledTimes(1)
    expect(useTradingSettleHandler).toHaveBeenCalledWith('deposit')

    expect(useContractFunction).toHaveBeenCalledTimes(1)
    expect(useContractFunction).toHaveBeenCalledWith({
      contractId: 'easySwapper',
      functionName: depositMethod,
      onSettled: onSettledMock,
    })

    await act(async () => await result.current())

    expect(updatePendingTransactionsMock).toHaveBeenCalledTimes(1)
    expect(updatePendingTransactionsMock).toHaveBeenCalledWith({
      type: 'add',
      action: 'deposit',
      symbol: receiveToken.symbol,
      chainId,
    })
    expect(logTransactionArguments).toHaveBeenCalledTimes(1)
    expect(logTransactionArguments.mock.calls[0]).toMatchSnapshot()
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock.mock.calls[0]).toMatchSnapshot()
  })

  it('should process deposits with custom slippage, custom cooldown and native token', async () => {
    const depositMethod = 'depositWithCustomCooldown'
    const sendToken = {
      symbol: 'ETH',
      decimals: 18,
      address: AddressZero,
      value: '5',
      isLoading: false,
    }
    const receiveToken = {
      symbol: 'USDy',
      address: '0x123',
      value: '10',
    } as unknown as DynamicTradingToken
    const slippage = 0.15
    const tradingParams = {
      poolDepositAddress: BRIDGED_USDC_OPTIMISM.address,
      receiveAssetAddress: receiveToken.address,
      sendAssetAddress: sendToken.address,
      receiveAssetInputValue: receiveToken.value,
      fromTokenAmount: new BigNumber(sendToken.value),
    }
    vi.mocked(stateHooks.useTradingPanelDepositMethod).mockImplementation(
      () => [depositMethod, vi.fn()],
    )
    vi.mocked(stateHooks.useSendTokenInput).mockImplementation(() => [
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(() => [
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockImplementation(
      () =>
        [
          {
            slippage,
          },
          vi.fn,
        ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>,
    )

    const { result } = renderHook(() => useDeposit(tradingParams))

    expect(useDepositSlippage).toHaveBeenCalledTimes(1)
    expect(useDepositSlippage).toHaveBeenCalledWith(
      tradingParams.receiveAssetInputValue,
    )
    expect(useTradingSettleHandler).toHaveBeenCalledTimes(1)
    expect(useTradingSettleHandler).toHaveBeenCalledWith('deposit')

    expect(useContractFunction).toHaveBeenCalledTimes(1)
    expect(useContractFunction).toHaveBeenCalledWith({
      contractId: 'easySwapper',
      functionName: 'depositNativeWithCustomCooldown',
      onSettled: onSettledMock,
    })

    await act(async () => await result.current())

    expect(logTransactionArguments).toHaveBeenCalledTimes(1)
    expect(logTransactionArguments.mock.calls[0]).toMatchSnapshot()
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock.mock.calls[0]).toMatchSnapshot()
  })
})
