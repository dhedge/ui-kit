import { vi } from 'vitest'

import {
  AddressZero,
  BRIDGED_USDC_OPTIMISM,
  DEFAULT_PRECISION,
  polygon,
} from 'core-kit/const'
import {
  useOnSimulateTransaction,
  useOnTransactionError,
  useOnTransactionEstimationError,
  useOnTransactionSuccess,
  useSetPoolAddress,
  useTradingPanelLogger,
  useUpdatePoolConfig,
  useUpdatePoolFallbackData,
  useUpdateReceiveTokenInput,
  useUpdateSendTokenInput,
} from 'core-kit/hooks/state/action'
import { useTradingPanelState } from 'core-kit/hooks/state/context'
import { EstimationError } from 'core-kit/models'
import type {
  CallbackConfig,
  PoolComposition,
  PoolConfig,
  TradingToken,
} from 'core-kit/types'
import { CALLBACK_CONFIG_MOCK, TEST_ADDRESS } from 'tests/mocks'
import { TestProviders, act, renderHook } from 'tests/test-utils'

describe('useSetPoolAddress', () => {
  it('should set poolAddress to state', () => {
    const { result } = renderHook(() => {
      const setter = useSetPoolAddress()
      const state = useTradingPanelState()

      return {
        setter,
        state,
      }
    })

    expect(result.current.state.poolAddress).toBe(AddressZero)
    act(() => {
      result.current.setter(TEST_ADDRESS)
    })
    expect(result.current.state.poolAddress).toBe(TEST_ADDRESS)
  })
})

describe('useUpdateSendTokenInput', () => {
  it('should partially update sendToken input state', () => {
    const { result } = renderHook(() => {
      const updater = useUpdateSendTokenInput()
      const state = useTradingPanelState()

      return {
        updater,
        state,
      }
    })

    expect(result.current.state.input.sendToken.address).toBe(AddressZero)
    act(() => {
      result.current.updater({ address: TEST_ADDRESS })
    })
    expect(result.current.state.input.sendToken.address).toBe(TEST_ADDRESS)

    const testTradingToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'test',
      value: '100',
      decimals: 8,
    }

    act(() => {
      result.current.updater(testTradingToken)
    })
    expect(result.current.state.input.sendToken).toEqual(testTradingToken)
  })
})

describe('useUpdateReceiveTokenInput', () => {
  it('should partially update receiveToken input state', () => {
    const { result } = renderHook(() => {
      const updater = useUpdateReceiveTokenInput()
      const state = useTradingPanelState()

      return {
        updater,
        state,
      }
    })

    expect(result.current.state.input.receiveToken.address).toBe(AddressZero)
    act(() => {
      result.current.updater({ address: TEST_ADDRESS })
    })
    expect(result.current.state.input.receiveToken.address).toBe(TEST_ADDRESS)

    const testTradingToken: TradingToken = {
      ...BRIDGED_USDC_OPTIMISM,
      value: '100',
    }

    act(() => {
      result.current.updater(testTradingToken)
    })
    expect(result.current.state.input.receiveToken).toEqual(testTradingToken)
  })
})

describe('useUpdatePoolFallbackData', () => {
  it('should set poolFallbackData state', () => {
    const { result } = renderHook(() => {
      const updater = useUpdatePoolFallbackData()
      const state = useTradingPanelState()

      return {
        updater,
        state,
      }
    })

    const testPoolCompositions: PoolComposition[] = [
      {
        tokenAddress: TEST_ADDRESS,
        tokenName: 'tokenName',
        rate: 'rate',
        amount: '0',
        isDeposit: true,
        precision: DEFAULT_PRECISION,
        asset: { iconSymbols: ['symbol'] },
      },
    ]

    expect(result.current.state.poolFallbackData).toEqual({
      address: AddressZero,
    })
    act(() => {
      result.current.updater({
        address: TEST_ADDRESS,
        tokenPrice: '0',
        managerLogicAddress: TEST_ADDRESS,
        poolCompositions: testPoolCompositions,
      })
    })
    expect(result.current.state.poolFallbackData).toEqual({
      address: TEST_ADDRESS,
      tokenPrice: '0',
      managerLogicAddress: TEST_ADDRESS,
      poolCompositions: testPoolCompositions,
    })
  })
})

