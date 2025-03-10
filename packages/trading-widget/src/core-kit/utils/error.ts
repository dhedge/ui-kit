import {
  EASY_SWAPPER_TRANSACTION_ERRORS,
  LIMIT_ORDER_TRANSACTION_ERRORS,
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
  const reason = abiErrors.find((e) => errorMessage.includes(e))
  const [shortMessage] = errorMessage
    .split(reason ? '.' : 'Contract')
    .map((s) => s.trim())

  return (
    EASY_SWAPPER_TRANSACTION_ERRORS[reason ?? errorMessage] ??
    LIMIT_ORDER_TRANSACTION_ERRORS[reason ?? errorMessage] ?? {
      title: 'Transaction failed',
      hint: `${truncateError(shortMessage ?? '')} ${reason ? `: ${reason}` : ''}`,
    }
  )
}
