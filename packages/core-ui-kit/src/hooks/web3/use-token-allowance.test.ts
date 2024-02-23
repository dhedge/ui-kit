import { erc20Abi } from 'abi'
import { DEFAULT_POLLING_INTERVAL, optimism } from 'const'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'

import { TEST_ADDRESS } from 'tests/mocks'

import { useTokenAllowance } from './use-token-allowance'

vi.mock('hooks/web3', async () => {
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
      useTokenAllowance(
        TEST_ADDRESS,
        TEST_ADDRESS,
        TEST_ADDRESS,
        optimism.id,
        false,
      ),
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
