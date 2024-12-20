import BigNumber from 'bignumber.js'

import { AddressZero } from 'core-kit/const'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useApprove, useCanSpend } from 'core-kit/hooks/trading/allowance'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-is-multi-asset-withdraw'
import { useAccount } from 'core-kit/hooks/web3'
import { getContractAddressById } from 'core-kit/utils'

export const useInitWithdrawAllowance = () => {
  const { account } = useAccount()
  const { chainId } = useTradingPanelPoolConfig()
  const isMultiAssetsWithdraw = useIsMultiAssetWithdraw()
  const [sendToken] = useSendTokenInput()
  const withdrawProductRawAmount = new BigNumber(sendToken.value || '0')
    .shiftedBy(sendToken.decimals)
    .toFixed(0, BigNumber.ROUND_UP)

  const spenderAddress = getContractAddressById('easySwapperV2', chainId)
  const canSpend = useCanSpend({
    tokenAddress: sendToken.address,
    ownerAddress: account ?? AddressZero,
    spenderAddress,
    rawAmountToSpend: withdrawProductRawAmount,
    chainId,
    skip: isMultiAssetsWithdraw || withdrawProductRawAmount === '0',
  })

  const approve = useApprove({
    token: sendToken,
    rawTokenAmount: withdrawProductRawAmount,
    spenderAddress,
  })

  return { canSpend, approve }
}
