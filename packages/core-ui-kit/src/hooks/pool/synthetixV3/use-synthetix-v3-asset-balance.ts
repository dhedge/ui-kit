import { zeroAddress } from 'viem'

import { DHEDGE_SYNTHETIX_V3_ASSETS_MAP } from 'const'
import { useStaticCall } from 'hooks/web3'
import type { Address, ChainId } from 'types'

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
    args: [
      vaultAddress,
      chainId ? DHEDGE_SYNTHETIX_V3_ASSETS_MAP[chainId] : zeroAddress,
    ],
  })?.toString() ?? '0'
