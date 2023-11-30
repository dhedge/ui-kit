import BigNumber from 'bignumber.js'

import { useEffect } from 'react'

import { AddressZero } from 'const'
import {
  useSendTokenInput,
  useTradingPanelApprovingStatus,
  useTradingPanelPoolConfig,
} from 'hooks/state'
import { useApprove, useCanSpend } from 'hooks/trading/allowance'
import { useAccount } from 'hooks/web3'
import { getContractAddressById } from 'utils'

import { useIsMultiAssetWithdraw } from './use-is-multi-asset-withdraw'

export const useWithdrawAllowance = () => {
  const { account } = useAccount()
  const isMultiAssetsWithdraw = useIsMultiAssetWithdraw()
  const [sendToken] = useSendTokenInput()
  const [, updateApprovingStatus] = useTradingPanelApprovingStatus()
  const { chainId } = useTradingPanelPoolConfig()
  const withdrawProductRawAmount = new BigNumber(sendToken.value || '0')
    .shiftedBy(sendToken.decimals)
    .toFixed(0, BigNumber.ROUND_UP)

  const spenderAddress = getContractAddressById('easySwapper', chainId)
  const canSpend = useCanSpend({
    tokenAddress: sendToken.address,
    ownerAddress: account ?? AddressZero,
    spenderAddress,
    rawAmountToSpend: withdrawProductRawAmount,
    chainId,
    skip: isMultiAssetsWithdraw || withdrawProductRawAmount === '0',
  })

  useEffect(() => {
    updateApprovingStatus(canSpend ? 'success' : undefined)
  }, [updateApprovingStatus, canSpend])

  const approve = useApprove({
    token: sendToken,
    rawTokenAmount: withdrawProductRawAmount,
    spenderAddress,
  })

  return { canSpend, approve }
}
