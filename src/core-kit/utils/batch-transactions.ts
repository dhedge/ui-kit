import { LOCAL_STORAGE_KEYS } from 'core-kit/const'

import { clientSide } from 'core-kit/utils/ua'

export function getStoredBatchTransactionsEnabled(): boolean | undefined {
  if (!clientSide) return undefined

  try {
    const item = localStorage.getItem(
      LOCAL_STORAGE_KEYS.IS_BATCH_TRANSACTIONS_ENABLED,
    )
    return item ? JSON.parse(item) : undefined
  } catch {
    return undefined
  }
}

export function persistBatchTransactionsEnabled(enabled: boolean): void {
  if (!clientSide) return

  try {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.IS_BATCH_TRANSACTIONS_ENABLED,
      JSON.stringify(enabled),
    )
  } catch (e) {
    console.error('[core-kit]: Failed to persist batch transactions setting', e)
  }
}
