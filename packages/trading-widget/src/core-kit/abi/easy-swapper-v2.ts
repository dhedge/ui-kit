const SwapperErrorsAbi = [
  {
    inputs: [],
    name: 'FailedInnerCall',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'returnData',
        type: 'bytes',
      },
    ],
    name: 'FailedToApproveParaswap',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'destToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'receivedAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minAmount',
        type: 'uint256',
      },
    ],
    name: 'InsufficientAmountReceived',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'routerKey',
        type: 'bytes32',
      },
    ],
    name: 'InvalidAggregator',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidNativeTokenTransferEncoding',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NativeTokenSentWithoutNativeSwap',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'expectedAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'sentAmount',
        type: 'uint256',
      },
    ],
    name: 'NotEnoughNativeTokenSent',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'router',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'contract IERC20',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'bytes32',
                name: 'routerKey',
                type: 'bytes32',
              },
              {
                internalType: 'bytes',
                name: 'swapData',
                type: 'bytes',
              },
            ],
            internalType: 'struct AggregatorData',
            name: 'aggregatorData',
            type: 'tuple',
          },
        ],
        internalType: 'struct SrcTokenSwapDetails',
        name: 'srcTokenSwapDetails',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'returnData',
        type: 'bytes',
      },
    ],
    name: 'SwapFailed',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'enum Permit2TransferType',
        name: 'transferType',
        type: 'uint8',
      },
    ],
    name: 'UnsupportedPermit2Method',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UnsupportedTokenTransferMethod',
    type: 'error',
  },
] as const