describe('useOnTransactionError', () => {
  it('should call onTransactionError action', () => {
    const errorCb = vi.fn()
    const testParams: Parameters<CallbackConfig['onTransactionError']> = [
      new Error('test'),
      'deposit',
      polygon.id,
      TEST_ADDRESS,
    ]

    const { result } = renderHook(
      () => {
        const action = useOnTransactionError()

        return {
          action,
        }
      },
      {
        wrapper: ({ children }) => (
          <TestProviders
            actions={{ ...CALLBACK_CONFIG_MOCK, onTransactionError: errorCb }}
          >
            {children}
          </TestProviders>
        ),
      },
    )

    expect(errorCb).toHaveBeenCalledTimes(0)
    act(() => {
      result.current.action?.(...testParams)
    })
    expect(errorCb).toHaveBeenCalledTimes(1)
    expect(errorCb).toHaveBeenCalledWith(...testParams)
  })
})

describe('useOnTransactionSuccess', () => {
  it('should call onTransactionSuccess action', () => {
    const successCb = vi.fn()
    const testParams: Parameters<CallbackConfig['onTransactionSuccess']> = [
      {
        to: '0x1to',
        from: '0x2from',
        contractAddress: '0x3contractAddress',
        transactionIndex: 0,
        gasUsed: BigInt(0),
        logsBloom: '0x4logsBloom',
        blockHash: '0x5blockHash',
        transactionHash: '0x6transactionHash',
        logs: [],
        blockNumber: BigInt(0),
        cumulativeGasUsed: BigInt(0),
        effectiveGasPrice: BigInt(0),
        type: '0x1',
        status: 'success',
      },
      'deposit',
      'link',
    ]

    const { result } = renderHook(
      () => {
        const action = useOnTransactionSuccess()

        return {
          action,
        }
      },
      {
        wrapper: ({ children }) => (
          <TestProviders
            actions={{
              ...CALLBACK_CONFIG_MOCK,
              onTransactionSuccess: successCb,
            }}
          >
            {children}
          </TestProviders>
        ),
      },
    )

    expect(successCb).toHaveBeenCalledTimes(0)
    act(() => {
      result.current.action?.(...testParams)
    })
    expect(successCb).toHaveBeenCalledTimes(1)
    expect(successCb).toHaveBeenCalledWith(...testParams)
  })
})

describe('useOnTransactionEstimationError', () => {
  it('should call onTransactionEstimationError action', () => {
    const estimationCb = vi.fn()
    const testParams: Parameters<
      CallbackConfig['onTransactionEstimationError']
    > = [
      new EstimationError({
        txArgs: ['arg0', 'arg1', 'arg2'],
      }),
      TEST_ADDRESS,
      polygon.id,
      TEST_ADDRESS,
    ]

    const { result } = renderHook(
      () => {
        const action = useOnTransactionEstimationError()

        return {
          action,
        }
      },
      {
        wrapper: ({ children }) => (
          <TestProviders
            actions={{
              ...CALLBACK_CONFIG_MOCK,
              onTransactionEstimationError: estimationCb,
            }}
          >
            {children}
          </TestProviders>
        ),
      },
    )

    expect(estimationCb).toHaveBeenCalledTimes(0)
    act(() => {
      result.current.action?.(...testParams)
    })
    expect(estimationCb).toHaveBeenCalledTimes(1)
    expect(estimationCb).toHaveBeenCalledWith(...testParams)
  })
})

