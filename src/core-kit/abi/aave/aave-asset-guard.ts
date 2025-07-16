export const AaveAssetGuardAbi = [
  {
    inputs: [
      { internalType: 'address', name: '_pool', type: 'address' },
      { internalType: 'uint256', name: '_poolTokenAmount', type: 'uint256' },
      { internalType: 'uint256', name: '_slippageTolerance', type: 'uint256' },
    ],
    name: 'calculateSwapDataParams',
    outputs: [
      {
        components: [
          {
            components: [
              { internalType: 'address', name: 'asset', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            internalType: 'struct ISwapDataConsumingGuard.AssetStructure[]',
            name: 'srcData',
            type: 'tuple[]',
          },
          {
            components: [
              { internalType: 'address', name: 'asset', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            internalType: 'struct ISwapDataConsumingGuard.AssetStructure',
            name: 'dstData',
            type: 'tuple',
          },
        ],
        internalType: 'struct ISwapDataConsumingGuard.SwapDataParams',
        name: 'swapDataParams',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
