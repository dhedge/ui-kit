import {
  GAS_ESTIMATION_ERROR,
  GAS_LIMIT_BUFFER_COEFF,
  MAX_GAS_LIMIT_MAP,
  optimism,
} from 'const'
import * as stateHooks from 'hooks/state'
import * as web3Hooks from 'hooks/web3'
import { act, renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'
import type { getContract } from 'utils'

import {
  checkArgsForTxOverrides,
  useContractFunction,
} from './use-contract-function'

const mocks = vi.hoisted(() => {
  return {
    utils: {
      getContractAbiById: vi.fn(),
      getContractAddressById: vi.fn(),
      getErrorMessage: vi.fn(),
      getContract: vi.fn(),
    },
  }
})

vi.mock('utils', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('utils')

  return {
    ...actual,
    getContractAbiById: mocks.utils.getContractAbiById,
    getContractAddressById: mocks.utils.getContractAddressById,
    getErrorMessage: mocks.utils.getErrorMessage,
    getContract: mocks.utils.getContract,
  }
})

describe('checkArgsForTxOverrides', () => {
  it('should extract value and gas values in last arg from args array', () => {
    const { transactionOverrides, argumentsWithoutOverrides } =
      checkArgsForTxOverrides(['arg1', { value: 'value' }])

    expect(transactionOverrides).toEqual({
      value: 'value',
    })
    expect(argumentsWithoutOverrides).toEqual(['arg1'])

    const { transactionOverrides: overrides, argumentsWithoutOverrides: args } =
      checkArgsForTxOverrides(['arg2', { gas: 'gas' }])

    expect(overrides).toEqual({
      gas: 'gas',
    })
    expect(args).toEqual(['arg2'])
  })

  it('should handle missing overrides in args array', () => {
    const { transactionOverrides, argumentsWithoutOverrides } =
      checkArgsForTxOverrides(['arg1', 'arg2'])

    expect(transactionOverrides).toEqual({})
    expect(argumentsWithoutOverrides).toEqual(['arg1', 'arg2'])
  })
})

