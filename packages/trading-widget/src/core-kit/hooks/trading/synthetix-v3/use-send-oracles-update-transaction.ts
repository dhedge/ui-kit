import { useEffect, useState } from 'react'

import { AddressZero } from 'core-kit/const'
import { useTradingPanelModal } from 'core-kit/hooks/state'
import {
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'core-kit/hooks/web3'
import type { Address } from 'core-kit/types'
import { getExplorerLink } from 'core-kit/utils'

export const useSendOraclesUpdateTransaction = ({
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
            sendTokens: null,
            receiveTokens: null,
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
        sendTokens: null,
        receiveTokens: null,
      })
      setTxHash(undefined)
    }
  }, [error, updateTradingModal, setTxHash])

  return sendTransaction
}
