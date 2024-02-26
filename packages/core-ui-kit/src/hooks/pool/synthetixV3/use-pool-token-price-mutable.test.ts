import { expect } from 'vitest'

import { PoolLogicAbi } from 'abi'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'

import { TEST_ADDRESS } from 'tests/mocks'

import { usePoolTokenPriceMutable } from './use-pool-token-price-mutable'
import { useTotalFundValueMutable } from './use-total-funds-value-mutable'

vi.mock('hooks/web3', () => ({
  useReadContracts: vi.fn(),
  useReadContract: vi.fn(),
}))
vi.mock('./use-total-funds-value-mutable', () => ({
  useTotalFundValueMutable: vi.fn(),
}))

describe('usePoolTokenPriceMutable', () => {
  it('should calculate token price based on totalSupply and totalFundValue', () => {
    const vaultManagerLogicAddress = '0x123'
    const totalSupply = BigInt(100)
    const managerFee = BigInt(10)
    const chainId = 10
    vi.mocked(web3Hooks.useReadContracts).mockImplementationOnce(
      () =>
        ({
          data: [{ result: vaultManagerLogicAddress }, { result: totalSupply }],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )
    vi.mocked(web3Hooks.useReadContract).mockImplementationOnce(
      () =>
        ({
          data: managerFee,
        }) as ReturnType<typeof web3Hooks.useReadContract>,
    )
    vi.mocked(useTotalFundValueMutable).mockImplementationOnce(() => '110')

    const { result } = renderHook(() =>
      usePoolTokenPriceMutable({
        address: TEST_ADDRESS,
        chainId,
        disabled: false,
      }),
    )

    expect(web3Hooks.useReadContracts).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({
          enabled: true,
        }),
        contracts: [
          expect.objectContaining({
            abi: PoolLogicAbi,
            functionName: 'poolManagerLogic',
            chainId,
          }),
          expect.objectContaining({
            abi: PoolLogicAbi,
            functionName: 'totalSupply',
            chainId,
          }),
        ],
      }),
    )
    expect(web3Hooks.useReadContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: TEST_ADDRESS,
        abi: PoolLogicAbi,
        functionName: 'calculateAvailableManagerFee',
        chainId,
        args: [BigInt('110')],
        query: expect.objectContaining({
          enabled: true,
        }),
      }),
    )
    expect(useTotalFundValueMutable).toHaveBeenCalledWith({
      vaultManagerLogicAddress,
      chainId,
      disabled: false,
    })
    expect(result.current).toEqual('1000000000000000000')
  })
})
