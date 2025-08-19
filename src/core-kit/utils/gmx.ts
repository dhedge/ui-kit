import type { Address } from 'viem'

import type { GmxMarketAsset } from 'core-kit/const'
import {
  AddressZero,
  GMX_MARKET_ASSETS,
  GMX_WITHDRAW_ASSET_MAP,
  GMX_WITHDRAW_ASSET_MAP_BY_VAULT_ADDRESS,
} from 'core-kit/const'
import { isEqualAddress } from 'core-kit/utils/web3'

export const isGmxLeveragedAsset = (address: Address) =>
  GMX_MARKET_ASSETS.some((asset) => isEqualAddress(asset, address))

export const getGmxWithdrawAssetByLeverageAddress = (address: string) =>
  GMX_WITHDRAW_ASSET_MAP[address.toLowerCase() as GmxMarketAsset] ?? {
    symbol: '',
    decimals: 18,
    address: AddressZero,
  }

export const getGmxWithdrawAssetByVaultAddress = (address: Address) =>
  GMX_WITHDRAW_ASSET_MAP_BY_VAULT_ADDRESS[address.toLowerCase()]
