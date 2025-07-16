export interface TagInvestorByReferrerCallbackVariables {
  poolAddress: string
  referrerAddress: string
  investorAddress: string
}

export interface UseReferralProgramProps {
  vaultAddress: string
  userAddress?: string | null
  query: Record<string, string | string[] | undefined>
  logEvent?: () => void
  tagInvestorByReferrer: (
    data: TagInvestorByReferrerCallbackVariables,
  ) => Promise<unknown>
}
