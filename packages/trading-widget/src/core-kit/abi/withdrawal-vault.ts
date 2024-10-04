export const WithdrawalVaultAbi = [
  {
    inputs: [],
    name: 'getTrackedAssets',
    outputs: [
      { internalType: 'address[]', name: 'trackedAssets', type: 'address[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
