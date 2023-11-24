import BigNumber from 'bignumber.js'

import { DEFAULT_PRECISION, optimism } from 'const'
import * as stateHooks from 'hooks/state'
import * as tradingDepositHooks from 'hooks/trading/deposit'
import { renderHook } from 'test-utils'

import { TEST_ADDRESS } from 'tests/mocks'

import type { TradingToken } from 'types'

import { useTradingParams } from './use-trading-params'

vi.mock('hooks/state', () => ({
  useIsDepositTradingPanelType: vi.fn(),
  useReceiveTokenInput: vi.fn(),
  useSendTokenInput: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
}))

vi.mock('hooks/trading/deposit', () => ({
  usePoolDepositAssetAddress: vi.fn(),
}))

describe('useTradingParams', () => {
  it('should get receiveAssetAddress from receiveToken.address for depositing', () => {
    const poolConfig = {
      address: TEST_ADDRESS,
      chainId: optimism.id,
      withdrawParams: {
        customTokens: [
          {
            address: TEST_ADDRESS,
            method: 'withdraw',
            intermediateToken: {
              address: TEST_ADDRESS,
              symbol: 'symbol',
              value: '1',
              decimals: DEFAULT_PRECISION,
            },
          },
        ],
      },
    }
    const isDeposit = true
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'send_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const poolDepositAssetAddress = TEST_ADDRESS

    expect(isDeposit).toBe(true)

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockReturnValue(
      isDeposit,
    )
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useReceiveTokenInput>)
    vi.mocked(tradingDepositHooks.usePoolDepositAssetAddress).mockReturnValue(
      poolDepositAssetAddress,
    )

    const { result } = renderHook(() => useTradingParams())

    expect(result.current.receiveAssetAddress).toEqual(receiveToken.address)
  })

  it('should get receiveAssetAddress from intermediateWithdrawTokenAddress for withdrawing with intermediate', () => {
    const poolConfig = {
      address: TEST_ADDRESS,
      chainId: optimism.id,
      withdrawParams: {
        customTokens: [
          {
            address: TEST_ADDRESS,
            method: 'withdraw',
            intermediateToken: {
              address: TEST_ADDRESS,
              symbol: 'symbol',
              value: '1',
              decimals: DEFAULT_PRECISION,
            },
          },
        ],
      },
    }
    const isDeposit = false
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'send_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const poolDepositAssetAddress = TEST_ADDRESS

    expect(isDeposit).toBe(false)
    expect(
      poolConfig.withdrawParams.customTokens.some(
        ({ address }) => address === receiveToken.address,
      ),
    ).toBe(true)

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockReturnValue(
      isDeposit,
    )
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useReceiveTokenInput>)
    vi.mocked(tradingDepositHooks.usePoolDepositAssetAddress).mockReturnValue(
      poolDepositAssetAddress,
    )

    const { result } = renderHook(() => useTradingParams())

    expect(result.current.receiveAssetAddress).toEqual(
      poolConfig.withdrawParams.customTokens.find(
        ({ address }) => address === receiveToken.address,
      )?.intermediateToken?.address,
    )
  })

  it('should get sendAssetAddress and fromTokenAmount from sendToken', () => {
    const poolConfig = {
      address: TEST_ADDRESS,
      chainId: optimism.id,
      withdrawParams: {
        customTokens: [
          {
            address: TEST_ADDRESS,
            method: 'withdraw',
            intermediateToken: {
              address: TEST_ADDRESS,
              symbol: 'symbol',
              value: '1',
              decimals: DEFAULT_PRECISION,
            },
          },
        ],
      },
    }
    const isDeposit = false
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'send_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const poolDepositAssetAddress = TEST_ADDRESS

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockReturnValue(
      isDeposit,
    )
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useReceiveTokenInput>)
    vi.mocked(tradingDepositHooks.usePoolDepositAssetAddress).mockReturnValue(
      poolDepositAssetAddress,
    )

    const { result } = renderHook(() => useTradingParams())

    expect(result.current.sendAssetAddress).toEqual(sendToken.address)
    expect(result.current.fromTokenAmount).toEqual(
      new BigNumber(sendToken.value),
    )
  })

  it('should get poolDepositAddress from usePoolDepositAssetAddress', () => {
    const poolConfig = {
      address: TEST_ADDRESS,
      chainId: optimism.id,
      withdrawParams: {
        customTokens: [
          {
            address: TEST_ADDRESS,
            method: 'withdraw',
            intermediateToken: {
              address: TEST_ADDRESS,
              symbol: 'symbol',
              value: '1',
              decimals: DEFAULT_PRECISION,
            },
          },
        ],
      },
    }
    const isDeposit = false
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'send_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const poolDepositAssetAddress = TEST_ADDRESS

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockReturnValue(
      isDeposit,
    )
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useReceiveTokenInput>)
    vi.mocked(tradingDepositHooks.usePoolDepositAssetAddress).mockReturnValue(
      poolDepositAssetAddress,
    )

    const { result } = renderHook(() => useTradingParams())

    expect(result.current.poolDepositAddress).toEqual(poolDepositAssetAddress)
  })
})
