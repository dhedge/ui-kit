export const EasySwapperV2Abi = [
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'contract IERC20',
                name: 'token',
                type: 'address',
              },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              {
                components: [
                  {
                    internalType: 'bytes32',
                    name: 'routerKey',
                    type: 'bytes32',
                  },
                  { internalType: 'bytes', name: 'swapData', type: 'bytes' },
                ],
                internalType: 'struct ISwapper.AggregatorData',
                name: 'aggregatorData',
                type: 'tuple',
              },
            ],
            internalType: 'struct ISwapper.SrcTokenSwapDetails[]',
            name: 'srcData',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'contract IERC20',
                name: 'destToken',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'minDestAmount',
                type: 'uint256',
              },
            ],
            internalType: 'struct ISwapper.DestData',
            name: 'destData',
            type: 'tuple',
          },
        ],
        internalType: 'struct IWithdrawalVault.MultiInSingleOutData',
        name: '_swapData',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: '_expectedDestTokenAmount',
        type: 'uint256',
      },
    ],
    name: 'completeWithdrawal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'completeWithdrawal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'customCooldown',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'customCooldownDepositsWhitelist',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_dHedgeVault', type: 'address' },
      { internalType: 'address', name: '_vaultDepositToken', type: 'address' },
      { internalType: 'uint256', name: '_depositAmount', type: 'uint256' },
    ],
    name: 'depositQuote',
    outputs: [
      {
        internalType: 'uint256',
        name: 'expectedAmountReceived',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_dHedgeVault', type: 'address' },
      {
        internalType: 'contract IERC20',
        name: '_vaultDepositToken',
        type: 'address',
      },
      { internalType: 'uint256', name: '_depositAmount', type: 'uint256' },
    ],
    name: 'depositWithCustomCooldown',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_dHedgeVault', type: 'address' },
      { internalType: 'uint256', name: '_amountIn', type: 'uint256' },
    ],
    name: 'initWithdrawal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_dHedgeVault', type: 'address' },
    ],
    name: 'nativeDeposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_dHedgeVault', type: 'address' },
    ],
    name: 'nativeDepositWithCustomCooldown',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'weth',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wrappedNativeToken',
    outputs: [{ internalType: 'contract IWETH', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_dHedgeVault', type: 'address' },
      {
        components: [
          {
            components: [
              {
                internalType: 'contract IERC20',
                name: 'token',
                type: 'address',
              },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              {
                components: [
                  {
                    internalType: 'bytes32',
                    name: 'routerKey',
                    type: 'bytes32',
                  },
                  { internalType: 'bytes', name: 'swapData', type: 'bytes' },
                ],
                internalType: 'struct ISwapper.AggregatorData',
                name: 'aggregatorData',
                type: 'tuple',
              },
            ],
            internalType: 'struct ISwapper.SrcTokenSwapDetails',
            name: 'srcData',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'contract IERC20',
                name: 'destToken',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'minDestAmount',
                type: 'uint256',
              },
            ],
            internalType: 'struct ISwapper.DestData',
            name: 'destData',
            type: 'tuple',
          },
        ],
        internalType: 'struct EasySwapperV2.SingleInSingleOutData',
        name: '_swapData',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: '_expectedAmountReceived',
        type: 'uint256',
      },
    ],
    name: 'zapDeposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_dHedgeVault', type: 'address' },
      {
        components: [
          {
            components: [
              {
                internalType: 'contract IERC20',
                name: 'token',
                type: 'address',
              },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              {
                components: [
                  {
                    internalType: 'bytes32',
                    name: 'routerKey',
                    type: 'bytes32',
                  },
                  { internalType: 'bytes', name: 'swapData', type: 'bytes' },
                ],
                internalType: 'struct ISwapper.AggregatorData',
                name: 'aggregatorData',
                type: 'tuple',
              },
            ],
            internalType: 'struct ISwapper.SrcTokenSwapDetails',
            name: 'srcData',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'contract IERC20',
                name: 'destToken',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'minDestAmount',
                type: 'uint256',
              },
            ],
            internalType: 'struct ISwapper.DestData',
            name: 'destData',
            type: 'tuple',
          },
        ],
        internalType: 'struct EasySwapperV2.SingleInSingleOutData',
        name: '_swapData',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: '_expectedAmountReceived',
        type: 'uint256',
      },
    ],
    name: 'zapDepositWithCustomCooldown',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_dHedgeVault', type: 'address' },
      {
        components: [
          {
            components: [
              {
                internalType: 'contract IERC20',
                name: 'token',
                type: 'address',
              },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              {
                components: [
                  {
                    internalType: 'bytes32',
                    name: 'routerKey',
                    type: 'bytes32',
                  },
                  { internalType: 'bytes', name: 'swapData', type: 'bytes' },
                ],
                internalType: 'struct ISwapper.AggregatorData',
                name: 'aggregatorData',
                type: 'tuple',
              },
            ],
            internalType: 'struct ISwapper.SrcTokenSwapDetails',
            name: 'srcData',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'contract IERC20',
                name: 'destToken',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'minDestAmount',
                type: 'uint256',
              },
            ],
            internalType: 'struct ISwapper.DestData',
            name: 'destData',
            type: 'tuple',
          },
        ],
        internalType: 'struct EasySwapperV2.SingleInSingleOutData',
        name: '_swapData',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: '_expectedAmountReceived',
        type: 'uint256',
      },
    ],
    name: 'zapNativeDeposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_dHedgeVault', type: 'address' },
      {
        components: [
          {
            components: [
              {
                internalType: 'contract IERC20',
                name: 'token',
                type: 'address',
              },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              {
                components: [
                  {
                    internalType: 'bytes32',
                    name: 'routerKey',
                    type: 'bytes32',
                  },
                  { internalType: 'bytes', name: 'swapData', type: 'bytes' },
                ],
                internalType: 'struct ISwapper.AggregatorData',
                name: 'aggregatorData',
                type: 'tuple',
              },
            ],
            internalType: 'struct ISwapper.SrcTokenSwapDetails',
            name: 'srcData',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'contract IERC20',
                name: 'destToken',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'minDestAmount',
                type: 'uint256',
              },
            ],
            internalType: 'struct ISwapper.DestData',
            name: 'destData',
            type: 'tuple',
          },
        ],
        internalType: 'struct EasySwapperV2.SingleInSingleOutData',
        name: '_swapData',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: '_expectedAmountReceived',
        type: 'uint256',
      },
    ],
    name: 'zapNativeDepositWithCustomCooldown',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_dHedgeVault', type: 'address' },
      {
        internalType: 'contract IERC20',
        name: '_vaultDepositToken',
        type: 'address',
      },
      { internalType: 'uint256', name: '_depositAmount', type: 'uint256' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
