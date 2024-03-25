import type { Hex } from 'core-kit/types'

// from https://github.com/Synthetixio/erc7412
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseError(error: any): Hex {
  try {
    if (error.cause?.data) {
      return error.cause?.data
    }
    if (error.cause?.cause?.data) {
      return error.cause?.cause?.data
    }
    if (error.cause?.cause?.cause?.data) {
      return error.cause?.cause?.cause?.data
    }
    if (error.cause?.cause?.error?.data) {
      return error.cause?.cause?.error?.data
    }
    if (error.cause?.cause?.cause?.error?.data) {
      return error.cause?.cause?.cause?.error?.data
    }
  } catch (err) {
    console.error('Exception in erc7412 error parser:', err)
  }
  // rethrow the error (and log it so we can see the original)
  console.error('Got unknown error in erc7412 parse', error)
  throw error
}

export const getErrorMessage = (error: unknown): string => {
  return error instanceof Error && error.message
    ? error.message
    : 'unknown error'
}
