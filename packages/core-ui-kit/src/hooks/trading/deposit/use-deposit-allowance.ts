import BigNumber from 'bignumber.js'

import { AddressZero } from 'const'
import {
  useSendTokenInput,
  useTradingPanelApprovingStatus,
  useTradingPanelPoolConfig,
} from 'hooks/state'
import { useApprove, useCanSpend } from 'hooks/trading/allowance'
import { useAccount } from 'hooks/web3'
import { useEffect } from 'react'
import { getContractAddressById, isNativeToken } from 'utils'

export const useDepositAllowance = () => {
  const { account } = useAccount()
  const poolConfig = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const updateApprovingStatus = useTradingPanelApprovingStatus()[1]

  const rawDepositAmount = new BigNumber(sendToken.value || '0')
    .shiftedBy(sendToken.decimals)
    .toFixed(0, BigNumber.ROUND_UP)

  const spenderAddress = getContractAddressById(
    'easySwapper',
    poolConfig.chainId,
  )
  const canSpend = useCanSpend({
    tokenAddress: sendToken.address,
    ownerAddress: account ?? AddressZero,
    spenderAddress,
    rawAmountToSpend: rawDepositAmount,
    chainId: poolConfig.chainId,
    skip:
      isNativeToken(sendToken.symbol, poolConfig.chainId) ||
      rawDepositAmount === '0',
  })
  const approve = useApprove({
    token: sendToken,
    rawTokenAmount: rawDepositAmount,
    spenderAddress,
  })

  useEffect(() => {
    updateApprovingStatus(canSpend ? 'success' : undefined)
  }, [updateApprovingStatus, canSpend])

  return { approve, canSpend }
}
