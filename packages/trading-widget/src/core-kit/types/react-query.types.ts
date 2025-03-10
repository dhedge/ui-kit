export type ContractReadQueryKey = ['readContract', { functionName?: string }]
export type ContractReadsQueryKey = [
  'readContracts',
  { contracts?: { functionName?: string }[] },
]
