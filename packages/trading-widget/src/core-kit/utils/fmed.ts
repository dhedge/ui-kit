import { FLATMONEY_EARLY_DEPOSITOR_VAULT_ADDRESS_BASE } from 'core-kit/const'
import type { Address } from 'core-kit/types'

import { isEqualAddress } from './web3'

export const isFlatMoneyEarlyDepositorAddress = (address: Address) =>
  isEqualAddress(FLATMONEY_EARLY_DEPOSITOR_VAULT_ADDRESS_BASE, address)
