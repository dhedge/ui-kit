import BigNumber from 'bignumber.js'

import { optimism } from 'const'
import * as stateHooks from 'hooks/state'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'
import * as utils from 'utils'

import { useUserTokenBalance } from './use-user-token-balance'

vi.mock('hooks/state', () => ({
  useTradingPanelPoolConfig: vi.fn(),
}))

vi.mock('hooks/web3', () => ({
  useAccount: vi.fn(),
  useBalance: vi.fn(),
  useGasPrice: vi.fn(),
}))

vi.mock('utils', () => ({
  formatUnits: vi.fn(),
  getNativeTokenInvestableBalance: vi.fn(),
  isNativeToken: vi.fn(),
}))

describe('useUserTokenBalance', () => {
  it('should return native token balance', async () => {
    const isNative = true
    const nativeBalance = new BigNumber(1)

    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({
          account: TEST_ADDRESS,
        }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({
          chainId: optimism.id,
        }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(web3Hooks.useGasPrice).mockImplementation(
      () =>
        ({
          data: undefined,
        }) as ReturnType<typeof web3Hooks.useGasPrice>,
    )
    vi.mocked(web3Hooks.useBalance).mockImplementation(
      () =>
        ({
          data: undefined,
        }) as ReturnType<typeof web3Hooks.useBalance>,
    )
    vi.mocked(utils.isNativeToken).mockImplementation(() => isNative)
    vi.mocked(utils.getNativeTokenInvestableBalance).mockImplementation(
      () => nativeBalance,
    )

    const { result } = renderHook(() =>
      useUserTokenBalance({
        symbol: 'symbol',
        address: TEST_ADDRESS,
        watch: false,
      }),
    )

    expect(result.current).toEqual(nativeBalance.toString())
  })

  it('should return default token balance', async () => {
    const isNative = false
    const balance = '1'

    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({
          account: TEST_ADDRESS,
        }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({
          chainId: optimism.id,
        }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(web3Hooks.useGasPrice).mockImplementation(
      () =>
        ({
          data: undefined,
        }) as ReturnType<typeof web3Hooks.useGasPrice>,
    )
    vi.mocked(web3Hooks.useBalance).mockImplementation(
      () =>
        ({
          data: undefined,
        }) as ReturnType<typeof web3Hooks.useBalance>,
    )
    vi.mocked(utils.isNativeToken).mockImplementation(() => isNative)
    vi.mocked(utils.formatUnits).mockImplementation(() => balance)

    const { result } = renderHook(() =>
      useUserTokenBalance({
        symbol: 'symbol',
        address: TEST_ADDRESS,
        watch: false,
      }),
    )

    expect(result.current).toEqual(balance)
  })
})
