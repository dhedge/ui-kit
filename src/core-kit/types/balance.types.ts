export interface Balance {
  balanceInUsd: string
  balanceInUsdNumber: number
  rawBalance: string
}

export interface UserPoolBalances {
  [poolAddress: string]: Balance
}