describe('useTradingPanelLogger', () => {
  it('should call onLog action', () => {
    const logCb = vi.fn()
    const testParams: Parameters<CallbackConfig['onLog']> = [
      'eventName',
      {
        data: 'data',
      },
    ]

    const { result } = renderHook(
      () => {
        const action = useTradingPanelLogger()

        return {
          action,
        }
      },
      {
        wrapper: ({ children }) => (
          <TestProviders
            actions={{
              ...CALLBACK_CONFIG_MOCK,
              onLog: logCb,
            }}
          >
            {children}
          </TestProviders>
        ),
      },
    )

    expect(logCb).toHaveBeenCalledTimes(0)
    act(() => {
      result.current.action?.(...testParams)
    })
    expect(logCb).toHaveBeenCalledTimes(1)
    expect(logCb).toHaveBeenCalledWith(...testParams)
  })
})

describe('useOnSimulateTransaction', () => {
  it('should call onSimulateTransaction action', () => {
    const simulateCb = vi.fn()
    const testParams: Parameters<CallbackConfig['onSimulateTransaction']> = [
      {
        chainId: polygon.id,
        from: AddressZero,
        to: AddressZero,
        input: 'input',
        gas: 0,
        value: 'value',
      },
    ]

    const { result } = renderHook(
      () => {
        const action = useOnSimulateTransaction()

        return {
          action,
        }
      },
      {
        wrapper: ({ children }) => (
          <TestProviders
            actions={{
              ...CALLBACK_CONFIG_MOCK,
              onSimulateTransaction: simulateCb,
            }}
          >
            {children}
          </TestProviders>
        ),
      },
    )

    expect(simulateCb).toHaveBeenCalledTimes(0)
    act(() => {
      result.current.action?.(...testParams)
    })
    expect(simulateCb).toHaveBeenCalledTimes(1)
    expect(simulateCb).toHaveBeenCalledWith(...testParams)
  })
})

describe('useUpdatePoolConfig', () => {
  it('should update PoolConfig state', () => {
    const { result } = renderHook(() => {
      const setter = useUpdatePoolConfig()
      const state = useTradingPanelState()

      return {
        setter,
        state,
      }
    })

    const [address = AddressZero] = Object.keys(
      result.current.state.poolConfigMap,
    )
    const poolAddress = address as PoolConfig['address']

    expect(result.current.state.poolConfigMap?.[poolAddress]?.maintenance).toBe(
      undefined,
    )
    act(() => {
      result.current.setter({
        [poolAddress]: {
          maintenance: true,
          maintenanceDeposits: true,
          maintenanceWithdrawals: true,
        },
      })
    })
    expect(result.current.state.poolConfigMap?.[poolAddress]?.maintenance).toBe(
      true,
    )
    expect(
      result.current.state.poolConfigMap?.[poolAddress]?.maintenanceDeposits,
    ).toBe(true)
    expect(
      result.current.state.poolConfigMap?.[poolAddress]?.maintenanceWithdrawals,
    ).toBe(true)
  })

  it('should update PoolConfig state for multiple pools', () => {
    const { result } = renderHook(() => {
      const setter = useUpdatePoolConfig()
      const state = useTradingPanelState()

      return {
        setter,
        state,
      }
    })

    const poolConfigEntries = Object.entries(result.current.state.poolConfigMap)

    for (const [, config] of poolConfigEntries) {
      expect(config.maintenance).toBeFalsy()
      expect(config.maintenanceDeposits).toBeFalsy()
      expect(config.maintenanceWithdrawals).toBeFalsy()
    }

    act(() => {
      result.current.setter(
        poolConfigEntries.reduce(
          (acc, [address]) => ({
            ...acc,
            [address]: {
              maintenance: true,
              maintenanceDeposits: true,
              maintenanceWithdrawals: true,
            },
          }),
          {},
        ),
      )
    })

    for (const config of Object.values(result.current.state.poolConfigMap)) {
      expect(config.maintenance).toBe(true)
      expect(config.maintenanceDeposits).toBe(true)
      expect(config.maintenanceWithdrawals).toBe(true)
    }
  })
})
