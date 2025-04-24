import { expect } from 'vitest'

import * as poolMulticallHooks from 'core-kit/hooks/pool/multicall'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { usePoolDynamicContractData } from './use-pool-dynamic-contract-data'

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolsDynamic: vi.fn(),
}))

describe('usePoolDynamicContractData', () => {
  it('should call usePoolsDynamic', () => {
    vi.mocked(poolMulticallHooks.usePoolsDynamic).mockImplementation(
      () =>
        ({
          data: {},
        }) as unknown as ReturnType<typeof poolMulticallHooks.usePoolsDynamic>,
    )

    renderHook(() =>
      usePoolDynamicContractData({
        address: TEST_ADDRESS,
      }),
    )

    expect(vi.mocked(poolMulticallHooks.usePoolsDynamic)).toHaveBeenCalledTimes(
      1,
    )
  })
})
