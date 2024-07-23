import type { Address } from 'viem'

import {
  FLATMONEY_EARLY_DEPOSITOR_VAULT_ADDRESS_BASE,
  FLATMONEY_LEVERAGED_RETH_ASSET_MAP,
  FLATMONEY_UNIT_SYMBOL_MAP,
} from 'core-kit/const'

import { isEqualAddress } from './web3'

export const isFlatMoneyEarlyDepositorAddress = (address: Address) =>
  isEqualAddress(FLATMONEY_EARLY_DEPOSITOR_VAULT_ADDRESS_BASE, address)

export const isFlatMoneyLeveragedRethAsset = (address: Address) =>
  Object.values(FLATMONEY_LEVERAGED_RETH_ASSET_MAP).some((asset) =>
    isEqualAddress(asset, address),
  )

export const getFlatMonetUnitSymbol = (chainId: number) =>
  FLATMONEY_UNIT_SYMBOL_MAP[chainId] ?? 'UNIT'
