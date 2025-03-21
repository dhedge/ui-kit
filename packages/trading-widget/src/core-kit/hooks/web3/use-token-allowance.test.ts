import { erc20Abi } from 'core-kit/abi'
import { DEFAULT_POLLING_INTERVAL, optimism } from 'core-kit/const'
import * as web3Hooks from 'core-kit/hooks/web3'

import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useTokenAllowance } from './use-token-allowance'

vi.mock('core-kit/hooks/web3', async () => {
  return {
    useReadContract: vi.fn(),
    useInvalidateOnBlock: vi.fn(),
  }
})

describe('useTokenAllowance', () => {
  it('should call allowance method on erc20 abi', () => {
    vi.mocked(web3Hooks.useReadContract).mockReturnValueOnce({
      queryKey: ['query'],
    } as unknown as ReturnType<typeof web3Hooks.useReadContract>)

    renderHook(() =>
      useTokenAllowance({
        tokenAddress: TEST_ADDRESS,
        ownerAddress: TEST_ADDRESS,
        spenderAddress: TEST_ADDRESS,
        chainId: optimism.id,
        skip: false,
      }),
    )

    expect(web3Hooks.useReadContract).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useReadContract).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'allowance',
        abi: erc20Abi,
        query: { enabled: true, refetchInterval: DEFAULT_POLLING_INTERVAL },
      }),
    )
  })
})
