import { PythAdapter } from 'erc7412/dist/src/adapters/pyth'

import {
  DHEDGE_SYNTHETIX_V3_ASSETS_MAP,
  DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES,
  PYTH_API_LINK,
  SYNTHETIX_V3_POSITION_DEBT_ARGUMENTS,
} from 'core-kit/const'

import type { usePublicClient } from 'core-kit/hooks/web3'

import type { Address, OracleAdapter, TransactionRequest } from 'core-kit/types'

import { Eip7412 } from './synthetix-v3/eip-7412'
import { TrustedMulticallForwarderBatcher } from './synthetix-v3/multicall-forwarder-batcher'
import {
  encodeFunctionData,
  getContractAbiById,
  getContractAddressById,
  isEqualAddress,
} from './web3'

export const isSynthetixV3Vault = (address: string) =>
  DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES.some((vault) =>
    isEqualAddress(vault, address),
  )

export const isSynthetixV3Asset = (address: string) =>
  Object.values(DHEDGE_SYNTHETIX_V3_ASSETS_MAP).some((asset) =>
    isEqualAddress(asset, address),
  )

// eip-7412: https://eips.ethereum.org/EIPS/eip-7412
// usecannon example, https://github.com/usecannon/cannon/blob/main/packages/website/src/helpers/ethereum.ts

// some of the code is modified from: https://github.com/Synthetixio/erc7412/pull/10

// this is to check and update the oracle data if necessary,
// to ensure all actions executed as expected.

// desc: https://mirror.xyz/noahlitvin.eth/_R6jCY5JHlPl2q8VvXblCDzQAqptXdz5AhRxfvsVYLc
export const getOracleUpdateTransaction = async ({
  publicClient,
  account,
  chainId,
  vaultAddress,
}: {
  publicClient: NonNullable<ReturnType<typeof usePublicClient>>
  account?: Address
  chainId: number
  vaultAddress: string
}): Promise<TransactionRequest | null> => {
  if (!account) {
    return null
  }

  const trustedMulticallForwarderBatcher =
    new TrustedMulticallForwarderBatcher()
  const eip7412 = new Eip7412(
    // Check compatibility
    // Remove casting after viem update https://github.com/Synthetixio/erc7412/blob/main/package.json#L30
    [new PythAdapter(PYTH_API_LINK) as OracleAdapter],
    trustedMulticallForwarderBatcher,
  )

  // use getPositionDebt as the probing transaction
  const txData = encodeFunctionData({
    abi: getContractAbiById('synthetixV3Core'),
    functionName: 'getPositionDebt',
    args:
      SYNTHETIX_V3_POSITION_DEBT_ARGUMENTS[vaultAddress.toLowerCase()] ?? [],
  })

  let transactions: TransactionRequest[] = []
  try {
    transactions = await eip7412.buildTransactions(publicClient, {
      from: account,
      to: getContractAddressById('synthetixV3Core', chainId),
      data: txData as `0x${string}`,
    })
  } catch (err) {
    console.error(err)
  }

  if (transactions.length <= 1 || !transactions.length) {
    return null
  }

  // only execute the prepended txns, so remove the last one
  const prependedCalls = transactions.slice(0, transactions.length - 1)
  return trustedMulticallForwarderBatcher.batch(prependedCalls)
}
