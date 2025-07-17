import { useIsWalletConnected } from 'core-kit/hooks/web3/use-is-wallet-connected'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

const mocks = vi.hoisted(() => {
  return {
    useAccount: vi.fn(),
  }
})

vi.mock('./use-account', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('./use-account')

  return {
    ...actual,
    useAccount: mocks.useAccount,
  }
})

describe('useIsWalletConnected', () => {
  it('should return true for account value', () => {
    mocks.useAccount.withImplementation(
      () => ({
        account: TEST_ADDRESS,
        status: 'status',
        connector: { name: 'connector' },
        providerName: 'connector',
      }),
      () => {
        const { result } = renderHook(() => useIsWalletConnected())
        expect(result.current).toBe(true)
      },
    )
  })

  it('should return false for undefined account value', () => {
    mocks.useAccount.withImplementation(
      () => ({
        account: undefined,
        status: 'status',
        connector: { name: 'connector' },
        providerName: 'connector',
      }),
      () => {
        const { result } = renderHook(() => useIsWalletConnected())
        expect(result.current).toBe(false)
      },
    )
  })
})
