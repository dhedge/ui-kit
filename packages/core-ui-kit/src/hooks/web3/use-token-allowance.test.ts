import { erc20Abi } from 'abi'
import { optimism } from 'const'
import { renderHook } from 'test-utils'

import { TEST_ADDRESS } from 'tests/mocks'

import { useTokenAllowance } from './use-token-allowance'

const mocks = vi.hoisted(() => {
  return {
    useReadContract: vi.fn(),
  }
})

vi.mock('wagmi', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('wagmi')

  return {
    ...actual,
    useReadContract: mocks.useReadContract,
  }
})

describe('useTokenAllowance', () => {
  it('should call allowance method on erc20 abi', () => {
    renderHook(() =>
      useTokenAllowance(
        TEST_ADDRESS,
        TEST_ADDRESS,
        TEST_ADDRESS,
        optimism.id,
        false,
      ),
    )

    expect(mocks.useReadContract).toHaveBeenCalledTimes(1)
    expect(mocks.useReadContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: 'allowance', abi: erc20Abi }),
    )
  })
})
