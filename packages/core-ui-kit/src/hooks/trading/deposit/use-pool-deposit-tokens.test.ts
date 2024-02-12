import { erc20Abi } from 'abi'
import {
  AddressZero,
  CHAIN_NATIVE_TOKENS,
  DEFAULT_PRECISION,
  optimism,
} from 'const'
import * as poolHooks from 'hooks/pool'
import * as stateHooks from 'hooks/state'
import * as userHooks from 'hooks/user'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'
import type { Address, PoolComposition, TradingToken } from 'types'

import { usePoolDepositTokens } from './use-pool-deposit-tokens'

vi.mock('hooks/state', () => ({ useTradingPanelPoolConfig: vi.fn() }))
vi.mock('hooks/pool', () => ({ usePoolComposition: vi.fn() }))
vi.mock('hooks/user', () => ({ useIsPoolManagerAccount: vi.fn() }))
vi.mock('hooks/web3', () => ({
  useAccount: vi.fn(),
  useReadContracts: vi.fn(),
  useContractReadsErrorLogging: vi.fn(),
}))

describe('usePoolDepositTokens', () => {
  it('should return an empty array when there are no deposit tokens and account is not connected', () => {
    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () => ({ account: undefined }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({
          address: TEST_ADDRESS,
          chainId: optimism.id,
          depositParams: { customTokens: [] as TradingToken[] },
        }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [])
    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    const { result } = renderHook(() => usePoolDepositTokens())
    expect(poolHooks.usePoolComposition).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    })
    expect(poolHooks.usePoolComposition).toHaveBeenCalledTimes(1)
    expect(userHooks.useIsPoolManagerAccount).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useReadContracts).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({
          enabled: false,
        }),
      }),
    )
    expect(result.current).toEqual([])
  })

  it('should return deposit tokens with balances when custom deposit tokens are not defined and exclude native token when the user is vault manager', () => {
    const isPoolManagerAccount = true
    const rawDepositTokenBalance = 100
    const depositTokenDecimals = 2
    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({ account: TEST_ADDRESS }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({
          address: TEST_ADDRESS,
          chainId: optimism.id,
          depositParams: { customTokens: [] as TradingToken[] },
        }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      {
        tokenName: 'USDC',
        rate: '1',
        amount: '1',
        isDeposit: true,
        tokenAddress: AddressZero,
        precision: depositTokenDecimals,
        asset: {
          iconSymbols: ['usdc'],
        },
      },
    ])
    vi.mocked(userHooks.useIsPoolManagerAccount).mockImplementation(
      () => isPoolManagerAccount,
    )
    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [{ result: BigInt(rawDepositTokenBalance) }],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    const { result } = renderHook(() => usePoolDepositTokens())
    expect(result.current).toEqual([
      {
        address: AddressZero,
        balance: rawDepositTokenBalance / 10 ** depositTokenDecimals,
        decimals: depositTokenDecimals,
        symbol: 'USDC',
        value: '',
      },
    ])
  })

  it('should return deposit tokens with balances when custom deposit tokens are defined and include native token when the user is not a vault manager', () => {
    const isPoolManagerAccount = false
    const chainId = optimism.id
    const defaultDepositToken = {
      tokenName: 'WETH',
      isDeposit: true,
      tokenAddress: '0xWETH',
      precision: 3,
    } as unknown as PoolComposition
    const defaultDepositTokenBalance = BigInt(10)
    const customDepositToken: TradingToken = {
      symbol: 'USDC',
      value: '',
      address: '0xUSDC',
      decimals: 6,
    }
    const customDepositTokenBalance = BigInt(2000)

    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({ account: TEST_ADDRESS }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({
          address: TEST_ADDRESS,
          chainId,
          depositParams: { customTokens: [customDepositToken] },
        }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      defaultDepositToken,
    ])
    vi.mocked(userHooks.useIsPoolManagerAccount).mockImplementation(
      () => isPoolManagerAccount,
    )
    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [
            { result: defaultDepositTokenBalance },
            { result: customDepositTokenBalance },
          ],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    const { result } = renderHook(() => usePoolDepositTokens())

    expect(web3Hooks.useReadContracts).toHaveBeenCalledWith({
      contracts: [
        expect.objectContaining({
          address: defaultDepositToken.tokenAddress.toLowerCase(),
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [TEST_ADDRESS],
          chainId,
        }),
        expect.objectContaining({
          address: customDepositToken.address.toLowerCase(),
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [TEST_ADDRESS],
          chainId,
        }),
      ],
      query: expect.objectContaining({
        enabled: true,
      }),
    })
    expect(result.current).toEqual([
      {
        address: defaultDepositToken.tokenAddress.toLowerCase(),
        balance: 0.01,
        decimals: 3,
        symbol: 'WETH',
        value: '',
      },
      {
        address: customDepositToken.address.toLowerCase(),
        balance: 0.002,
        decimals: 6,
        symbol: 'USDC',
        value: '',
      },
      {
        address: CHAIN_NATIVE_TOKENS[chainId]?.address ?? AddressZero,
        symbol: CHAIN_NATIVE_TOKENS[chainId]?.nativeTokenSymbol ?? '',
        decimals: CHAIN_NATIVE_TOKENS[chainId]?.decimals ?? DEFAULT_PRECISION,
        value: '',
      },
    ])
  })

  it('should return deposit tokens with balances without duplications even if addresses are in different cases', () => {
    const isPoolManagerAccount = false
    const chainId = optimism.id
    const defaultDepositToken = {
      tokenName: 'WETH',
      isDeposit: true,
      tokenAddress: '0xWETH',
      precision: 3,
    } as unknown as PoolComposition
    const customDepositToken = {
      symbol: defaultDepositToken.tokenName,
      value: '',
      address: defaultDepositToken.tokenAddress.toLowerCase() as Address,
      decimals: defaultDepositToken.precision,
    }

    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({ account: TEST_ADDRESS }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({
          address: TEST_ADDRESS,
          chainId,
          depositParams: { customTokens: [customDepositToken] },
        }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      defaultDepositToken,
    ])
    vi.mocked(userHooks.useIsPoolManagerAccount).mockImplementation(
      () => isPoolManagerAccount,
    )
    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [{ result: BigInt(100000) }],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    const { result } = renderHook(() => usePoolDepositTokens())

    expect(web3Hooks.useReadContracts).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useReadContracts).toHaveBeenCalledWith({
      contracts: [
        expect.objectContaining({
          address: customDepositToken.address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [TEST_ADDRESS],
          chainId,
        }),
      ],
      query: expect.objectContaining({
        enabled: true,
      }),
    })
    expect(result.current).toEqual([
      {
        address: defaultDepositToken.tokenAddress.toLowerCase(),
        balance: 100,
        decimals: 3,
        symbol: 'WETH',
        value: '',
      },
      {
        address: CHAIN_NATIVE_TOKENS[chainId]?.address ?? AddressZero,
        symbol: CHAIN_NATIVE_TOKENS[chainId]?.nativeTokenSymbol ?? '',
        decimals: CHAIN_NATIVE_TOKENS[chainId]?.decimals ?? DEFAULT_PRECISION,
        value: '',
      },
    ])
  })

  it('should return deposit tokens with balances and move default deposit token to the first place', () => {
    const isPoolManagerAccount = false
    const chainId = optimism.id
    const depositToken = {
      tokenName: 'WETH',
      isDeposit: true,
      tokenAddress: '0xWETH',
      precision: 3,
    } as unknown as PoolComposition
    const defaultDepositTokenBalance = BigInt(10)
    const customDepositToken: TradingToken = {
      symbol: 'sUSD',
      value: '',
      address: '0xsUSD',
      decimals: 6,
    }
    const customDepositTokenBalance = BigInt(2000)
    const defaultDepositTokenSymbol = customDepositToken.symbol

    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({ account: TEST_ADDRESS }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockImplementation(
      () =>
        ({
          address: TEST_ADDRESS,
          chainId,
          depositParams: {
            customTokens: [customDepositToken],
            defaultDepositTokenSymbol,
          },
        }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      depositToken,
    ])
    vi.mocked(userHooks.useIsPoolManagerAccount).mockImplementation(
      () => isPoolManagerAccount,
    )
    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [
            { result: defaultDepositTokenBalance },
            { result: customDepositTokenBalance },
          ],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    const { result } = renderHook(() => usePoolDepositTokens())

    expect(result.current).toEqual([
      {
        address: customDepositToken.address.toLowerCase(),
        balance: 0.002,
        decimals: 6,
        symbol: customDepositToken.symbol,
        value: '',
      },
      {
        address: depositToken.tokenAddress.toLowerCase(),
        balance: 0.01,
        decimals: 3,
        symbol: 'WETH',
        value: '',
      },
      {
        address: CHAIN_NATIVE_TOKENS[chainId]?.address ?? AddressZero,
        symbol: CHAIN_NATIVE_TOKENS[chainId]?.nativeTokenSymbol ?? '',
        decimals: CHAIN_NATIVE_TOKENS[chainId]?.decimals ?? DEFAULT_PRECISION,
        value: '',
      },
    ])
  })
})
