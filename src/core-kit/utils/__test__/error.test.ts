import { TRANSACTION_ERRORS } from 'core-kit/const'
import {
  getErrorKey,
  getErrorMessage,
  isErrorWithMessage,
  parseContractErrorMessage,
  validateLoggerEventParams,
} from 'core-kit/utils/error'

describe('core-kit/utils/isErrorWithMessage', () => {
  it('should resolve error message', () => {
    expect(isErrorWithMessage(new Error('test'))).toBe(true)
    expect(isErrorWithMessage(undefined)).toBe(false)
    expect(isErrorWithMessage({})).toBe(false)
    expect(isErrorWithMessage(null)).toBe(false)
    expect(isErrorWithMessage({ test: 'test' })).toBe(false)
  })
})

describe('core-kit/utils/getErrorMessage', () => {
  it('should return error message or convert to message string', () => {
    expect(getErrorMessage(new Error('test'))).toBe('test')
    expect(getErrorMessage({ message: 'message' })).toBe('message')
    expect(getErrorMessage({ test: 'test' })).toBe('{"test":"test"}')
    expect(getErrorMessage(undefined)).toBe('')
    expect(getErrorMessage(null)).toBe('null')
  })
})

describe('core-kit/utils/validateLoggerEventParams', () => {
  it('should throw error for > 10 string params', () => {
    const paramsMap = Array.from(
      { length: 11 },
      (_, index) => index + 1,
    ).reduce<Record<string, { type: 'string' }>>((acc, key) => {
      acc[key] = { type: 'string' }
      return acc
    }, {})

    expect(() => validateLoggerEventParams(paramsMap)).toThrowError(
      'logger params must contain up to 10 string values',
    )
  })

  it('should throw error for > 40 numeric params', () => {
    const paramsMap = Array.from(
      { length: 41 },
      (_, index) => index + 1,
    ).reduce<Record<string, { type: 'number' }>>((acc, key) => {
      acc[key] = { type: 'number' }
      return acc
    }, {})

    expect(() => validateLoggerEventParams(paramsMap)).toThrowError(
      'logger params must contain up to 40 numeric values',
    )
  })

  it('should not fail', () => {
    const paramsMap = Array.from(
      { length: 50 },
      (_, index) => index + 1,
    ).reduce<Record<string, { type: 'number' | 'string' }>>(
      (acc, key, index) => {
        acc[key] = { type: index % 5 === 0 ? 'string' : 'number' }
        return acc
      },
      {},
    )

    expect(() => validateLoggerEventParams(paramsMap)).not.toThrowError()
  })
})

describe('core-kit/utils/getErrorKey', () => {
  it('should find best full key match', () => {
    expect(getErrorKey('dh2', ['dh1', 'dh2', 'dh26', 'dh266'])).toEqual('dh2')
    expect(getErrorKey('dh26', ['dh1', 'dh2', 'dh26', 'dh266'])).toEqual('dh26')
    expect(getErrorKey('dh1', ['dh1', 'dh2', 'dh26', 'dh266'])).toEqual('dh1')
    expect(getErrorKey('dh26')).toEqual('dh26')
  })
})

describe('core-kit/utils/parseContractErrorMessage', () => {
  it('should resolve error hint and title params based on dh error code', () => {
    expect(
      parseContractErrorMessage({
        errorMessage: 'something wrong dh26',
        abiErrors: [],
      }),
    ).toEqual(TRANSACTION_ERRORS['dh26'])
    expect(
      parseContractErrorMessage({
        errorMessage: 'something dh2 wrong',
        abiErrors: [],
      }),
    ).toEqual(TRANSACTION_ERRORS['dh2'])
    expect(
      parseContractErrorMessage({
        errorMessage: 'something wrong: high swap slippage',
        abiErrors: [],
      }),
    ).toEqual(TRANSACTION_ERRORS['high swap slippage'])
  })
})
