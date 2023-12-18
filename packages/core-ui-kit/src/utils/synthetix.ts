import { isEqualAddress } from './web3'
import { SYNTHETIX_V3_VAULT_ADDRESSES } from '../const'

export const isSynthetixVault = (address: string) =>
  SYNTHETIX_V3_VAULT_ADDRESSES.some((vault) => isEqualAddress(vault, address))
