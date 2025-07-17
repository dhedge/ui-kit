import type { ContractId } from 'core-kit/const'
import {
  AddressZero,
  contractsAbisMap,
  contractsAddressesMap,
} from 'core-kit/const'
import type { Address, ChainId } from 'core-kit/types/web3.types'

export {
  formatUnits,
  formatEther,
  encodeFunctionData,
  decodeErrorResult,
  hexToString,
  trim,
} from 'viem'

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

export const commify = (value: string) =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const isEqualAddress = (a: string | undefined, b: string | undefined) =>
  a?.toLowerCase() === b?.toLowerCase()
