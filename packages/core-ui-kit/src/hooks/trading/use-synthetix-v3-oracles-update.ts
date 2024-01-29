import { useCallback, useEffect, useState } from 'react'

import { usePublicClient } from 'wagmi'

import { AddressZero } from 'const'
import { useTradingPanelModal, useTradingPanelPoolConfig } from 'hooks/state'
import type { Address, TransactionRequest } from 'types'
import {
  getExplorerLink,
  getOracleUpdateTransaction,
  isSynthetixV3Vault,
} from 'utils'

import {
  useAccount,
  useBlockNumber,
  useSendTransaction,
  useWaitForTransaction,
} from '../web3'

export const useSendUpdateTransaction = ({
  chainId,
}: {
  chainId: number
}): ReturnType<typeof useSendTransaction> => {
  const [txHash, setTxHash] = useState<Address>()
  const updateTradingModal = useTradingPanelModal()[1]

  const sendTransaction = useSendTransaction({
    onSettled(data, error) {
      if (error) {
        updateTradingModal({
          isOpen: false,
          status: 'None',
          link: '',
          sendToken: null,
          receiveToken: null,
        })
        setTxHash(undefined)
        return
      }
      const link = getExplorerLink(
        data?.hash ?? AddressZero,
        'transaction',
        chainId,
      )
      setTxHash(data?.hash ?? undefined)
      updateTradingModal({ isOpen: true, status: 'Mining', link })
    },
  })

  useWaitForTransaction({
    hash: txHash,
    chainId: chainId,
    onSuccess(data) {
      const txHash = data?.transactionHash as Address
      if (txHash) {
        const link = getExplorerLink(txHash, 'transaction', chainId)
        updateTradingModal({ isOpen: true, status: 'Success', link })
      }
    },
    onError() {
      updateTradingModal({
        isOpen: false,
        status: 'None',
        link: '',
        sendToken: null,
        receiveToken: null,
      })
      setTxHash(undefined)
    },
  })

  return sendTransaction
}

export const useSynthetixV3OraclesUpdate = ({
  disabled,
}: {
  disabled?: boolean
}) => {
  const { account } = useAccount()
  const { address: vaultAddress, chainId } = useTradingPanelPoolConfig()
  const isSynthetixVault = isSynthetixV3Vault(vaultAddress)
  const publicClient = usePublicClient()
  const [txData, setTxData] = useState<TransactionRequest | null>(null)
  const { data: blockNumber } = useBlockNumber({ enabled: !disabled })
  const updateTradingModal = useTradingPanelModal()[1]
  const { sendTransaction } = useSendUpdateTransaction({ chainId })

  useEffect(() => {
    if (disabled || !isSynthetixVault) {
      return
    }

    ;(async () => {
      try {
        const txData = await getOracleUpdateTransaction({
          publicClient,
          account,
          chainId: chainId,
          vaultAddress,
        })
        setTxData(txData)
      } catch {
        setTxData(null)
      }
    })()
  }, [
    account,
    publicClient,
    blockNumber,
    disabled,
    chainId,
    vaultAddress,
    isSynthetixVault,
  ])

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
      return sendTransaction?.({
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
