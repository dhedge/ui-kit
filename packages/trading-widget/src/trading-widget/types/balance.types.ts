export interface Balance {
  balanceInUsd: string
  balanceInUsdNumber: number
  rawBalance: string
  includesStakedTokens: boolean
}

export interface UserPoolBalances {
  [poolAddress: string]: Balance
}
