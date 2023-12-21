import {
  DHEDGE_SYNTHETIX_V3_ASSETS_MAP,
  DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES,
} from 'const'

import { isEqualAddress } from './web3'

export const isSynthetixVault = (address: string) =>
  DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES.some((vault) =>
    isEqualAddress(vault, address),
  )

export const isSynthetixAsset = (address: string) =>
  Object.values(DHEDGE_SYNTHETIX_V3_ASSETS_MAP).some((asset) =>
    isEqualAddress(asset, address),
  )
