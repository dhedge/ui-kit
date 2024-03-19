import BigNumber from 'bignumber.js'

import { useEffect } from 'react'

import { AddressZero } from 'core-kit/const'
import {
  useSendTokenInput,
  useTradingPanelApprovingStatus,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useApprove, useCanSpend } from 'core-kit/hooks/trading/allowance'
import { useAccount } from 'core-kit/hooks/web3'
import { getContractAddressById, isNativeToken } from 'core-kit/utils'

import { useIsEasySwapperTrading } from '../use-is-easy-swapper-trading'

export const useDepositAllowance = () => {
  const { account } = useAccount()
  const poolConfig = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const updateApprovingStatus = useTradingPanelApprovingStatus()[1]
  const isEasySwapperTrading = useIsEasySwapperTrading()

  const rawDepositAmount = new BigNumber(sendToken.value || '0')
    .shiftedBy(sendToken.decimals)
    .toFixed(0, BigNumber.ROUND_UP)

  const spenderAddress = isEasySwapperTrading
    ? getContractAddressById('easySwapper', poolConfig.chainId)
    : poolConfig.address

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
