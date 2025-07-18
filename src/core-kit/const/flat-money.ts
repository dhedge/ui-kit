import { RETH_BASE, WBTC_ARBITRUM, WBTC_OPTIMISM } from 'core-kit/const/tokens'

const FLATMONEY_LEVERAGED_ASSET_MAP = {
  RETH_BASE: '0xdb0cd65dcc7fe07003ce1201f91e1f966fa95768',
  WBTC_OPTIMISM: '0x6d857e9d24a7566bb72a3fb0847a3e0e4e1c2879',
  WBTC_ARBITRUM: '0xb1353d51991e79fefd4bfdba2a03e9f0232814a6',
} as const

type FlatMoneyLeveragedAssetAddress =
  (typeof FLATMONEY_LEVERAGED_ASSET_MAP)[keyof typeof FLATMONEY_LEVERAGED_ASSET_MAP]

type FlatMoneyCollateral = {
  symbol: string
  decimals: number
  address: string
}

export const FLAT_MONEY_LEVERAGED_ASSET_ADDRESSES = Object.values(
  FLATMONEY_LEVERAGED_ASSET_MAP,
)

export const FLAT_MONEY_COLLATERAL_MAP: Record<
  FlatMoneyLeveragedAssetAddress,
  FlatMoneyCollateral
> = {
  [FLATMONEY_LEVERAGED_ASSET_MAP.RETH_BASE]: {
    symbol: RETH_BASE.symbol,
    decimals: RETH_BASE.decimals,
    address: RETH_BASE.address,
  },
  [FLATMONEY_LEVERAGED_ASSET_MAP.WBTC_OPTIMISM]: {
    symbol: WBTC_OPTIMISM.symbol,
    decimals: WBTC_OPTIMISM.decimals,
    address: WBTC_OPTIMISM.address,
  },
  [FLATMONEY_LEVERAGED_ASSET_MAP.WBTC_ARBITRUM]: {
    symbol: WBTC_ARBITRUM.symbol,
    decimals: WBTC_ARBITRUM.decimals,
    address: WBTC_ARBITRUM.address,
  },
}

export const FLAT_MONEY_V1_UNIT_ADDRESS =
  '0xb95fb324b8a2faf8ec4f76e3df46c718402736e2' // RETH_BASE
export const FLAT_MONEY_UNIT_ADDRESSES = [
  FLAT_MONEY_V1_UNIT_ADDRESS,
  '0x357cb23571ef7a3d6189b7facfc361ea71f7cab5', // WBTC_OPTIMISM
]
