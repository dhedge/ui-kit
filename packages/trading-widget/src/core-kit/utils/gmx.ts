import type { Address } from 'viem'

import type { GmxMarketAsset } from 'core-kit/const'
import {
  AddressZero,
  GMX_COLLATERAL_MAP,
  GMX_MARKET_ASSETS,
} from 'core-kit/const'
import { isEqualAddress } from 'core-kit/utils/web3'

export const isGmxLeveragedAsset = (address: Address) =>
  GMX_MARKET_ASSETS.some((asset) => isEqualAddress(asset, address))

export const getGmxCollateralByLeverageAddress = (address: string) =>
  GMX_COLLATERAL_MAP[address.toLowerCase() as GmxMarketAsset] ?? {
    symbol: '',
    decimals: 18,
    address: AddressZero,
  }
