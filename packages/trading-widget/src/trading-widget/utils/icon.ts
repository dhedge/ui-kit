const CUSTOM_TOKEN_ICONS_MAP: Record<string, string> = {
  'Lend/Borrow V2': 'aave',
  'Lend/Borrow V3': 'aave',
  'Lyra Options': 'lyra',
  ULP: 'uni',
}

export function getTokenIconName(symbol: string): string {
  const customIcon = CUSTOM_TOKEN_ICONS_MAP[symbol]
  if (customIcon) {
    return customIcon
  }

  const lowerCaseSymbol = symbol.toLowerCase()
  if (lowerCaseSymbol.includes('bear')) {
    return 'torosbear'
  }

  if (lowerCaseSymbol.includes('bull')) {
    return 'torosbull'
  }

  return lowerCaseSymbol
}

export const buildIconLink = (tokenName: string): string =>
  tokenName
    ? `https://raw.githubusercontent.com/dhedge/crypto-icons/main/icons/${getTokenIconName(
        tokenName,
      )}.png`
    : ''
