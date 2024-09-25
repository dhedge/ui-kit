import type { Hex } from 'viem'
import { isHex } from 'viem'

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseError(error: any): Hex {
  try {
    if (isHex(error)) {
      return error
    }
    if (isHex(error.data)) {
      return error.data
    }
    if (isHex(error.error?.data)) {
      return error.error.data
    }
    if (error.cause) {
      return parseError(error.cause)
    }
  } catch (err) {
    console.error('exception in erc7412 error parser:', err)
  }
  throw error
}

export const getErrorMessage = (error: unknown): string => {
  return error instanceof Error && error.message
    ? error.message
    : 'unknown error'
}
