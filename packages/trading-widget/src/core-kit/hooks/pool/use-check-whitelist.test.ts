import { optimism } from 'core-kit/const'
import * as poolMulticallHooks from 'core-kit/hooks/pool/multicall'
import * as web3Hooks from 'core-kit/hooks/web3'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useCheckWhitelist } from './use-check-whitelist'

vi.mock('core-kit/hooks/web3', () => ({
  useAccount: vi.fn(),
}))

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolManagerStatic: vi.fn(),
  usePoolDynamic: vi.fn(),
}))

describe('useCheckWhitelist', () => {
  it('should return true if isMemberAllowed from PoolManagerStatic data', async () => {
    const isMemberAllowed = true
    const account = TEST_ADDRESS
    const managerAddress = '0x123'

    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({
          account,
        }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: { managerAddress },
        }) as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
    )
    vi.mocked(poolMulticallHooks.usePoolManagerStatic).mockImplementation(
      () =>
        ({
          data: { isMemberAllowed },
        }) as ReturnType<typeof poolMulticallHooks.usePoolManagerStatic>,
    )

    const { result } = renderHook(() =>
      useCheckWhitelist({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(
      vi.mocked(poolMulticallHooks.usePoolManagerStatic),
    ).toHaveBeenCalledTimes(1)
    expect(
      vi.mocked(poolMulticallHooks.usePoolManagerStatic),
    ).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    })
    expect(result.current).toBe(isMemberAllowed)
  })

  it('should return isMemberAllowed true if connected account is manager', async () => {
    const isMemberAllowed = false
    const account = TEST_ADDRESS
    const managerAddress = account

    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({
          account,
        }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: { managerAddress },
        }) as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
    )
    vi.mocked(poolMulticallHooks.usePoolManagerStatic).mockImplementation(
      () =>
        ({
          data: { isMemberAllowed },
        }) as ReturnType<typeof poolMulticallHooks.usePoolManagerStatic>,
    )

    const { result } = renderHook(() =>
      useCheckWhitelist({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(
      vi.mocked(poolMulticallHooks.usePoolManagerStatic),
    ).toHaveBeenCalledTimes(1)
    expect(
      vi.mocked(poolMulticallHooks.usePoolManagerStatic),
    ).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    })
    expect(result.current).toBe(true)
  })

  it('should return false for disconnected account', async () => {
    const account = undefined
    const isMemberAllowed = true
    const managerAddress = '0x123'

    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({
          account,
        }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: { managerAddress },
        }) as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
    )
    vi.mocked(poolMulticallHooks.usePoolManagerStatic).mockImplementation(
      () =>
        ({
          data: { isMemberAllowed },
        }) as ReturnType<typeof poolMulticallHooks.usePoolManagerStatic>,
    )

    const { result } = renderHook(() =>
      useCheckWhitelist({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(
      vi.mocked(poolMulticallHooks.usePoolManagerStatic),
    ).toHaveBeenCalledTimes(1)
    expect(
      vi.mocked(poolMulticallHooks.usePoolManagerStatic),
    ).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    })
    expect(result.current).toBe(false)
  })
})
