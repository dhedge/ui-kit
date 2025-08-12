import {
  LIMIT_ORDER_TRANSACTION_ERRORS,
  TRANSACTION_ERRORS,
  TRANSACTION_ERROR_KEYS,
} from 'core-kit/const'

type ErrorWithMessage = {
  message: string
}

export const isErrorWithMessage = (error: unknown): error is ErrorWithMessage =>
  typeof error === 'object' &&
  error !== null &&
  'message' in error &&
  typeof (error as Record<string, unknown>).message === 'string'

export const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) {
    return maybeError
  }

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    return new Error(String(maybeError))
  }
}

export const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message
}

export const validateLoggerEventParams = (
  paramsMap: Record<string, { type: 'string' | 'number' }>,
) => {
  const counters = Object.values(paramsMap).reduce(
    (acc, { type }) => {
      acc[type] = acc[type] + 1
      return acc
    },
    { string: 0, number: 0 },
  )

  if (counters.string > 10) {
    throw new Error('logger params must contain up to 10 string values')
  }

  if (counters.number > 40) {
    throw new Error('logger params must contain up to 40 numeric values')
  }

  return true
}

const truncateError = (error: string, maxLength = 150) => {
  if (error.length > maxLength) {
    return error.substring(0, maxLength)
  }
  return error
}

export const getErrorKey = (value: string, keys = TRANSACTION_ERROR_KEYS) => {
  const lowerValue = value.toLowerCase()

  return keys
    .sort((a, b) => b.length - a.length)
    .find((key) => lowerValue.includes(key.toLowerCase()))
}

const getErrorParams = (value: string) =>
  TRANSACTION_ERRORS[value] ?? LIMIT_ORDER_TRANSACTION_ERRORS[value]

export const parseContractErrorMessage = ({
  errorMessage,
  abiErrors,
}: {
  errorMessage: string | undefined | null
  abiErrors: string[]
}) => {
  if (!errorMessage || errorMessage.includes('User rejected')) {
    return null
  }

  const errorName = abiErrors.find((e) => errorMessage.includes(e))

  if (errorName && !!getErrorKey(errorName)) {
    return getErrorParams(errorName)
  }

  const errorKey = getErrorKey(errorMessage)

  if (errorKey) {
    return getErrorParams(errorKey)
  }

  const [shortMessage] = errorMessage
    .split(errorName ? '.' : 'Contract')
    .map((s) => s.trim())

  return {
    title: 'Transaction failed',
    hint: `${truncateError(shortMessage ?? '')} ${errorName ? `: ${errorName}` : ''}`,
  }
}
