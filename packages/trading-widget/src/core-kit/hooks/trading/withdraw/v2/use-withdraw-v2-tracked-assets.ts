import { useReadContract, useReadContracts } from 'wagmi'

import { erc20Abi } from 'core-kit/abi'
import { WithdrawalVaultAbi } from 'core-kit/abi/withdrawal-vault'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useWithdrawV2VaultContractAddress } from 'core-kit/hooks/trading/withdraw/v2/use-withdraw-v2-vault-contract-address'
import { isZeroAddress } from 'core-kit/utils'
import {DEFAULT_PRECISION} from "core-kit/const";

export const useWithdrawV2TrackedAssets = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const withdrawalContractAddress = useWithdrawV2VaultContractAddress()

  const { data: assets = [] } = useReadContract({
    address: withdrawalContractAddress,
    abi: WithdrawalVaultAbi,
    functionName: 'getTrackedAssets',
    chainId,
    args: [],
    query: { enabled: !isZeroAddress(withdrawalContractAddress) },
  })

  return useReadContracts({
    contracts: assets.flatMap((asset) => [
      {
        address: asset,
        abi: erc20Abi,
        functionName: 'symbol',
        chainId,
        args: [],
      },
      {
        address: asset,
        abi: erc20Abi,
        functionName: 'decimals',
        chainId,
        args: [],
      },
      {
        address: asset,
        abi: erc20Abi,
        functionName: 'balanceOf',
        chainId,
        args: [withdrawalContractAddress],
      },
    ]),
    query: {
      enabled: assets.length > 0,
      select(data) {
        return assets.map((address, index) => {
          const symbolIndex = index * 3
          const decimalsIndex = symbolIndex + 1
          const balanceIndex = decimalsIndex + 1
          return {
            address,
            symbol: data[symbolIndex]?.result?.toString() ?? '',
            decimals: Number(data[decimalsIndex]?.result ?? DEFAULT_PRECISION),
            balance: BigInt(data[balanceIndex]?.result ?? 0),
          }
        })
      },
    },
  })
}
