import { SYNTHETIX_V3_ASSET_ADDRESS } from '../../../const'
import { useStaticCall } from '../../web3'
import type { Address, ChainId } from '../../../types'

interface UseSynthetixV3AssetBalanceVariables {
  vaultAddress: Address
  chainId?: ChainId
  disabled?: boolean
}

export const useSynthetixV3AssetBalance = ({
  vaultAddress,
  disabled,
  chainId,
}: UseSynthetixV3AssetBalanceVariables) =>
  useStaticCall<bigint>({
    contractId: 'synthetixV3AssetGuard',
    chainId,
    disabled,
    functionName: 'getBalanceMutable',
    args: [vaultAddress, SYNTHETIX_V3_ASSET_ADDRESS],
  })?.toString() ?? '0'
