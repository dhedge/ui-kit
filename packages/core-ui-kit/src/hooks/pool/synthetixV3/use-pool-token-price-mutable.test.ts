import { expect } from 'vitest'

import { PoolLogicAbi } from 'abi'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'

import { TEST_ADDRESS } from 'tests/mocks'

import { usePoolTokenPriceMutable } from './use-pool-token-price-mutable'
import { useTotalFundValueMutable } from './use-total-funds-value-mutable'

vi.mock('hooks/web3', () => ({
  useContractReads: vi.fn(),
}))
vi.mock('./use-total-funds-value-mutable', () => ({
  useTotalFundValueMutable: vi.fn(),
}))

describe('usePoolTokenPriceMutable', () => {
  it('should calculate token price based on totalSupply and totalFundValue', () => {
    const vaultManagerLogicAddress = '0x123'
    const totalSupply = BigInt(100)
    const chainId = 10
    vi.mocked(web3Hooks.useContractReads).mockImplementationOnce(
      () =>
        ({
          data: [{ result: vaultManagerLogicAddress }, { result: totalSupply }],
        }) as ReturnType<typeof web3Hooks.useContractReads>,
    )
    vi.mocked(useTotalFundValueMutable).mockImplementationOnce(() => '100')

    const { result } = renderHook(() =>
      usePoolTokenPriceMutable({
        address: TEST_ADDRESS,
        chainId,
        disabled: false,
      }),
    )

    expect(web3Hooks.useContractReads).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
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
    expect(useTotalFundValueMutable).toHaveBeenCalledWith({
      vaultManagerLogicAddress,
      chainId,
      disabled: false,
    })
    expect(result.current).toEqual(1000000000000000000n)
  })
})
