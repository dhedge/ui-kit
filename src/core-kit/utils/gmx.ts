import type { Address } from 'viem'

import type { GmxMarketAsset } from 'core-kit/const'
import {
  AddressZero,
  GMX_MARKET_ASSETS,
  GMX_WITHDRAW_ASSET_MAP,
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
