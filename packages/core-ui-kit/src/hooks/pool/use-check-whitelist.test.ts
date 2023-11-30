import { PoolLogicAbi } from 'abi'
import { AddressZero, optimism } from 'const'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import { useCheckWhitelist } from './use-check-whitelist'

vi.mock('hooks/web3', () => ({
  useAccount: vi.fn(),
  useContractRead: vi.fn(),
  useContractReadErrorLogging: vi.fn(),
}))

describe('useCheckWhitelist', () => {
  it('should call isMemberAllowed method on PoolLogicAbi', async () => {
    const isMemberAllowed = true

    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({
          account: TEST_ADDRESS,
        }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(web3Hooks.useContractRead).mockImplementation(
      () =>
        ({
          data: [isMemberAllowed],
        }) as ReturnType<typeof web3Hooks.useContractRead>,
    )

    const { result } = renderHook(() =>
      useCheckWhitelist({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(vi.mocked(web3Hooks.useContractRead)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useContractRead)).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'isMemberAllowed',
        abi: PoolLogicAbi,
      }),
    )
    expect(result.current).toBe(isMemberAllowed)
  })

  it('should return false for disconnected account', async () => {
    const account = undefined
    const isMemberAllowed = true

    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({
          account,
        }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(web3Hooks.useContractRead).mockImplementation(
      () =>
        ({
          data: [isMemberAllowed],
        }) as ReturnType<typeof web3Hooks.useContractRead>,
    )

    const { result } = renderHook(() =>
      useCheckWhitelist({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(vi.mocked(web3Hooks.useContractRead)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useContractRead)).toHaveBeenCalledWith(
      expect.objectContaining({
        args: [AddressZero],
      }),
    )
    expect(result.current).toBe(false)
  })
})
