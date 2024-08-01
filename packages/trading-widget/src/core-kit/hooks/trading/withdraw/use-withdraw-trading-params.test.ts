import BigNumber from 'bignumber.js'

import { DEFAULT_PRECISION, optimism } from 'core-kit/const'
import * as stateHooks from 'core-kit/hooks/state'

import type { TradingToken } from 'core-kit/types'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useWithdrawTradingParams } from './use-withdraw-trading-params'

vi.mock('core-kit/hooks/state', () => ({
  useIsDepositTradingPanelType: vi.fn(),
  useReceiveTokenInput: vi.fn(),
  useSendTokenInput: vi.fn(),
  useTradingPanelPoolConfig: vi.fn(),
}))

describe('useWithdrawTradingParams', () => {
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
    expect(
      poolConfig.withdrawParams.customTokens.some(
        ({ address }) => address === receiveToken.address,
      ),
    ).toBe(true)

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useReceiveTokenInput>)

    const { result } = renderHook(() => useWithdrawTradingParams())

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

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(stateHooks.useSendTokenInput).mockReturnValue([
      sendToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ] as ReturnType<typeof stateHooks.useReceiveTokenInput>)

    const { result } = renderHook(() => useWithdrawTradingParams())

    expect(result.current.sendAssetAddress).toEqual(sendToken.address)
    expect(result.current.fromTokenAmount).toEqual(
      new BigNumber(sendToken.value),
    )
  })
})
