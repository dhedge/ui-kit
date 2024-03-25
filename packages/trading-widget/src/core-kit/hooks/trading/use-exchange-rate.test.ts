import { DEFAULT_PRECISION } from 'core-kit/const'
import * as stateHooks from 'core-kit/hooks/state'

import type { TradingToken } from 'core-kit/types'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { getExchange, useExchangeRate } from './use-exchange-rate'

vi.mock('core-kit/hooks/state', () => ({
  useReceiveTokenInput: vi.fn(),
  useSendTokenInput: vi.fn(),
}))

describe('useExchangeRate', () => {
  it('should evaluate value from sendToken and receiveToken', () => {
    const sendToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'send_symbol',
      value: '1',
      decimals: DEFAULT_PRECISION,
    }

    const receiveToken: TradingToken = {
      address: TEST_ADDRESS,
      symbol: 'receive_symbol',
      value: '2',
      decimals: DEFAULT_PRECISION,
    }

    vi.mocked(stateHooks.useSendTokenInput).mockImplementation(() => [
      sendToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockImplementation(() => [
      receiveToken,
      vi.fn(),
    ])

    const { result } = renderHook(() => useExchangeRate())

    expect(vi.mocked(stateHooks.useSendTokenInput)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(stateHooks.useReceiveTokenInput)).toHaveBeenCalledTimes(1)
    expect(result.current).toMatchSnapshot()
  })
})

describe('getExchange', () => {
  it('should build 1 X symbol = n Y symbol pattern string', () => {
    const input = 10
    const output = 20
    expect(
      getExchange(
        'sendSymbol',
        'receiveSymbol',
        input.toString(),
        output.toString(),
      ),
    ).toEqual(`1 sendSymbol = ${(output / input).toFixed(6)} receiveSymbol`)
  })

  it('should return empty string on invalid data', () => {
    const input = Infinity
    const output = 20
    expect(
      getExchange(
        'sendSymbol',
        'receiveSymbol',
        input.toString(),
        output.toString(),
      ),
    ).toEqual('')
  })

  it('should return empty string on zero input', () => {
    const input = 0
    const output = 20
    expect(
      getExchange(
        'sendSymbol',
        'receiveSymbol',
        input.toString(),
        output.toString(),
      ),
    ).toEqual('')
  })
})
