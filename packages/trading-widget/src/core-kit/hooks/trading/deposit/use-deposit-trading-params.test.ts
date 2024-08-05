import BigNumber from 'bignumber.js'
import { beforeEach } from 'vitest'

import { DEFAULT_PRECISION, optimism } from 'core-kit/const'
import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import * as stateHooks from 'core-kit/hooks/state'
import * as tradingDepositHooks from 'core-kit/hooks/trading/deposit'

import { useAssetPrice } from 'core-kit/hooks/trading/use-asset-price'
import type { TradingToken } from 'core-kit/types'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useDepositTradingParams } from './use-deposit-trading-params'

vi.mock('core-kit/hooks/state', async () => {
  const actual = await vi.importActual<Record<string, unknown>>(
    'core-kit/hooks/state',
  )
  return {
    ...actual,
    useReceiveTokenInput: vi.fn(),
    useSendTokenInput: vi.fn(),
    useTradingPanelPoolConfig: vi.fn(),
    useTradingPanelSettings: vi.fn(),
  }
})

vi.mock('core-kit/hooks/trading/deposit', () => ({
  usePoolDepositAssetAddress: vi.fn(),
}))

vi.mock('core-kit/hooks/pool', () => ({
  usePoolTokenPrice: vi.fn(),
}))
vi.mock('core-kit/hooks/trading/use-asset-price', () => ({
  useAssetPrice: vi.fn(),
}))

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
const poolDepositAssetAddress = TEST_ADDRESS

describe('useDepositTradingParams', () => {
  beforeEach(() => {
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
    vi.mocked(tradingDepositHooks.usePoolDepositAssetAddress).mockReturnValue(
      poolDepositAssetAddress,
    )
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      { slippage: 'auto' },
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)
  })

  it('should get receiveAssetAddress from receiveToken.address for depositing', () => {
    const { result } = renderHook(() => useDepositTradingParams())

    expect(result.current.receiveAssetAddress).toEqual(receiveToken.address)
  })

  it('should get poolDepositAddress from usePoolDepositAssetAddress', () => {
    const { result } = renderHook(() => useDepositTradingParams())

    expect(result.current.poolDepositAddress).toEqual(poolDepositAssetAddress)
  })

  it('should calculate receiveAssetAmount correctly when slippage is auto', () => {
    const { result } = renderHook(() => useDepositTradingParams())

    expect(result.current.receiveAssetAmount).toEqual(receiveToken.value)
  })

  it('should calculate receiveAssetAmount correctly when slippage is manual', () => {
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      { slippage: 0.1 },
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)

    vi.mocked(usePoolTokenPrice).mockReturnValue('1')
    vi.mocked(useAssetPrice).mockReturnValue('10')

    const { result } = renderHook(() => useDepositTradingParams())

    expect(usePoolTokenPrice).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
      disabled: false,
    })
    expect(useAssetPrice).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
      disabled: false,
    })
    expect(result.current.receiveAssetAmount).toEqual(
      new BigNumber(sendToken.value)
        .multipliedBy('10')
        .dividedBy('1')
        .toFixed(),
    )
  })
})