export const EasySwapperV2Abi = [
  ...SwapperErrorsAbi,
  ...[
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'proxy',
          type: 'address',
        },
      ],
      name: 'ProxyCreated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'withdrawalVault',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'depositor',
          type: 'address',
        },
      ],
      name: 'WithdrawalCompleted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'withdrawalVault',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'depositor',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'dHedgeVault',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amountWithdrawn',
          type: 'uint256',
        },
      ],
      name: 'WithdrawalInitiated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'withdrawalVault',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'depositor',
          type: 'address',
        },
      ],
      name: 'WithdrawalVaultCreated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'depositor',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'dHedgeVault',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'contract IERC20',
          name: 'vaultDepositToken',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'contract IERC20',
          name: 'userDepositToken',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amountReceived',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'lockupTime',
          type: 'uint256',
        },
      ],
      name: 'ZapDepositCompleted',
      type: 'event',
    },
    {
      inputs: [],
      name: 'DEFAULT_COOLDOWN',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
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
      inputs: [],
      name: 'dHedgePoolFactory',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
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
        {
          internalType: 'uint256',
          name: '_expectedAmountReceived',
          type: 'uint256',
        },
      ],
      name: 'deposit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_dHedgeVault', type: 'address' },
        {
          internalType: 'address',
          name: '_vaultDepositToken',
          type: 'address',
        },
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
        {
          internalType: 'uint256',
          name: '_expectedAmountReceived',
          type: 'uint256',
        },
      ],
      name: 'depositWithCustomCooldown',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      name: 'getLogic',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_depositor', type: 'address' },
      ],
      name: 'getTrackedAssets',
      outputs: [
        {
          components: [
            { internalType: 'address', name: 'token', type: 'address' },
            { internalType: 'uint256', name: 'balance', type: 'uint256' },
          ],
          internalType: 'struct IWithdrawalVault.TrackedAsset[]',
          name: 'trackedAssets',
          type: 'tuple[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_dHedgeVault', type: 'address' },
        { internalType: 'uint256', name: '_amountIn', type: 'uint256' },
        {
          components: [
            {
              internalType: 'address',
              name: 'supportedAsset',
              type: 'address',
            },
            { internalType: 'bytes', name: 'withdrawData', type: 'bytes' },
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
      name: 'initWithdrawal',
      outputs: [
        {
          components: [
            { internalType: 'address', name: 'token', type: 'address' },
            { internalType: 'uint256', name: 'balance', type: 'uint256' },
          ],
          internalType: 'struct IWithdrawalVault.TrackedAsset[]',
          name: 'trackedAssets',
          type: 'tuple[]',
        },
        { internalType: 'address', name: 'vault', type: 'address' },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_dHedgeVault', type: 'address' },
        { internalType: 'uint256', name: '_amountIn', type: 'uint256' },
        {
          internalType: 'uint256',
          name: '_slippageTolerance',
          type: 'uint256',
        },
      ],
      name: 'initWithdrawal',
      outputs: [
        {
          components: [
            { internalType: 'address', name: 'token', type: 'address' },
            { internalType: 'uint256', name: 'balance', type: 'uint256' },
          ],
          internalType: 'struct IWithdrawalVault.TrackedAsset[]',
          name: 'trackedAssets',
          type: 'tuple[]',
        },
        { internalType: 'address', name: 'vault', type: 'address' },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_vaultLogic', type: 'address' },
        { internalType: 'address', name: '_weth', type: 'address' },
        {
          internalType: 'contract IWETH',
          name: '_wrappedNativeToken',
          type: 'address',
        },
        {
          internalType: 'contract ISwapper',
          name: '_swapper',
          type: 'address',
        },
        { internalType: 'uint256', name: '_customCooldown', type: 'uint256' },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_dHedgeVault', type: 'address' },
      ],
      name: 'isdHedgeVault',
      outputs: [{ internalType: 'bool', name: 'isVault', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_dHedgeVault', type: 'address' },
        {
          internalType: 'uint256',
          name: '_expectedAmountReceived',
          type: 'uint256',
        },
      ],
      name: 'nativeDeposit',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_dHedgeVault', type: 'address' },
        {
          internalType: 'uint256',
          name: '_expectedAmountReceived',
          type: 'uint256',
        },
      ],
      name: 'nativeDepositWithCustomCooldown',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: '_portion', type: 'uint256' },
        { internalType: 'address', name: '_to', type: 'address' },
      ],
      name: 'partialWithdraw',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: '_customCooldown', type: 'uint256' },
      ],
      name: 'setCustomCooldown',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'address', name: 'dHedgeVault', type: 'address' },
            { internalType: 'bool', name: 'whitelisted', type: 'bool' },
          ],
          internalType: 'struct EasySwapperV2.CustomCooldownSetting[]',
          name: '_whitelistSettings',
          type: 'tuple[]',
        },
      ],
      name: 'setCustomCooldownWhitelist',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_vaultLogic', type: 'address' },
      ],
      name: 'setLogic',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract ISwapper',
          name: '_swapper',
          type: 'address',
        },
      ],
      name: 'setSwapper',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_dHedgePoolFactory',
          type: 'address',
        },
      ],
      name: 'setdHedgePoolFactory',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'swapper',
      outputs: [
        { internalType: 'contract ISwapper', name: '', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_dHedgeVault', type: 'address' },
        { internalType: 'uint256', name: '_amountIn', type: 'uint256' },
        {
          internalType: 'uint256',
          name: '_slippageTolerance',
          type: 'uint256',
        },
      ],
      name: 'unrollAndClaim',
      outputs: [
        {
          components: [
            { internalType: 'address', name: 'token', type: 'address' },
            { internalType: 'uint256', name: 'balance', type: 'uint256' },
          ],
          internalType: 'struct IWithdrawalVault.TrackedAsset[]',
          name: '',
          type: 'tuple[]',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_dHedgeVault', type: 'address' },
        { internalType: 'uint256', name: '_amountIn', type: 'uint256' },
        {
          components: [
            {
              internalType: 'address',
              name: 'supportedAsset',
              type: 'address',
            },
            { internalType: 'bytes', name: 'withdrawData', type: 'bytes' },
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
      name: 'unrollAndClaim',
      outputs: [
        {
          components: [
            { internalType: 'address', name: 'token', type: 'address' },
            { internalType: 'uint256', name: 'balance', type: 'uint256' },
          ],
          internalType: 'struct IWithdrawalVault.TrackedAsset[]',
          name: '',
          type: 'tuple[]',
        },
      ],
      stateMutability: 'nonpayable',
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
      inputs: [{ internalType: 'address', name: '', type: 'address' }],
      name: 'withdrawalContracts',
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
  ],
] as const
