import type { Address } from 'viem'

export interface DynamicPoolContractData {
  userBalance: string | undefined
  tokenPrice: string | undefined
  getExitRemainingCooldown: string | undefined
  totalValue: string | undefined
  totalSupply: string | undefined
  isPrivateVault: boolean | undefined
  performanceFee: string | undefined
  streamingFee: string | undefined
  entryFee: string | undefined
  exitFee: string | undefined
  managerAddress: string | undefined
}

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
