import { useCallback, useEffect, useState } from 'react'

import { usePublicClient } from 'wagmi'

import { AddressZero } from 'const'
import { useTradingPanelModal, useTradingPanelPoolConfig } from 'hooks/state'
import type { TransactionRequest } from 'types'
import {
  getExplorerLink,
  getOracleUpdateTransaction,
  isSynthetixV3Vault,
} from 'utils'

import { useAccount, useBlockNumber, useSendTransaction } from '../web3'

export const useSynthetixV3OraclesUpdate = ({
  disabled,
}: {
  disabled?: boolean
}) => {
  const { account } = useAccount()
  const poolConfig = useTradingPanelPoolConfig()
  const isSynthetixVault = isSynthetixV3Vault(poolConfig.address)
  const publicClient = usePublicClient()
  const [txData, setTxData] = useState<TransactionRequest | null>(null)
  const { data: blockNumber } = useBlockNumber({ enabled: !disabled })
  const updateTradingModal = useTradingPanelModal()[1]
  const { sendTransaction } = useSendTransaction({
    onSettled(data, error, variables) {
      if (error) {
        updateTradingModal({
          isOpen: false,
          status: 'None',
          link: '',
          sendToken: null,
          receiveToken: null,
        })
        return
      }
      const link = getExplorerLink(
        data?.hash ?? AddressZero,
        'transaction',
        variables.chainId,
      )
      updateTradingModal({ isOpen: true, status: 'Mining', link })
    },
    onSuccess(data, variables) {
      const link = getExplorerLink(
        data?.hash ?? AddressZero,
        'transaction',
        variables.chainId,
      )
      updateTradingModal({ isOpen: true, status: 'Success', link })
    },
  })

  useEffect(() => {
    if (disabled) {
      return
    }

    ;(async () => {
      try {
        const txData = await getOracleUpdateTransaction({
          publicClient,
          account,
          chainId: poolConfig.chainId,
        })
        setTxData(txData)
      } catch {
        setTxData(null)
      }
    })()
  }, [account, publicClient, blockNumber, disabled, poolConfig.chainId])

  const updateOracles = useCallback(async () => {
    if (!txData) return

    updateTradingModal({
      isOpen: true,
      status: 'Wallet',
      action: 'oraclesUpdate',
      link: '',
      sendToken: null,
      receiveToken: null,
    })

    try {
      return sendTransaction({
        to: txData.to ?? AddressZero,
        data: txData.data,
        value: txData.value,
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
  }, [sendTransaction, txData, updateTradingModal])

  return { needToBeUpdated: isSynthetixVault && !!txData, updateOracles }
}
