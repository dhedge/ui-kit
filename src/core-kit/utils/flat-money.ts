import type { Address } from 'viem'

import {
  AddressZero,
  FLATMONEY_DHT_STAKING_VAULT_ADDRESS_BASE,
  FLATMONEY_EARLY_DEPOSITOR_VAULT_ADDRESS_BASE,
  FLAT_MONEY_COLLATERAL_MAP,
  FLAT_MONEY_LEVERAGED_ASSET_ADDRESSES,
  FLAT_MONEY_UNIT_LINK,
  FLAT_MONEY_V1_UNIT_ADDRESS,
  FLAT_MONEY_V1_UNIT_LINK,
} from 'core-kit/const'

import { isEqualAddress } from 'core-kit/utils/web3'

export const isFmpAirdropVaultAddress = (address: Address) =>
  isEqualAddress(FLATMONEY_EARLY_DEPOSITOR_VAULT_ADDRESS_BASE, address) ||
  isEqualAddress(FLATMONEY_DHT_STAKING_VAULT_ADDRESS_BASE, address)

export const isFlatMoneyLeveragedAsset = (address: Address) =>
  FLAT_MONEY_LEVERAGED_ASSET_ADDRESSES.some((asset) =>
    isEqualAddress(asset, address),
  )

export const getFlatMoneyCollateralByLeverageAddress = (address: string) =>
  FLAT_MONEY_COLLATERAL_MAP[address.toLowerCase()] ?? {
    symbol: '',
    decimals: 18,
    address: AddressZero,
  }

export const getFlatMoneyLinkByUnitAddress = (address: string) =>
  isEqualAddress(address, FLAT_MONEY_V1_UNIT_ADDRESS)
    ? FLAT_MONEY_V1_UNIT_LINK
    : FLAT_MONEY_UNIT_LINK
