export const LimitOrderAbi = [
  { inputs: [], name: 'ExternalCallerNotAllowed', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'asset', type: 'address' }],
    name: 'InvalidAsset',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'pool', type: 'address' }],
    name: 'InvalidPool',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'stopLossPriceD18', type: 'uint256' },
      { internalType: 'uint256', name: 'takeProfitPriceD18', type: 'uint256' },
      { internalType: 'uint256', name: 'currentPrice', type: 'uint256' },
    ],
    name: 'InvalidPrices',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'string', name: 'varName', type: 'string' }],
    name: 'InvalidValue',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'address', name: 'pool', type: 'address' },
    ],
    name: 'LimitOrderAlreadyExists',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'currentPriceD18', type: 'uint256' },
      { internalType: 'uint256', name: 'stopLossPriceD18', type: 'uint256' },
      { internalType: 'uint256', name: 'takeProfitPriceD18', type: 'uint256' },
    ],
    name: 'LimitOrderNotFillable',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'id', type: 'bytes32' }],
    name: 'LimitOrderNotFound',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'caller', type: 'address' }],
    name: 'NotAuthorizedKeeper',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'SettlementOrderNotFound',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'address', name: 'pool', type: 'address' },
      { indexed: false, internalType: 'bytes32', name: 'id', type: 'bytes32' },
    ],
    name: 'LimitOrderCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'address', name: 'pool', type: 'address' },
      { indexed: false, internalType: 'bytes32', name: 'id', type: 'bytes32' },
    ],
    name: 'LimitOrderDeleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'address', name: 'pool', type: 'address' },
      { indexed: false, internalType: 'bytes32', name: 'id', type: 'bytes32' },
    ],
    name: 'LimitOrderExecuted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bytes32', name: 'id', type: 'bytes32' },
      { indexed: false, internalType: 'bytes', name: 'reason', type: 'bytes' },
    ],
    name: 'LimitOrderExecutionFailed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'address', name: 'pool', type: 'address' },
      { indexed: false, internalType: 'bytes32', name: 'id', type: 'bytes32' },
    ],
    name: 'LimitOrderModified',
    type: 'event',
  },
  {
    inputs: [],
    name: 'SLIPPAGE_DENOMINATOR',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'orderId_', type: 'bytes32' },
      {
        components: [
          { internalType: 'address', name: 'supportedAsset', type: 'address' },
          { internalType: 'bytes', name: 'withdrawData', type: 'bytes' },
          {
            internalType: 'uint256',
            name: 'slippageTolerance',
            type: 'uint256',
          },
        ],
        internalType: 'struct IPoolLogic.ComplexAsset[]',
        name: 'complexAssetsData_',
        type: 'tuple[]',
      },
    ],
    name: '_executeLimitOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user_', type: 'address' },
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
        name: 'swapData_',
        type: 'tuple',
      },
    ],
    name: '_executeSettlementOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'stopLossPriceD18',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takeProfitPriceD18',
            type: 'uint256',
          },
          { internalType: 'address', name: 'user', type: 'address' },
          { internalType: 'address', name: 'pool', type: 'address' },
          { internalType: 'address', name: 'pricingAsset', type: 'address' },
        ],
        internalType: 'struct PoolLimitOrderManager.LimitOrderInfo',
        name: 'limitOrderInfo_',
        type: 'tuple',
      },
    ],
    name: 'createLimitOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'defaultSlippageTolerance',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'pool_', type: 'address' }],
    name: 'deleteLimitOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'easySwapper',
    outputs: [
      { internalType: 'contract IEasySwapperV2', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'orderId_', type: 'bytes32' },
      {
        components: [
          { internalType: 'address', name: 'supportedAsset', type: 'address' },
          { internalType: 'bytes', name: 'withdrawData', type: 'bytes' },
          {
            internalType: 'uint256',
            name: 'slippageTolerance',
            type: 'uint256',
          },
        ],
        internalType: 'struct IPoolLogic.ComplexAsset[]',
        name: 'complexAssetsData_',
        type: 'tuple[]',
      },
    ],
    name: 'executeLimitOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'orderId', type: 'bytes32' },
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
            name: 'complexAssetsData',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct PoolLimitOrderManager.LimitOrderExecution[]',
        name: 'orders_',
        type: 'tuple[]',
      },
    ],
    name: 'executeLimitOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'orderId', type: 'bytes32' },
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
            name: 'complexAssetsData',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct PoolLimitOrderManager.LimitOrderExecution[]',
        name: 'orders_',
        type: 'tuple[]',
      },
    ],
    name: 'executeLimitOrdersSafe',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user_', type: 'address' },
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
        name: 'swapData_',
        type: 'tuple',
      },
    ],
    name: 'executeSettlementOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'user', type: 'address' },
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
                      {
                        internalType: 'bytes',
                        name: 'swapData',
                        type: 'bytes',
                      },
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
            name: 'swapData',
            type: 'tuple',
          },
        ],
        internalType: 'struct PoolLimitOrderManager.SettlementOrderExecution[]',
        name: 'orders_',
        type: 'tuple[]',
      },
    ],
    name: 'executeSettlementOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'user', type: 'address' },
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
                      {
                        internalType: 'bytes',
                        name: 'swapData',
                        type: 'bytes',
                      },
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
            name: 'swapData',
            type: 'tuple',
          },
        ],
        internalType: 'struct PoolLimitOrderManager.SettlementOrderExecution[]',
        name: 'orders_',
        type: 'tuple[]',
      },
    ],
    name: 'executeSettlementOrdersSafe',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllLimitOrderIds',
    outputs: [
      { internalType: 'bytes32[]', name: 'limitOrderIds_', type: 'bytes32[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllUsersToSettle',
    outputs: [
      { internalType: 'address[]', name: 'usersToSettle_', type: 'address[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'limitOrderSettlementToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'orderId', type: 'bytes32' }],
    name: 'limitOrders',
    outputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'stopLossPriceD18', type: 'uint256' },
      { internalType: 'uint256', name: 'takeProfitPriceD18', type: 'uint256' },
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'address', name: 'pool', type: 'address' },
      { internalType: 'address', name: 'pricingAsset', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'stopLossPriceD18',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takeProfitPriceD18',
            type: 'uint256',
          },
          { internalType: 'address', name: 'user', type: 'address' },
          { internalType: 'address', name: 'pool', type: 'address' },
          { internalType: 'address', name: 'pricingAsset', type: 'address' },
        ],
        internalType: 'struct PoolLimitOrderManager.LimitOrderInfo',
        name: 'modificationInfo_',
        type: 'tuple',
      },
    ],
    name: 'modifyLimitOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'limitOrderSettlementToken_',
        type: 'address',
      },
    ],
    name: 'setLimitOrderSettlementToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
