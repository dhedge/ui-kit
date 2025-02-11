import { useCallback } from 'react'

import type { ContractId } from 'core-kit/const'
import {
  AddressZero,
  DEFAULT_PROMISE_TIMEOUT_MS,
  DEFAULT_SIMULATION_ERROR,
  GAS_ESTIMATION_ERROR,
  GAS_LIMIT_BUFFER_COEFF,
  MAX_GAS_LIMIT_MAP,
  SIMULATION_TIMEOUT_ERROR,
} from 'core-kit/const'
import { useOnSimulateTransaction } from 'core-kit/hooks/state'
import {
  useAccount,
  useNetwork,
  usePublicClient,
  useWalletClient,
  useWriteContract,
} from 'core-kit/hooks/web3'
import { EstimationError } from 'core-kit/models'
import type {
  Address,
  EstimateCall,
  SimulateTransactionResponse,
  UseWriteContractParameters,
} from 'core-kit/types/web3.types'
import {
  encodeFunctionData,
  getContractAbiById,
  getContractAddressById,
  getErrorMessage,
} from 'core-kit/utils'

interface ContractFunctionOptions {
  contractId: ContractId
  functionName: string
  dynamicContractAddress?: Address
  onSettled?: Required<UseWriteContractParameters>['mutation']['onSettled']
}

const sendStub = async () => undefined

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkArgsForTxOverrides = (args: any[]) => {
  const lastArg = args[args.length - 1]
  // Checks only if transaction has native token value override or gas
  const hasTransactionOverrides =
    typeof lastArg === 'object' &&
    lastArg !== null &&
    ('value' in lastArg || 'gas' in lastArg)
  const transactionOverrides = hasTransactionOverrides ? lastArg : {}
  const argumentsWithoutOverrides = hasTransactionOverrides
    ? args.slice(0, -1)
    : args

  return { transactionOverrides, argumentsWithoutOverrides }
}

export const useContractFunction = ({
  functionName,
  dynamicContractAddress,
  contractId,
  onSettled,
}: ContractFunctionOptions) => {
  const { account } = useAccount()
  const { chainId, supportedChainId } = useNetwork()

  const walletClient = useWalletClient({ chainId })
  const publicClient = usePublicClient({ chainId })
  const contractAbi = getContractAbiById(contractId)
  const contractAddress =
    dynamicContractAddress ??
    getContractAddressById(contractId, chainId ?? supportedChainId)

  const simulateTransaction = useOnSimulateTransaction()

  const { writeContract } = useWriteContract({
    mutation: {
      onSettled,
    },
  })

  const estimate = useCallback<EstimateCall>(
    async (...args: unknown[]) => {
      try {
        const { argumentsWithoutOverrides, transactionOverrides } =
          checkArgsForTxOverrides(args)
        const estimation = await publicClient?.estimateContractGas({
          address: contractAddress,
          abi: contractAbi,
          functionName,
          args: argumentsWithoutOverrides,
          account: account ?? AddressZero,
          gas: transactionOverrides.gas,
          value: transactionOverrides.value,
        })

        if (!estimation || !chainId || estimation === BigInt(0)) {
          return { error: GAS_ESTIMATION_ERROR, value: BigInt(0) }
        }
        // increased gas limit to avoid tx failure
        const bufferedGasLimit = Math.round(
          Number(estimation) * GAS_LIMIT_BUFFER_COEFF,
        )
        const maxGasLimit = MAX_GAS_LIMIT_MAP[chainId] ?? bufferedGasLimit
        const value = BigInt(Math.min(maxGasLimit, bufferedGasLimit))
        console.debug(
          `[core-ui-kit]: estimated gas limit: ${Number(estimation)}`,
        )
        return { error: '', value }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(`Gas estimate error on ${functionName}`, error)
        return {
          error:
            error?.message ??
            error?.shortMessage ??
            error.error?.data?.message ??
            error.data?.message ??
            GAS_ESTIMATION_ERROR,
          value: BigInt(0),
        }
      }
    },
    [
      account,
      chainId,
      publicClient,
      functionName,
      contractAddress,
      contractAbi,
    ],
  )

  const simulate = useCallback(
    async (...args: unknown[]) => {
      try {
        if (!simulateTransaction) {
          return { data: null, error: DEFAULT_SIMULATION_ERROR }
        }
        if (!publicClient) {
          return { data: null, error: 'Client is not defined' }
        }

        const { argumentsWithoutOverrides, transactionOverrides } =
          checkArgsForTxOverrides(args)

        const txData = encodeFunctionData({
          abi: contractAbi,
          functionName,
          args: argumentsWithoutOverrides,
        })

        if (account && txData) {
          const data = await simulateTransaction({
            chainId: chainId ?? supportedChainId,
            from: account,
            to: contractAddress,
            input: txData,
            gas: MAX_GAS_LIMIT_MAP[chainId ?? supportedChainId] ?? 0,
            value: transactionOverrides.value?.toString(),
          })
          return { data, error: data?.simulation.error_message }
        }

        return { data: null, error: DEFAULT_SIMULATION_ERROR }
      } catch (error) {
        console.debug('Failed to simulate:', error)
        return { data: null, error: getErrorMessage(error) }
      }
    },
    [
      account,
      chainId,
      publicClient,
      contractAbi,
      contractAddress,
      functionName,
      simulateTransaction,
      supportedChainId,
    ],
  )

  const customSend = useCallback(
    async (...args: unknown[]) => {
      const { argumentsWithoutOverrides, transactionOverrides } =
        checkArgsForTxOverrides(args)

      if (transactionOverrides.gas) {
        return writeContract({
          address: contractAddress,
          abi: contractAbi,
          functionName,
          chainId,
          args: argumentsWithoutOverrides,
          ...transactionOverrides,
        })
      }

      const { value: gas, error: gasEstimateError } = await estimate(...args)
      if (gasEstimateError) {
        const { data } = await Promise.race<{
          data: SimulateTransactionResponse | null
          error?: string
        }>([
          simulate(...args),
          new Promise((resolve) =>
            setTimeout(resolve, DEFAULT_PROMISE_TIMEOUT_MS, {
              data: null,
              error: SIMULATION_TIMEOUT_ERROR,
            }),
          ),
        ])

        throw new EstimationError({
          message: gasEstimateError,
          link: data?.link,
          txArgs: args,
          account,
          functionName,
          onBypass: () =>
            walletClient?.data?.writeContract({
              address: contractAddress,
              abi: contractAbi,
              functionName,
              account,
              chainId,
              args: argumentsWithoutOverrides,
              ...transactionOverrides,
              gas: BigInt(MAX_GAS_LIMIT_MAP[chainId ?? supportedChainId] ?? 0),
            }),
        })
      }

      console.debug(`[core-ui-kit]: gas limit to use: ${gas}`)
      return writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName,
        chainId,
        args: argumentsWithoutOverrides,
        ...transactionOverrides,
        gas,
      })
    },
    [
      estimate,
      writeContract,
      simulate,
      account,
      functionName,
      walletClient?.data,
      contractAddress,
      contractAbi,
      chainId,
      supportedChainId,
    ],
  )

  return {
    send: chainId && publicClient ? customSend : sendStub,
    estimate,
  }
}