describe('useContractFunction::estimate', () => {
  beforeEach(() => {
    vi.spyOn(web3Hooks, 'useAccount').mockImplementation(
      () =>
        ({
          account: TEST_ADDRESS,
        }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.spyOn(web3Hooks, 'useContractWrite').mockImplementation(
      () =>
        ({
          write: vi.fn(),
        }) as unknown as ReturnType<typeof web3Hooks.useContractWrite>,
    )
    vi.spyOn(web3Hooks, 'useNetwork').mockImplementation(
      () =>
        ({
          chainId: optimism.id,
          supportedChainId: optimism.id,
        }) as ReturnType<typeof web3Hooks.useNetwork>,
    )
    vi.spyOn(web3Hooks, 'useWalletClient').mockImplementation(
      () =>
        'walletClient' as unknown as ReturnType<
          typeof web3Hooks.useWalletClient
        >,
    )
    vi.spyOn(stateHooks, 'useOnSimulateTransaction').mockImplementation(() =>
      vi.fn(),
    )
  })

  it('should call [functionName] method on contract.estimateGas', async () => {
    const functionName = 'functionName'
    const args = ['arg1', 'arg2']
    const functionNameMock = vi.fn()

    mocks.utils.getContract.mockImplementationOnce(
      () =>
        ({
          estimateGas: {
            [functionName]: functionNameMock,
          },
        }) as unknown as ReturnType<typeof getContract>,
    )

    const { result } = renderHook(() =>
      useContractFunction({
        functionName,
        contractId: 'easySwapper',
      }),
    )

    await act(async () => result.current.estimate(...args))

    expect(functionNameMock).toHaveBeenCalledTimes(1)
    expect(functionNameMock).toHaveBeenCalledWith(args, {
      account: TEST_ADDRESS,
      value: undefined,
      gas: undefined,
    })
  })

  it('should call [functionName] method with custom value and gas overrides', async () => {
    const functionName = 'functionName'
    const overrides = { value: 'value', gas: 'gas' }
    const args = ['arg1', 'arg2', overrides]
    const functionNameMock = vi.fn()

    mocks.utils.getContract.mockImplementation(
      () =>
        ({
          estimateGas: {
            [functionName]: functionNameMock,
          },
        }) as unknown as ReturnType<typeof getContract>,
    )

    const { result } = renderHook(() =>
      useContractFunction({
        functionName,
        contractId: 'easySwapper',
      }),
    )

    await act(async () => result.current.estimate(...args))

    const { argumentsWithoutOverrides, transactionOverrides } =
      checkArgsForTxOverrides(args)

    expect(functionNameMock).toHaveBeenCalledTimes(1)
    expect(functionNameMock).toHaveBeenCalledWith(argumentsWithoutOverrides, {
      account: TEST_ADDRESS,
      value: transactionOverrides.value,
      gas: transactionOverrides.gas,
    })
  })

  it('should return zero value and default gas estimation error for nullish estimation', async () => {
    const functionName = 'functionName'
    const args = ['arg1', 'arg2']
    const estimation = null
    const functionNameMock = vi.fn(() => estimation)

    mocks.utils.getContract.mockImplementation(
      () =>
        ({
          estimateGas: {
            [functionName]: functionNameMock,
          },
        }) as unknown as ReturnType<typeof getContract>,
    )

    const { result } = renderHook(() =>
      useContractFunction({
        functionName,
        contractId: 'easySwapper',
      }),
    )

    const res = await act(async () => result.current.estimate(...args))

    expect(res).toEqual({
      value: 0n,
      error: GAS_ESTIMATION_ERROR,
    })
  })

  it('should return bufferedGasLimit value', async () => {
    const functionName = 'functionName'
    const args = ['arg1', 'arg2']
    const estimation = BigInt(1)
    const functionNameMock = vi.fn(() => estimation)

    mocks.utils.getContract.mockImplementation(
      () =>
        ({
          estimateGas: {
            [functionName]: functionNameMock,
          },
        }) as unknown as ReturnType<typeof getContract>,
    )

    const { result } = renderHook(() =>
      useContractFunction({
        functionName,
        contractId: 'easySwapper',
      }),
    )

    const res = await act(async () => result.current.estimate(...args))

    expect(res).toEqual({
      value: BigInt(Math.round(Number(estimation) * GAS_LIMIT_BUFFER_COEFF)),
      error: '',
    })
  })

  it('should return maxGasLimit value', async () => {
    const functionName = 'functionName'
    const args = ['arg1', 'arg2']
    const estimation = BigInt((MAX_GAS_LIMIT_MAP[optimism.id] ?? 0) + 1)
    const functionNameMock = vi.fn(() => estimation)

    mocks.utils.getContract.mockImplementation(
      () =>
        ({
          estimateGas: {
            [functionName]: functionNameMock,
          },
        }) as unknown as ReturnType<typeof getContract>,
    )

    const { result } = renderHook(() =>
      useContractFunction({
        functionName,
        contractId: 'easySwapper',
      }),
    )

    const res = await act(async () => result.current.estimate(...args))

    expect(res).toEqual({
      value: BigInt(MAX_GAS_LIMIT_MAP[optimism.id] ?? 0),
      error: '',
    })
  })

  it('should return zero value and error message', async () => {
    const functionName = 'functionName'
    const args = ['arg1', 'arg2']
    const errorMessage = 'errorMessage'

    mocks.utils.getContract.mockImplementation(
      () =>
        ({
          estimateGas: {
            [functionName]: () => {
              throw { error: { data: { message: errorMessage } } }
            },
          },
        }) as unknown as ReturnType<typeof getContract>,
    )

    const { result } = renderHook(() =>
      useContractFunction({
        functionName,
        contractId: 'easySwapper',
      }),
    )

    const res = await act(async () => result.current.estimate(...args))

    expect(res).toEqual({
      value: 0n,
      error: errorMessage,
    })
  })
})

describe('useContractFunction::send', () => {
  const functionName = 'functionName'

  beforeEach(() => {
    vi.spyOn(web3Hooks, 'useAccount').mockImplementation(
      () =>
        ({
          account: TEST_ADDRESS,
        }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.spyOn(web3Hooks, 'useNetwork').mockImplementation(
      () =>
        ({
          chainId: optimism.id,
          supportedChainId: optimism.id,
        }) as ReturnType<typeof web3Hooks.useNetwork>,
    )
    vi.spyOn(web3Hooks, 'useWalletClient').mockImplementation(
      () =>
        'walletClient' as unknown as ReturnType<
          typeof web3Hooks.useWalletClient
        >,
    )
    vi.spyOn(stateHooks, 'useOnSimulateTransaction').mockImplementation(() =>
      vi.fn(),
    )
  })

  it('should call contract write method directly for gas override', async () => {
    const args = ['arg1', 'arg2', { value: 'value', gas: 'gas' }]
    const writeMock = vi.fn()
    const estimateGasMock = vi.fn()

    mocks.utils.getContract.mockImplementation(
      () =>
        ({
          estimateGas: {
            [functionName]: estimateGasMock,
          },
          populateTransaction: {
            [functionName]: vi.fn(),
          },
        }) as unknown as ReturnType<typeof getContract>,
    )
    vi.spyOn(web3Hooks, 'useContractWrite').mockImplementation(
      () =>
        ({
          write: writeMock,
        }) as unknown as ReturnType<typeof web3Hooks.useContractWrite>,
    )

    const { result } = renderHook(() =>
      useContractFunction({
        functionName,
        contractId: 'easySwapper',
      }),
    )

    await act(async () => result.current.send(...args))

    const { argumentsWithoutOverrides, transactionOverrides } =
      checkArgsForTxOverrides(args)

    expect(estimateGasMock).toHaveBeenCalledTimes(0)
    expect(writeMock).toHaveBeenCalledTimes(1)
    expect(writeMock).toHaveBeenCalledWith({
      args: argumentsWithoutOverrides,
      ...transactionOverrides,
    })
  })

  it('should call estimate before write', async () => {
    const args = ['arg1', 'arg2']
    const writeMock = vi.fn()
    const estimateGasMock = vi.fn(() => BigInt(1))

    mocks.utils.getContract.mockImplementation(
      () =>
        ({
          estimateGas: {
            [functionName]: estimateGasMock,
          },
          populateTransaction: {
            [functionName]: vi.fn(),
          },
        }) as unknown as ReturnType<typeof getContract>,
    )
    vi.spyOn(web3Hooks, 'useContractWrite').mockImplementation(
      () =>
        ({
          write: writeMock,
        }) as unknown as ReturnType<typeof web3Hooks.useContractWrite>,
    )

    const { result } = renderHook(() =>
      useContractFunction({
        functionName,
        contractId: 'easySwapper',
      }),
    )

    await act(async () => result.current.send(...args))

    expect(estimateGasMock).toHaveBeenCalledTimes(1)
  })

  it('should throw EstimationError', async () => {
    const args = ['arg1', 'arg2']
    const writeMock = vi.fn()
    const estimateGasMock = vi.fn(() => undefined)

    mocks.utils.getContract.mockImplementation(
      () =>
        ({
          estimateGas: {
            [functionName]: estimateGasMock,
          },
          populateTransaction: {
            [functionName]: vi.fn(),
          },
        }) as unknown as ReturnType<typeof getContract>,
    )
    vi.spyOn(web3Hooks, 'useContractWrite').mockImplementation(
      () =>
        ({
          write: writeMock,
        }) as unknown as ReturnType<typeof web3Hooks.useContractWrite>,
    )

    const { result } = renderHook(() =>
      useContractFunction({
        functionName,
        contractId: 'easySwapper',
      }),
    )
    expect.assertions(2)

    await expect(result.current.send(...args)).rejects.toThrow(
      'Gas estimate error occurred',
    )
    await expect(result.current.send(...args)).rejects.toEqual(
      expect.objectContaining({ txArgs: args, functionName }),
    )
  })

  // TODO: add test after logic will be added
  // it('should populate and simulate tx after failed estimation', async () => {
  //   const args = ['arg1', 'arg2']
  //   const unsignedTx = {
  //     from: 'from',
  //     to: 'to',
  //     data: 'data',
  //   }
  //   const writeMock = vi.fn()
  //   const populateMock = vi.fn(() => unsignedTx)
  //   const simulateMock = vi.fn()
  //   const estimateGasMock = vi.fn(() => undefined)
  //
  //   mocks.utils.getContract.mockImplementation(
  //     () =>
  //       ({
  //         estimateGas: {
  //           [functionName]: estimateGasMock,
  //         },
  //         populateTransaction: {
  //           [functionName]: populateMock,
  //         },
  //       }) as unknown as ReturnType<typeof getContract>,
  //   )
  //   vi.spyOn(web3Hooks, 'useContractWrite').mockImplementation(
  //     () =>
  //       ({
  //         write: writeMock,
  //       }) as unknown as ReturnType<typeof web3Hooks.useContractWrite>,
  //   )
  //   vi.spyOn(stateHooks, 'useOnSimulateTransaction').mockImplementation(
  //     () => simulateMock,
  //   )
  //
  //   const { result } = renderHook(() =>
  //     useContractFunction({
  //       functionName,
  //       contractId: 'easySwapper',
  //     }),
  //   )
  //
  //   const { argumentsWithoutOverrides, transactionOverrides } =
  //     checkArgsForTxOverrides(args)
  //
  //   expect.assertions(4)
  //
  //   try {
  //     await act(async () => result.current.send(...args))
  //   } catch {
  //     expect(populateMock).toHaveBeenCalledTimes(1)
  //     expect(populateMock).toHaveBeenCalledWith(...argumentsWithoutOverrides, {
  //       from: TEST_ADDRESS,
  //       value: transactionOverrides.value,
  //       gasLimit: transactionOverrides.gasLimit,
  //     })
  //     expect(simulateMock).toHaveBeenCalledTimes(1)
  //     expect(simulateMock).toHaveBeenCalledWith({
  //       chainId: optimism.id,
  //       from: unsignedTx.from,
  //       to: unsignedTx.to,
  //       input: unsignedTx.data,
  //       gas: MAX_GAS_LIMIT_MAP[optimism.id] ?? 0,
  //       value: transactionOverrides.value,
  //     })
  //   }
  // })

  // it(
  //   'should throw simulation timeout error for long simulation request',
  //   async () => {
  //     const args = ['arg1', 'arg2']
  //     const unsignedTx = {
  //       from: 'from',
  //       to: 'to',
  //       data: 'data',
  //     }
  //     const writeMock = vi.fn()
  //     const populateMock = vi.fn(() => unsignedTx)
  //     const simulateMock = vi.fn().mockImplementation(
  //       () =>
  //         new Promise((resolve) =>
  //           setTimeout(resolve, DEFAULT_PROMISE_TIMEOUT_MS + 100, {
  //             data: {
  //               link: 'link',
  //               simulation: { status: true, error_message: 'error_message' },
  //             },
  //             error: undefined,
  //           }),
  //         ),
  //     )
  //     const estimateGasMock = vi.fn(() => undefined)
  //
  //     mocks.utils.getContract.mockImplementation(
  //       () =>
  //         ({
  //           estimateGas: {
  //             [functionName]: estimateGasMock,
  //           },
  //           populateTransaction: {
  //             [functionName]: populateMock,
  //           },
  //         }) as unknown as ReturnType<typeof getContract>,
  //     )
  //     vi.spyOn(web3Hooks, 'useContractWrite').mockImplementation(
  //       () =>
  //         ({
  //           write: writeMock,
  //         }) as unknown as ReturnType<typeof web3Hooks.useContractWrite>,
  //     )
  //     vi.spyOn(stateHooks, 'useOnSimulateTransaction').mockImplementation(
  //       () => simulateMock,
  //     )
  //
  //     const { result } = renderHook(() =>
  //       useContractFunction({
  //         functionName,
  //         contractId: 'easySwapper',
  //       }),
  //     )
  //
  //     await expect(result.current.send(...args)).rejects.toEqual(
  //       expect.objectContaining({ message: SIMULATION_TIMEOUT_ERROR }),
  //     )
  //   },
  //   DEFAULT_PROMISE_TIMEOUT_MS + 1000,
  // )

  it('should call write method after successful estimation', async () => {
    const args = ['arg1', 'arg2']
    const estimation = BigInt(1)
    const writeMock = vi.fn()
    const estimateGasMock = vi.fn(() => estimation)

    mocks.utils.getContract.mockImplementation(
      () =>
        ({
          estimateGas: {
            [functionName]: estimateGasMock,
          },
          populateTransaction: {
            [functionName]: vi.fn(),
          },
        }) as unknown as ReturnType<typeof getContract>,
    )
    vi.spyOn(web3Hooks, 'useContractWrite').mockImplementation(
      () =>
        ({
          write: writeMock,
        }) as unknown as ReturnType<typeof web3Hooks.useContractWrite>,
    )

    const { result } = renderHook(() =>
      useContractFunction({
        functionName,
        contractId: 'easySwapper',
      }),
    )

    await act(async () => result.current.send(...args))

    const { argumentsWithoutOverrides, transactionOverrides } =
      checkArgsForTxOverrides(args)

    expect(estimateGasMock).toHaveBeenCalledTimes(1)
    expect(writeMock).toHaveBeenCalledTimes(1)
    expect(writeMock).toHaveBeenCalledWith({
      args: argumentsWithoutOverrides,
      ...transactionOverrides,
      gas: BigInt(Math.round(Number(estimation) * GAS_LIMIT_BUFFER_COEFF)),
    })
  })
})
