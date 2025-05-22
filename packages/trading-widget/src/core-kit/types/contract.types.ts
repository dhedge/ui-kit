import type { Address } from 'viem'

type AssetStructure = { asset: Address; amount: bigint }

export interface CalculateSwapDataParamsResponse {
  srcData: AssetStructure[]
  dstData: AssetStructure
}

export interface ComplexWithdrawAssetData {
  supportedAsset: Address
  withdrawData: string
  slippageTolerance: bigint
}
