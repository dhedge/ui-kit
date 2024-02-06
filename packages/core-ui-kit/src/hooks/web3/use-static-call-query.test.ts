import { waitFor } from '@testing-library/dom'
import { expect, vi } from 'vitest'

import { usePublicClient } from 'wagmi'

import { optimism } from 'const'
import { useNetwork } from 'hooks/web3'
import { renderHook } from 'test-utils'

import { useStaticCallQuery } from './use-static-call-query'
import { getContractAbiById } from '../../utils'

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

vi.mock('utils', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('utils')

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

vi.mock('hooks/web3', () => ({
  useNetwork: vi.fn().mockImplementation(() => ({
    supportedChainId: optimism.id,
  })),
}))

describe('useStaticCallQuery', () => {
  it('should return the result when all conditions are met', async () => {
    const mockCallStaticFn = vi.fn()
    const dynamicContractAddress = '0x123'
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
        contractId: 'synthetixV3AssetGuard',
        dynamicContractAddress,
        args,
        chainId: optimism.id,
        functionName: functionName,
      }),
    )

    expect(mocks.utils.getContractAddressById).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(mockCallStaticFn).toHaveBeenCalledWith({
        address: dynamicContractAddress,
        abi: getContractAbiById('synthetixV3AssetGuard'),
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
    mocks.utils.getContractAddressById.mockImplementationOnce(
      () => testContractAddress,
    )
    mocks.utils.getContractAbiById.mockImplementationOnce(() => testAbi)

    const { result } = renderHook(() =>
      useStaticCallQuery({
        disabled: true,
        contractId: 'synthetixV3AssetGuard',
        args: [],
        chainId: optimism.id,
        functionName,
      }),
    )
    expect(usePublicClient).toHaveBeenCalledTimes(1)
    expect(usePublicClient).toHaveBeenCalledWith({ chainId: optimism.id })
    expect(useNetwork).toHaveBeenCalledTimes(1)
    expect(mocks.utils.getContractAddressById).toHaveBeenCalledTimes(1)
    expect(mocks.utils.getContractAddressById).toHaveBeenCalledWith(
      'synthetixV3AssetGuard',
      optimism.id,
    )
    await waitFor(() => {
      expect(mockCallStaticFn).not.toHaveBeenCalled()
      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBe(null)
    })
  })
})
