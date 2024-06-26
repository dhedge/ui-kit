export const DhedgeEasySwapperAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'allowedPools',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IERC20Extended',
        name: 'depositAsset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'contract IERC20Extended',
        name: 'poolDepositAsset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'expectedLiquidityMinted',
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
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IERC20Extended',
        name: 'depositAsset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'contract IERC20Extended',
        name: 'poolDepositAsset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'expectedLiquidityMinted',
        type: 'uint256',
      },
    ],
    name: 'depositWithCustomCooldown',
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
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IERC20Extended',
        name: 'poolDepositAsset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'expectedLiquidityMinted',
        type: 'uint256',
      },
    ],
    name: 'depositNative',
    outputs: [
      {
        internalType: 'uint256',
        name: 'liquidityMinted',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IERC20Extended',
        name: 'poolDepositAsset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'expectedLiquidityMinted',
        type: 'uint256',
      },
    ],
    name: 'depositNativeWithCustomCooldown',
    outputs: [
      {
        internalType: 'uint256',
        name: 'liquidityMinted',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'contract IERC20Extended',
        name: 'depositAsset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'contract IERC20Extended',
        name: 'poolDepositAsset',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'customCooldown',
        type: 'bool',
      },
    ],
    name: 'depositQuote',
    outputs: [
      {
        internalType: 'uint256',
        name: 'expectedLiquidityMinted',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeDenominator',
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
    inputs: [],
    name: 'feeNumerator',
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
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'fundTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'contract IERC20Extended',
        name: 'withdrawalAsset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'expectedAmountOut',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'fundTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expectedAmountOut',
        type: 'uint256',
      },
    ],
    name: 'withdrawNative',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'fundTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'contract IERC20Extended',
        name: 'intermediateAsset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'expectedAmountSUSD',
        type: 'uint256',
      },
    ],
    name: 'withdrawSUSD',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
