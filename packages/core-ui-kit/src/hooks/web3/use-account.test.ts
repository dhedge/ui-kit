import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'
import * as w from 'wagmi'

import { useAccount } from './use-account'

vi.mock('wagmi', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('wagmi')

  return {
    ...actual,
    useAccount: vi.fn(),
  }
})

describe('useAccount', () => {
  it('should return specific account data', () => {
    const account = {
      address: TEST_ADDRESS,
      status: 'connected',
      connector: { name: 'connector' },
    }

    vi.mocked(w.useAccount).mockImplementationOnce(
      () => account as ReturnType<typeof w.useAccount>,
    )

    const { result } = renderHook(() => useAccount())

    expect(result.current).toEqual({
      account: account.address,
      status: account.status,
      connector: account.connector,
      providerName: account.connector.name,
    })
  })

  it('should call account hook', () => {
    const spy = vi
      .spyOn(w, 'useAccount')
      .mockImplementationOnce(() => ({}) as ReturnType<typeof w.useAccount>)

    renderHook(() => useAccount())

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
