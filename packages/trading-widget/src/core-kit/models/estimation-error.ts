import { CustomError } from 'ts-custom-error'

import { DEFAULT_ERROR_MESSAGE } from 'core-kit/const'

interface EstimationErrorParams {
  txArgs: unknown[]
  account?: string
  message?: string
  link?: string
  slippage?: number | 'auto'

  functionName?: string
  onBypass?: () => void
}

export class EstimationError extends CustomError {
  txArgs: unknown[]
  link?: string
  account?: string
  slippage?: number | 'auto'

  functionName?: string
  onBypass?: () => void

  constructor({
    message = DEFAULT_ERROR_MESSAGE,
    link,
    slippage,
    txArgs,
    account,
    onBypass,
    functionName,
  }: EstimationErrorParams) {
    super(message)

    this.link = link
    this.txArgs = txArgs
    this.account = account
    this.slippage = slippage
    this.functionName = functionName
    this.onBypass = onBypass
  }
}
