export const PoolLogicAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
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
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
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
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'fundValue',
        type: 'uint256',
      },
    ],
    name: 'calculateAvailableManagerFee',
    outputs: [
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'deposit',
    outputs: [
      {
        internalType: 'uint256',
        name: 'liquidityMinted',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'getExitRemainingCooldown',
    outputs: [
      {
        internalType: 'uint256',
        name: 'remaining',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFundSummary',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'totalSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalFundValue',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'manager',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'managerName',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'creationTime',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'privatePool',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'performanceFeeNumerator',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'managerFeeNumerator',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'managerFeeDenominator',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'exitFeeNumerator',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'exitFeeDenominator',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'entryFeeNumerator',
            type: 'uint256',
          },
        ],
        internalType: 'struct PoolLogic.FundSummary',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintManagerFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolManagerLogic',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tokenPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
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
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_fundTokenAmount',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'supportedAsset',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'withdrawData',
            type: 'bytes',
          },
          {
            internalType: 'uint256',
            name: 'slippageTolerance',
            type: 'uint256',
          },
        ],
        internalType: 'struct IPoolLogic.ComplexAsset[]',
        name: '_complexAssetsData',
        type: 'tuple[]',
      },
    ],
    name: 'withdrawSafe',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_fundTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_slippageTolerance',
        type: 'uint256',
      },
    ],
    name: 'withdrawSafe',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const ComplexWithdrawalAssetSrcDataAbiItem = [
  {
    type: 'tuple[]',
    components: [
      {
        type: 'address',
        name: 'asset',
      },
      {
        type: 'uint256',
        name: 'amount',
      },
      {
        type: 'tuple',
        name: 'swapData',
        components: [
          {
            type: 'bytes32',
            name: 'routerKey',
          },
          {
            type: 'bytes',
            name: 'txData',
          },
        ],
      },
    ],
  },
] as const

export const ComplexWithdrawalDataAbiItem = [
  {
    type: 'tuple',
    components: [
      {
        type: 'bytes',
        name: 'encodedSrcData',
      },
      {
        type: 'tuple',
        name: 'dstData',
        components: [
          {
            type: 'address',
            name: 'dstAddress',
          },
          {
            type: 'uint256',
            name: 'dstAmount',
          },
        ],
      },
      {
        type: 'uint256',
        name: 'slippage',
      },
    ],
  },
] as const
