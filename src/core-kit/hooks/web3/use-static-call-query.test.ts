import { waitFor } from '@testing-library/dom'

import type { Abi } from 'viem'
import { expect, vi } from 'vitest'

import { usePublicClient } from 'wagmi'

import { optimism } from 'core-kit/const'

import { useStaticCallQuery } from 'core-kit/hooks/web3/use-static-call-query'
import { getContractAbiById } from 'core-kit/utils'
import { renderHook } from 'tests/test-utils'

const mocks = vi.hoisted(() => {
  return {
    utils: {
      getContractAbiById: vi.fn(),
      getContractAddressById: vi.fn(),
    },
    wagmi: {
      usePublicClient: vi.fn(),
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
  }
})

vi.mock('wagmi', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('wagmi')

  return {
    ...actual,
    usePublicClient: mocks.wagmi.usePublicClient,
  }
})

describe('useStaticCallQuery', () => {
  it('should return the result when all conditions are met', async () => {
    const mockCallStaticFn = vi.fn()
    const address = '0x123'
    const functionName = 'sampleFunctionName'
    const args = ['arg1', 'arg2']
    const expectedResult = '1122334455'
    mockCallStaticFn.mockImplementation(() => ({ result: expectedResult }))
    mocks.wagmi.usePublicClient.mockImplementationOnce(() => ({
      simulateContract: mockCallStaticFn,
    }))

    const { result, rerender } = renderHook(() =>
      useStaticCallQuery({
        disabled: false,
        address,
        abi: getContractAbiById('easySwapperV2'),
        args,
        chainId: optimism.id,
        functionName: functionName,
      }),
    )

    expect(mocks.utils.getContractAddressById).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(mockCallStaticFn).toHaveBeenCalledWith({
        address,
        abi: getContractAbiById('easySwapperV2'),
        functionName,
        args,
      })
    })

    await waitFor(() => !result.current.isFetching)

    expect(result.current.data).toBe(expectedResult)
    expect(result.current.error).toBe(null)

    rerender()
    await waitFor(() => {
      expect(mockCallStaticFn).toHaveBeenCalledTimes(1)
    })
    expect(result.current.data).toBe(expectedResult)
    expect(result.current.error).toBe(null)
  })

  it('should return undefined if disabled is true', async () => {
    const mockCallStaticFn = vi.fn()
    const testContractAddress = '0x1'
    const testAbi = [{ abi: 'test' }]
    const functionName = 'testFunctionName'

    mocks.wagmi.usePublicClient.mockImplementationOnce(() => ({
      callStatic: mockCallStaticFn,
    }))

    const { result } = renderHook(() =>
      useStaticCallQuery({
        disabled: true,
        address: testContractAddress,
        abi: testAbi as unknown as Abi,
        args: [],
        chainId: optimism.id,
        functionName,
      }),
    )
    expect(usePublicClient).toHaveBeenCalledTimes(1)
    expect(usePublicClient).toHaveBeenCalledWith({ chainId: optimism.id })
    await waitFor(() => {
      expect(mockCallStaticFn).not.toHaveBeenCalled()
      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBe(null)
    })
  })
})
