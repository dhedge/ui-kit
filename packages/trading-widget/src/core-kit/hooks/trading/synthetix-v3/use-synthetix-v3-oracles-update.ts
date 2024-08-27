import { useCallback } from 'react'

import { usePublicClient } from 'wagmi'

import {
  AddressZero,
  DEFAULT_RETRIES_NUMBER,
  EXTREMELY_SHORT_POLLING_INTERVAL,
} from 'core-kit/const'
import {
  useTradingPanelModal,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useAccount } from 'core-kit/hooks/web3'
import { isSynthetixV3Vault } from 'core-kit/utils'

import { useOraclesUpdateTransactionData } from './use-oracles-update-transaction-data'
import { useSendOraclesUpdateTransaction } from './use-send-oracles-update-transaction'

export const useSynthetixV3OraclesUpdate = ({
  disabled,
}: {
  disabled?: boolean
}) => {
  const { account } = useAccount()
  const { address: vaultAddress, chainId } = useTradingPanelPoolConfig()
  const isSynthetixVault = isSynthetixV3Vault(vaultAddress)
  const publicClient = usePublicClient({ chainId })
  const updateTradingModal = useTradingPanelModal()[1]
  const { sendTransaction } = useSendOraclesUpdateTransaction({
    chainId,
  })
  const { data: oraclesUpdateTransactionData, isFetching } =
    useOraclesUpdateTransactionData(
      {
        publicClient,
        account,
        chainId,
        vaultAddress,
      },
      {
        refetchInterval: EXTREMELY_SHORT_POLLING_INTERVAL,
        retry: DEFAULT_RETRIES_NUMBER,
        enabled: isSynthetixVault && !disabled,
      },
    )

  const updateOracles = useCallback(async () => {
    if (!oraclesUpdateTransactionData) return

    updateTradingModal({
      isOpen: true,
      status: 'Wallet',
      action: 'oraclesUpdate',
      link: '',
      sendToken: null,
      receiveToken: null,
    })

    try {
      return sendTransaction?.({
        to: oraclesUpdateTransactionData.to ?? AddressZero,
        data: oraclesUpdateTransactionData.data,
        value: oraclesUpdateTransactionData.value,
      })
    } catch (error) {
      updateTradingModal({
        isOpen: false,
        status: 'None',
        link: '',
        sendToken: null,
        receiveToken: null,
      })
    }
  }, [sendTransaction, oraclesUpdateTransactionData, updateTradingModal])

  return {
    needToBeUpdated: isSynthetixVault && !!oraclesUpdateTransactionData,
    updateOracles,
    isCheckOraclesPending: isFetching,
  }
}
