export const SynthetixV3CoreAbi = [
  {
    inputs: [
      {
        internalType: 'uint128',
        name: 'accountId',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'poolId',
        type: 'uint128',
      },
      {
        internalType: 'address',
        name: 'collateralType',
        type: 'address',
      },
    ],
    name: 'getPositionDebt',
    outputs: [
      {
        internalType: 'int256',
        name: 'debtD18',
        type: 'int256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint128',
        name: 'accountId',
        type: 'uint128',
      },
      {
        internalType: 'address',
        name: 'collateralType',
        type: 'address',
      },
    ],
    name: 'getAccountAvailableCollateral',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
