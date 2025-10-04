import { erc20Abi } from 'core-kit/abi'
import {
  AddressZero,
  CHAIN_NATIVE_TOKENS,
  DEFAULT_PRECISION,
  optimism,
} from 'core-kit/const'
import * as poolHooks from 'core-kit/hooks/pool'
import * as stateHooks from 'core-kit/hooks/state'
import { useVaultDepositTokens } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-tokens'
import * as userHooks from 'core-kit/hooks/user'
import * as web3Hooks from 'core-kit/hooks/web3'
import type { Address, PoolComposition, TradingToken } from 'core-kit/types'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolConfig: vi.fn(),
  useTradingPanelSettings: vi.fn(),
  useCustomDepositTokensPerChain: vi.fn(),
}))
vi.mock('core-kit/hooks/pool', () => ({ usePoolComposition: vi.fn() }))
vi.mock('core-kit/hooks/user', () => ({ useIsDhedgeVaultConnected: vi.fn() }))
vi.mock('core-kit/hooks/web3', () => ({
  useAccount: vi.fn(),
  useReadContracts: vi.fn(),
  useContractReadsErrorLogging: vi.fn(),
}))

describe('useVaultDepositTokens', () => {
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
    vi.mocked(stateHooks.useTradingPanelSettings).mockImplementation(
      () =>
        [
          { isCustomDepositOptionsDisabled: false },
          vi.fn(),
        ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>,
    )
    vi.mocked(stateHooks.useCustomDepositTokensPerChain).mockImplementation(
      () =>
        [undefined, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useCustomDepositTokensPerChain
        >,
    )
    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [])
    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    const { result } = renderHook(() => useVaultDepositTokens())
    expect(poolHooks.usePoolComposition).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    })
    expect(poolHooks.usePoolComposition).toHaveBeenCalledTimes(1)
    expect(userHooks.useIsDhedgeVaultConnected).toHaveBeenCalledTimes(1)
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
    vi.mocked(stateHooks.useTradingPanelSettings).mockImplementation(
      () =>
        [
          { isCustomDepositOptionsDisabled: false },
          vi.fn(),
        ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>,
    )
    vi.mocked(stateHooks.useCustomDepositTokensPerChain).mockImplementation(
      () =>
        [undefined, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useCustomDepositTokensPerChain
        >,
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
    vi.mocked(userHooks.useIsDhedgeVaultConnected).mockImplementation(
      () => isPoolManagerAccount,
    )
    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [{ result: BigInt(rawDepositTokenBalance) }],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    const { result } = renderHook(() => useVaultDepositTokens())
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
    vi.mocked(stateHooks.useTradingPanelSettings).mockImplementation(
      () =>
        [
          { isCustomDepositOptionsDisabled: false },
          vi.fn(),
        ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>,
    )
    vi.mocked(stateHooks.useCustomDepositTokensPerChain).mockImplementation(
      () =>
        [undefined, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useCustomDepositTokensPerChain
        >,
    )
    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      defaultDepositToken,
    ])
    vi.mocked(userHooks.useIsDhedgeVaultConnected).mockImplementation(
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

    const { result } = renderHook(() => useVaultDepositTokens())

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
    vi.mocked(stateHooks.useTradingPanelSettings).mockImplementation(
      () =>
        [
          { isCustomDepositOptionsDisabled: false },
          vi.fn(),
        ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>,
    )
    vi.mocked(stateHooks.useCustomDepositTokensPerChain).mockImplementation(
      () =>
        [undefined, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useCustomDepositTokensPerChain
        >,
    )
    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      defaultDepositToken,
    ])
    vi.mocked(userHooks.useIsDhedgeVaultConnected).mockImplementation(
      () => isPoolManagerAccount,
    )
    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [{ result: BigInt(100000) }],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    const { result } = renderHook(() => useVaultDepositTokens())

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
    vi.mocked(stateHooks.useTradingPanelSettings).mockImplementation(
      () =>
        [
          { isCustomDepositOptionsDisabled: false },
          vi.fn(),
        ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>,
    )
    vi.mocked(stateHooks.useCustomDepositTokensPerChain).mockImplementation(
      () =>
        [undefined, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useCustomDepositTokensPerChain
        >,
    )
    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      depositToken,
    ])
    vi.mocked(userHooks.useIsDhedgeVaultConnected).mockImplementation(
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

    const { result } = renderHook(() => useVaultDepositTokens())

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

  it('should exclude both custom tokens and native token when isCustomDepositOptionsDisabled is true', () => {
    const isPoolManagerAccount = true
    const chainId = optimism.id
    const defaultDepositToken = {
      tokenName: 'WETH',
      isDeposit: true,
      tokenAddress: '0xWETH',
      precision: 3,
    } as unknown as PoolComposition
    const customDepositToken: TradingToken = {
      symbol: 'USDC',
      value: '',
      address: '0xUSDC',
      decimals: 6,
    }
    const defaultDepositTokenBalance = BigInt(10)

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
    vi.mocked(stateHooks.useTradingPanelSettings).mockImplementation(
      () =>
        [
          { isCustomDepositOptionsDisabled: true },
          vi.fn(),
        ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>,
    )
    vi.mocked(stateHooks.useCustomDepositTokensPerChain).mockImplementation(
      () =>
        [undefined, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useCustomDepositTokensPerChain
        >,
    )
    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      defaultDepositToken,
    ])
    vi.mocked(userHooks.useIsDhedgeVaultConnected).mockImplementation(
      () => isPoolManagerAccount,
    )
    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [{ result: defaultDepositTokenBalance }],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    const { result } = renderHook(() => useVaultDepositTokens())

    expect(web3Hooks.useReadContracts).toHaveBeenCalledWith({
      contracts: [
        expect.objectContaining({
          address: defaultDepositToken.tokenAddress.toLowerCase(),
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
    ])
  })

  it('should include tokens from customDepositTokensPerChain along with depositParams.customTokens', () => {
    const isPoolManagerAccount = false
    const chainId = optimism.id
    const defaultDepositToken = {
      tokenName: 'WETH',
      isDeposit: true,
      tokenAddress: '0xWETH',
      precision: 3,
    } as unknown as PoolComposition
    const defaultDepositTokenBalance = BigInt(1000) // 0.1 after decimals 3
    const customDepositToken: TradingToken = {
      symbol: 'USDC',
      value: '',
      address: '0xUSDC',
      decimals: 3,
    }
    const perChainToken: TradingToken = {
      symbol: 'DAI',
      value: '',
      address: '0xDAI',
      decimals: 3,
    }
    const usdcBalance = BigInt(2000)
    const daiBalance = BigInt(1000)

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
    vi.mocked(stateHooks.useTradingPanelSettings).mockImplementation(
      () =>
        [
          { isCustomDepositOptionsDisabled: false },
          vi.fn(),
        ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>,
    )
    vi.mocked(stateHooks.useCustomDepositTokensPerChain).mockImplementation(
      () =>
        [{ [chainId]: [perChainToken] }, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useCustomDepositTokensPerChain
        >,
    )
    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      defaultDepositToken,
    ])
    vi.mocked(userHooks.useIsDhedgeVaultConnected).mockImplementation(
      () => isPoolManagerAccount,
    )
    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [
            { result: defaultDepositTokenBalance },
            { result: usdcBalance },
            { result: daiBalance },
          ],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    const { result } = renderHook(() => useVaultDepositTokens())

    expect(result.current).toEqual([
      {
        address: customDepositToken.address.toLowerCase(),
        balance: 2,
        decimals: 3,
        symbol: 'USDC',
        value: '',
      },
      {
        address: defaultDepositToken.tokenAddress.toLowerCase(),
        balance: 1,
        decimals: 3,
        symbol: 'WETH',
        value: '',
      },
      {
        address: perChainToken.address,
        balance: 1,
        decimals: 3,
        symbol: 'DAI',
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

  it('should exclude customDepositTokensPerChain when isCustomDepositOptionsDisabled is true', () => {
    const isPoolManagerAccount = true
    const chainId = optimism.id
    const defaultDepositToken = {
      tokenName: 'WETH',
      isDeposit: true,
      tokenAddress: '0xWETH',
      precision: 3,
    } as unknown as PoolComposition
    const defaultDepositTokenBalance = BigInt(10)
    const perChainToken: TradingToken = {
      symbol: 'USDC',
      value: '',
      address: '0xUSDC',
      decimals: 6,
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
          depositParams: { customTokens: [] as TradingToken[] },
        }) as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(stateHooks.useTradingPanelSettings).mockImplementation(
      () =>
        [
          { isCustomDepositOptionsDisabled: true },
          vi.fn(),
        ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>,
    )
    vi.mocked(stateHooks.useCustomDepositTokensPerChain).mockImplementation(
      () =>
        [{ [chainId]: [perChainToken] }, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useCustomDepositTokensPerChain
        >,
    )
    vi.mocked(poolHooks.usePoolComposition).mockImplementation(() => [
      defaultDepositToken,
    ])
    vi.mocked(userHooks.useIsDhedgeVaultConnected).mockImplementation(
      () => isPoolManagerAccount,
    )
    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [{ result: defaultDepositTokenBalance }],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    const { result } = renderHook(() => useVaultDepositTokens())

    expect(result.current).toEqual([
      {
        address: defaultDepositToken.tokenAddress.toLowerCase(),
        balance: 0.01,
        decimals: 3,
        symbol: 'WETH',
        value: '',
      },
    ])
  })
})
