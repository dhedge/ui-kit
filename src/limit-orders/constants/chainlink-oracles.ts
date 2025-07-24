import type { Address } from 'viem'

import { isEqualAddress } from 'core-kit/utils'

export const XRP_ORACLE_ARBITRUM: Address =
  '0xB4AD57B52aB9141de9926a3e0C8dc6264c2ef205'
export const DOGE_ORACLE_ARBITRUM: Address =
  '0x9A7FB1b3950837a8D9b40517626E11D4127C098C'
export const BNB_ORACLE_ARBITRUM: Address =
  '0x6970460aabF80C5BE983C6b74e5D06dEDCA95D4A'
export const HYPE_ORACLE_ARBITRUM: Address =
  '0xf9ce4fE2F0EcE0362cb416844AE179a49591D567'

const CHAINLINK_ORACLES_ADDRESSES = [
  XRP_ORACLE_ARBITRUM,
  DOGE_ORACLE_ARBITRUM,
  BNB_ORACLE_ARBITRUM,
  HYPE_ORACLE_ARBITRUM,
]

export const isChainlinkOracleAddress = (address: Address): boolean =>
  CHAINLINK_ORACLES_ADDRESSES.some((oracle) => isEqualAddress(oracle, address))
