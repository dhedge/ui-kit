import type { Address, ChainId } from 'core-kit/types'
import { getContractAddressById, isEqualAddress } from 'core-kit/utils/web3'

export interface IsLendAndBorrowAssetParams {
  address: Address
  chainId: ChainId
}

export const isAaveLendAndBorrowAsset = ({
  address,
  chainId,
}: IsLendAndBorrowAssetParams) => {
  const aaveLendingPoolV3Address = getContractAddressById(
    'aaveLendingPoolV3',
    chainId,
  )

  return isEqualAddress(address, aaveLendingPoolV3Address)
}
