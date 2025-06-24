import { useCallback } from 'react'

import type { Address } from 'viem'
import { type UseSendCallsParameters, useSendCalls } from 'wagmi'

import { encodeFunctionData } from 'core-kit/utils'

interface ContractsFunctionsOptions {
  onSettled?: Required<UseSendCallsParameters>['mutation']['onSettled']
}

interface SendCallsParams {
  address: Address
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abi: any
  functionName: string
  args: unknown[]
  value?: bigint
}

const prepareCallData = ({
  address,
  abi,
  functionName,
  args,
  value,
}: SendCallsParams) => ({
  to: address,
  data: encodeFunctionData({ abi, functionName, args }),
  value,
})

export const useCustomSendCalls = ({
  onSettled,
}: ContractsFunctionsOptions) => {
  const { sendCalls } = useSendCalls({
    mutation: {
      onSettled,
    },
  })

  return useCallback(
    async (contracts: SendCallsParams[]) =>
      sendCalls({
        calls: contracts.map(prepareCallData),
      }),
    [sendCalls],
  )
}
