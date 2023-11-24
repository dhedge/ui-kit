import type { ContractId } from 'const'
import { AddressZero, contractsAbisMap, contractsAddressesMap } from 'const'
import type { Address, ChainId } from 'types/web3.types'
import { arbitrum, mainnet, optimism, polygon } from 'wagmi/chains'
import type { Chain } from 'wagmi/chains'

export { formatUnits, formatEther, encodeFunctionData } from 'viem'
export { getContract } from 'wagmi/actions'

export const getContractAddressById = (
  contractId: ContractId,
  chainId: ChainId,
): Address => contractsAddressesMap[chainId]?.[contractId] ?? AddressZero

export const getContractAbiById = (contractId: ContractId) =>
  contractsAbisMap[contractId]

export const isZeroAddress = (address: string | undefined) =>
  address === AddressZero

export const shortenAddress = (address: string): string => {
  if (!address) return address
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4,
    address.length,
  )}`
}

export const getChainData = (chainId: number): Chain | undefined => {
  switch (chainId) {
    case optimism.id:
      return optimism
    case polygon.id:
      return polygon
    case mainnet.id:
      return mainnet
    case arbitrum.id:
      return arbitrum
  }
}

export const commify = (value: string) =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
