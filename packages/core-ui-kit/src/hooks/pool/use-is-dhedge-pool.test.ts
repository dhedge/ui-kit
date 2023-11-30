import { PoolFactoryAbi } from 'abi'
import { optimism } from 'const'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import { useIsDhedgePool } from './use-is-dhedge-pool'

vi.mock('hooks/web3', () => ({
  useContractReads: vi.fn(),
  useContractReadsErrorLogging: vi.fn(),
}))

describe('useIsDhedgePool', () => {
  it('should call isPool method on PoolFactoryAbi', async () => {
    const isPool = true

    vi.mocked(web3Hooks.useContractReads).mockImplementation(
      () =>
        ({
          data: [{ result: isPool }],
        }) as ReturnType<typeof web3Hooks.useContractReads>,
    )

    const { result } = renderHook(() =>
      useIsDhedgePool({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(vi.mocked(web3Hooks.useContractReads)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useContractReads)).toHaveBeenCalledWith(
      expect.objectContaining({
        contracts: expect.arrayContaining([
          expect.objectContaining({
            functionName: 'isPool',
            abi: PoolFactoryAbi,
            chainId: optimism.id,
            args: [TEST_ADDRESS],
          }),
        ]),
        enabled: true,
        staleTime: Infinity,
      }),
    )
    expect(result.current).toBe(isPool)
  })

  it('should not call isPool method when address is not passed', async () => {
    vi.mocked(web3Hooks.useContractReads).mockImplementation(
      () =>
        ({
          data: [],
        }) as ReturnType<typeof web3Hooks.useContractReads>,
    )

    renderHook(() => useIsDhedgePool({ chainId: optimism.id }))

    expect(vi.mocked(web3Hooks.useContractReads)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useContractReads)).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    )
  })
})
