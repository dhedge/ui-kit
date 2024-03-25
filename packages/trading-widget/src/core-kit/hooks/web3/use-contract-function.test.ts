import { expect } from 'vitest'

import {
  GAS_ESTIMATION_ERROR,
  GAS_LIMIT_BUFFER_COEFF,
  MAX_GAS_LIMIT_MAP,
  optimism,
} from 'core-kit/const'
import * as stateHooks from 'core-kit/hooks/state'
import * as web3Hooks from 'core-kit/hooks/web3'
import { TEST_ADDRESS } from 'tests/mocks'
import { act, renderHook } from 'tests/test-utils'

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
    },
  }
})

vi.mock('core-kit/utils', async () => {
  const actual =
    await vi.importActual<Record<string, unknown>>('core-kit/utils')

  return {
    ...actual,
    getContractAbiById: mocks.utils.getContractAbiById,
    getContractAddressById: mocks.utils.getContractAddressById,
    getErrorMessage: mocks.utils.getErrorMessage,
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
    vi.spyOn(web3Hooks, 'useWriteContract').mockImplementation(
      () =>
        ({
          write: vi.fn(),
        }) as unknown as ReturnType<typeof web3Hooks.useWriteContract>,
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
    const estimateFnMock = vi.fn()

    vi.spyOn(web3Hooks, 'usePublicClient').mockReturnValueOnce({
      estimateContractGas: estimateFnMock,
    } as unknown as ReturnType<typeof web3Hooks.usePublicClient>)

    const { result } = renderHook(() =>
      useContractFunction({
        functionName,
        contractId: 'easySwapper',
        dynamicContractAddress: '0x',
      }),
    )

    await act(async () => result.current.estimate(...args))

    expect(estimateFnMock).toHaveBeenCalledTimes(1)
    expect(estimateFnMock).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName,
        address: '0x',
        args,
        account: TEST_ADDRESS,
      }),
    )
  })

  it('should call [functionName] method with custom value and gas overrides', async () => {
    const functionName = 'functionName'
    const overrides = { value: 'value', gas: 'gas' }
    const args = ['arg1', 'arg2', overrides]

    const estimateFnMock = vi.fn()

    vi.spyOn(web3Hooks, 'usePublicClient').mockReturnValueOnce({
      estimateContractGas: estimateFnMock,
    } as unknown as ReturnType<typeof web3Hooks.usePublicClient>)

    const { result } = renderHook(() =>
      useContractFunction({
        functionName,
        contractId: 'easySwapper',
      }),
    )

    await act(async () => result.current.estimate(...args))

    const { argumentsWithoutOverrides, transactionOverrides } =
      checkArgsForTxOverrides(args)

    expect(estimateFnMock).toHaveBeenCalledTimes(1)
    expect(estimateFnMock).toHaveBeenCalledWith(
      expect.objectContaining({
        args: argumentsWithoutOverrides,
        account: TEST_ADDRESS,
        value: transactionOverrides.value,
        gas: transactionOverrides.gas,
      }),
    )
  })

  it('should return zero value and default gas estimation error for nullish estimation', async () => {
    const functionName = 'functionName'
    const args = ['arg1', 'arg2']
    const estimateFnMock = vi.fn()

    vi.spyOn(web3Hooks, 'usePublicClient').mockReturnValueOnce({
      estimateContractGas: estimateFnMock.mockReturnValueOnce(BigInt(0)),
    } as unknown as ReturnType<typeof web3Hooks.usePublicClient>)

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

    estimateFnMock.mockReturnValueOnce(undefined)
    const newResult = await act(async () => result.current.estimate(...args))

    expect(newResult).toEqual({
      value: 0n,
      error: GAS_ESTIMATION_ERROR,
    })
  })

  it('should return bufferedGasLimit value', async () => {
    const functionName = 'functionName'
    const args = ['arg1', 'arg2']
    const estimation = BigInt(1)
    const estimateFnMock = vi.fn()

    vi.spyOn(web3Hooks, 'usePublicClient').mockReturnValueOnce({
      estimateContractGas: estimateFnMock.mockReturnValueOnce(estimation),
    } as unknown as ReturnType<typeof web3Hooks.usePublicClient>)

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
    const estimateFnMock = vi.fn()

    vi.spyOn(web3Hooks, 'usePublicClient').mockReturnValueOnce({
      estimateContractGas: estimateFnMock.mockReturnValueOnce(estimation),
    } as unknown as ReturnType<typeof web3Hooks.usePublicClient>)

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
    const estimateFnMock = vi.fn()

    vi.spyOn(web3Hooks, 'usePublicClient').mockReturnValueOnce({
      estimateContractGas: estimateFnMock.mockReturnValueOnce(undefined),
    } as unknown as ReturnType<typeof web3Hooks.usePublicClient>)

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
    const estimateFnMock = vi.fn()

    vi.spyOn(web3Hooks, 'usePublicClient').mockReturnValueOnce({
      estimateContractGas: estimateFnMock,
    } as unknown as ReturnType<typeof web3Hooks.usePublicClient>)

    vi.spyOn(web3Hooks, 'useWriteContract').mockImplementation(
      () =>
        ({
          writeContract: writeMock,
        }) as unknown as ReturnType<typeof web3Hooks.useWriteContract>,
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

    expect(estimateFnMock).toHaveBeenCalledTimes(0)
    expect(writeMock).toHaveBeenCalledTimes(1)
    expect(writeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        args: argumentsWithoutOverrides,
        ...transactionOverrides,
        functionName,
        chainId: optimism.id,
      }),
    )
  })

  it('should call estimate before write', async () => {
    const args = ['arg1', 'arg2']
    const writeMock = vi.fn()
    const estimateFnMock = vi.fn(() => BigInt(1))

    vi.spyOn(web3Hooks, 'usePublicClient').mockReturnValueOnce({
      estimateContractGas: estimateFnMock,
    } as unknown as ReturnType<typeof web3Hooks.usePublicClient>)
    vi.spyOn(web3Hooks, 'useWriteContract').mockImplementation(
      () =>
        ({
          writeContract: writeMock,
        }) as unknown as ReturnType<typeof web3Hooks.useWriteContract>,
    )

    const { result } = renderHook(() =>
      useContractFunction({
        functionName,
        contractId: 'easySwapper',
      }),
    )

    await act(async () => result.current.send(...args))

    expect(estimateFnMock).toHaveBeenCalledTimes(1)
  })

  it('should throw EstimationError', async () => {
    const args = ['arg1', 'arg2']
    const writeMock = vi.fn()
    const estimateFnMock = vi.fn(() => undefined)

    vi.spyOn(web3Hooks, 'usePublicClient').mockReturnValueOnce({
      estimateContractGas: estimateFnMock,
    } as unknown as ReturnType<typeof web3Hooks.usePublicClient>)
    vi.spyOn(web3Hooks, 'useWriteContract').mockImplementation(
      () =>
        ({
          writeContract: writeMock,
        }) as unknown as ReturnType<typeof web3Hooks.useWriteContract>,
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
  //   vi.spyOn(web3Hooks, 'useWriteContract').mockImplementation(
  //     () =>
  //       ({
  //         write: writeMock,
  //       }) as unknown as ReturnType<typeof web3Hooks.useWriteContract>,
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
  //     vi.spyOn(web3Hooks, 'useWriteContract').mockImplementation(
  //       () =>
  //         ({
  //           write: writeMock,
  //         }) as unknown as ReturnType<typeof web3Hooks.useWriteContract>,
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
    const estimateFnMock = vi.fn(() => estimation)

    vi.spyOn(web3Hooks, 'usePublicClient').mockReturnValueOnce({
      estimateContractGas: estimateFnMock,
    } as unknown as ReturnType<typeof web3Hooks.usePublicClient>)
    vi.spyOn(web3Hooks, 'useWriteContract').mockImplementation(
      () =>
        ({
          writeContract: writeMock,
        }) as unknown as ReturnType<typeof web3Hooks.useWriteContract>,
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

    expect(estimateFnMock).toHaveBeenCalledTimes(1)
    expect(writeMock).toHaveBeenCalledTimes(1)
    expect(writeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        args: argumentsWithoutOverrides,
        ...transactionOverrides,
        gas: BigInt(Math.round(Number(estimation) * GAS_LIMIT_BUFFER_COEFF)),
      }),
    )
  })
})
