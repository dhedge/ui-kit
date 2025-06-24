import BigNumber from 'bignumber.js'

import { useMemo } from 'react'

import { erc20Abi } from 'core-kit/abi'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { getContractAddressById } from 'core-kit/utils'

export const useBatchApproveTransaction = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const spenderAddress = getContractAddressById('easySwapperV2', chainId)

  const rawDepositAmount = new BigNumber(sendToken.value || '0')
    .shiftedBy(sendToken.decimals)
    .toFixed(0, BigNumber.ROUND_UP)

  return useMemo(
    () => ({
      address: sendToken.address,
      abi: erc20Abi,
      functionName: 'approve',
      chainId,
      args: [spenderAddress, rawDepositAmount],
    }),
    [chainId, rawDepositAmount, sendToken.address, spenderAddress],
  )
}
