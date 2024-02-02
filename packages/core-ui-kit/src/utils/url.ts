import { CHAIN_MAP } from 'const'
import type { Address, ChainId } from 'types/web3.types'

export type ExplorerDataType = 'transaction' | 'address'

export function getExplorerLink(
  address: Address,
  type: ExplorerDataType,
  chainId?: ChainId,
): string | undefined {
  if (!chainId) return

  const blockExplorerUrl =
    CHAIN_MAP[chainId as keyof typeof CHAIN_MAP]?.blockExplorers?.default.url
  if (blockExplorerUrl) {
    switch (type) {
      case 'transaction':
        return `${blockExplorerUrl}/tx/${address}`
      default:
        return `${blockExplorerUrl}/address/${address}`
    }
  }
}
