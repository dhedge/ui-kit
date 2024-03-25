export const SynthetixV3ContractGuard = [
  {
    inputs: [
      { internalType: 'address', name: '_poolLogic', type: 'address' },
      { internalType: 'address', name: '_to', type: 'address' },
    ],
    name: 'getAccountNftTokenId',
    outputs: [{ internalType: 'uint128', name: 'tokenId', type: 'uint128' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'dHedgeVaultsWhitelist',
    outputs: [
      { internalType: 'address', name: 'poolLogic', type: 'address' },
      { internalType: 'address', name: 'collateralAsset', type: 'address' },
      { internalType: 'address', name: 'debtAsset', type: 'address' },
      { internalType: 'uint128', name: 'snxLiquidityPoolId', type: 'uint128' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
