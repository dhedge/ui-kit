import { useEffect, useState } from 'react'

import { useConfigContextParams } from 'trading-widget/providers/config-provider'
import { buildIconLink } from 'trading-widget/utils/icon'

type Icon = string

const getIcon = async (
  name: string,
  getFallbackIconPath = buildIconLink,
): Promise<Icon> => {
  try {
    const img = await import(
      `@dhedge/crypto-assets/icons/${name.toLowerCase()}.png`
    )
    return img?.default?.src ?? getFallbackIconPath(name)
  } catch {
    return getFallbackIconPath(name)
  }
}

export const useCryptoIcon = (iconSymbols: string[] = []): Icon[] => {
  const { getFallbackIconPath } = useConfigContextParams()
  const [icons, setIcons] = useState<Icon[]>([])
  const [fetchedIcons, setFetchedIcons] = useState<string[]>([])

  useEffect(() => {
    if (iconSymbols.every((symbol) => fetchedIcons.includes(symbol))) return

    const fetchIcons = async () => {
      const icons = await Promise.all<Icon>(
        iconSymbols.map((symbol) => getIcon(symbol, getFallbackIconPath)),
      )
      setIcons(icons)
      setFetchedIcons(iconSymbols)
    }

    fetchIcons()
  }, [iconSymbols, fetchedIcons, getFallbackIconPath])

  return icons
}
