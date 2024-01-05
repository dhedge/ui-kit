import { useState } from 'react'

export const TABS = ['deposit', 'withdraw'] as const

const TRADING_TAB_INDEX_MAP = TABS.reduce<
  Record<number, (typeof TABS)[number]>
>((acc, type, index) => {
  acc[index] = type
  return acc
}, {})

export const useTradingWidget = () => {
  const [type, setTradingType] = useState<(typeof TABS)[number]>(TABS[0])

  const onTabChange = (index: number) => {
    const tab = TRADING_TAB_INDEX_MAP[index]

    if (tab) {
      setTradingType(tab)
    }
  }

  return {
    type,
    onTabChange,
  }
}
