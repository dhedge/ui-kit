import BigNumber from 'bignumber.js'
import isNumber from 'lodash.isnumber'

import { DEFAULT_PRECISION } from 'const'
import * as stateHooks from 'hooks/state'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'
import type { TradingToken } from 'types'

import {
  receiveAppliedSlippage,
  useMinReceiveText,
} from './use-min-receive-text'

vi.mock('hooks/state', () => ({
  useReceiveTokenInput: vi.fn(),
  useTradingPanelSettings: vi.fn(),
  useTradingPanelType: vi.fn(),
}))

describe('useMinReceiveText', () => {
  it('should handle deposit type and auto slippage', () => {
    const type = 'deposit'
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const settings = { slippage: 'auto', minSlippage: undefined }

    expect(type).toEqual('deposit')
    expect(settings.slippage).toEqual('auto')

    vi.mocked(stateHooks.useTradingPanelType).mockReturnValue([type, vi.fn()])
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)

    const { result } = renderHook(() => useMinReceiveText())

    expect(result).toMatchSnapshot()
  })

  it('should handle all symbol', () => {
    const type = 'withdraw'
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'all',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const settings = { slippage: 'auto', minSlippage: undefined }

    expect(type).not.toEqual('deposit')
    expect(receiveToken.symbol).toEqual('all')

    vi.mocked(stateHooks.useTradingPanelType).mockReturnValue([type, vi.fn()])
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)

    const { result } = renderHook(() => useMinReceiveText())

    expect(result).toMatchSnapshot()
  })

  it('should handle auto slippage with minSlippage value', () => {
    const type = 'withdraw'
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const settings = { slippage: 'auto', minSlippage: 0.1 }

    expect(type).not.toEqual('deposit')
    expect(receiveToken.symbol).not.toEqual('all')
    expect(settings.slippage).toEqual('auto')
    expect(isNumber(settings.minSlippage)).toEqual(true)

    vi.mocked(stateHooks.useTradingPanelType).mockReturnValue([type, vi.fn()])
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)

    const { result } = renderHook(() => useMinReceiveText())

    expect(result).toMatchSnapshot()
  })

  it('should handle auto slippage with undefined minSlippage value', () => {
    const type = 'withdraw'
    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }
    const settings = { slippage: 'auto', minSlippage: undefined }

    expect(type).not.toEqual('deposit')
    expect(receiveToken.symbol).not.toEqual('all')
    expect(settings.slippage).toEqual('auto')
    expect(isNumber(settings.minSlippage)).toEqual(false)

    vi.mocked(stateHooks.useTradingPanelType).mockReturnValue([type, vi.fn()])
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      receiveToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)

    const { result } = renderHook(() => useMinReceiveText())

    expect(result).toMatchSnapshot()
  })
})

describe('receiveAppliedSlippage', () => {
  it('should handle deposit type with auto slippage with valid balance', () => {
    const tradingType = 'deposit'
    const receiveBalance = new BigNumber(1)
    const slippage = 'auto'

    expect(tradingType).toEqual('deposit')
    expect(slippage).toEqual('auto')
    expect(receiveBalance.isFinite()).toBe(true)

    expect(
      receiveAppliedSlippage(receiveBalance, slippage, tradingType),
    ).toMatchSnapshot()
  })

  it('should handle withdraw type with auto slippage with valid balance', () => {
    const tradingType = 'withdraw'
    const receiveBalance = new BigNumber(1)
    const slippage = 'auto'

    expect(tradingType).not.toEqual('deposit')
    expect(slippage).toEqual('auto')
    expect(receiveBalance.isFinite()).toBe(true)

    expect(
      receiveAppliedSlippage(receiveBalance, slippage, tradingType),
    ).toMatchSnapshot()
  })

  it('should handle deposit type with non auto slippage with valid balance', () => {
    const tradingType = 'deposit'
    const receiveBalance = new BigNumber(1)
    const slippage = 1

    expect(tradingType).toEqual('deposit')
    expect(slippage).not.toEqual('auto')
    expect(receiveBalance.isFinite()).toBe(true)

    expect(
      receiveAppliedSlippage(receiveBalance, slippage, tradingType),
    ).toMatchSnapshot()
  })

  it('should handle invalid balance', () => {
    const tradingType = 'deposit'
    const receiveBalance = new BigNumber(Infinity)
    const slippage = 1

    expect(tradingType).toEqual('deposit')
    expect(slippage).not.toEqual('auto')
    expect(receiveBalance.isFinite()).toBe(false)

    expect(
      receiveAppliedSlippage(receiveBalance, slippage, tradingType),
    ).toMatchSnapshot()
  })

  it('should handle withdraw type with non auto slippage with valid balance', () => {
    const tradingType = 'withdraw'
    const receiveBalance = new BigNumber(1)
    const slippage = 1

    expect(tradingType).not.toEqual('deposit')
    expect(slippage).not.toEqual('auto')
    expect(receiveBalance.isFinite()).toBe(true)

    expect(
      receiveAppliedSlippage(receiveBalance, slippage, tradingType),
    ).toMatchSnapshot()
  })
})
