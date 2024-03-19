import { useEffect, useState } from 'react'

import { buildIconLink } from 'trading-widget/utils/icon'

type Icon = string

const getIcon = async (name: string): Promise<Icon> => {
  try {
    const img = await import(
      `@dhedge/crypto-assets/icons/${name.toLowerCase()}.png`
    )
    return img?.default ?? buildIconLink(name)
  } catch {
    return buildIconLink(name)
  }
}

export const useCryptoIcon = (iconSymbols: string[] = []): Icon[] => {
  const [icons, setIcons] = useState<Icon[]>([])
  const [fetchedIcons, setFetchedIcons] = useState<string[]>([])

  useEffect(() => {
    if (iconSymbols.every((symbol) => fetchedIcons.includes(symbol))) return

    const fetchIcons = async () => {
      const icons = await Promise.all<Icon>(iconSymbols.map(getIcon))
      setIcons(icons)
      setFetchedIcons(iconSymbols)
    }

    fetchIcons()
  }, [iconSymbols, fetchedIcons])

  return icons
}
