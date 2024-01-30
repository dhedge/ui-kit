import { useCallback, useEffect, useState } from 'react'

import { usePublicClient } from 'wagmi'

import { AddressZero, DEFAULT_POLLING_INTERVAL } from 'const'
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
  useWaitForTransactionReceipt,
} from '../web3'

export const useSendUpdateTransaction = ({
  chainId,
}: {
  chainId: number
}): ReturnType<typeof useSendTransaction> => {
  const [txHash, setTxHash] = useState<Address>()
  const updateTradingModal = useTradingPanelModal()[1]

  const sendTransaction = useSendTransaction({
    mutation: {
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
          data ?? AddressZero,
          'transaction',
          chainId,
        )
        setTxHash(data)
        updateTradingModal({ isOpen: true, status: 'Mining', link })
      },
    },
  })

  const { data, error } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: chainId,
  })

  useEffect(() => {
    if (data) {
      const txHash = data?.transactionHash as Address
      if (txHash) {
        const link = getExplorerLink(txHash, 'transaction', chainId)
        updateTradingModal({ isOpen: true, status: 'Success', link })
      }
    }
  }, [data, chainId, updateTradingModal])

  useEffect(() => {
    if (error) {
      updateTradingModal({
        isOpen: false,
        status: 'None',
        link: '',
        sendToken: null,
        receiveToken: null,
      })
      setTxHash(undefined)
    }
  }, [error, updateTradingModal, setTxHash])

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
  const publicClient = usePublicClient({ chainId })
  const [txData, setTxData] = useState<TransactionRequest | null>(null)
  const { data: blockNumber } = useBlockNumber({
    query: { enabled: !disabled },
    watch: { enabled: !disabled, pollingInterval: DEFAULT_POLLING_INTERVAL },
  })
  const updateTradingModal = useTradingPanelModal()[1]
  const { sendTransaction } = useSendUpdateTransaction({ chainId })

  useEffect(() => {
    if (disabled) {
      return
    }

    ;(async () => {
      try {
        if (publicClient) {
          const txData = await getOracleUpdateTransaction({
            publicClient,
            account,
            chainId: chainId,
            vaultAddress,
          })
          setTxData(txData)
        }
      } catch {
        setTxData(null)
      }
    })()
  }, [account, publicClient, blockNumber, disabled, chainId, vaultAddress])

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
