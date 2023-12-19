import { SYNTHETIX_V3_ASSETS_MAP, SYNTHETIX_V3_VAULT_ADDRESSES } from 'const'

import { isEqualAddress } from './web3'

export const isSynthetixVault = (address: string) =>
  SYNTHETIX_V3_VAULT_ADDRESSES.some((vault) => isEqualAddress(vault, address))

export const isSynthetixAsset = (address: string) =>
  Object.values(SYNTHETIX_V3_ASSETS_MAP).some((vault) =>
    isEqualAddress(vault, address),
  )
