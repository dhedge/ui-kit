export const RewardDistributionAbi = [
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'pool',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct RewardDistribution.RewardSummary[]',
        name: 'distributedRewards',
        type: 'tuple[]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalDistributedRewards',
        type: 'uint256',
      },
    ],
    name: 'RewardsDistribution',
    type: 'event',
  },
  {
    inputs: [],
    name: 'calculateEligiblePoolsRewards',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'pool',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        internalType: 'struct RewardDistribution.RewardSummary[]',
        name: 'rewards',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256',
        name: 'totalRewardsToDistribute',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getEligiblePoolsWithTvl',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tvl',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'pool',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tvl',
            type: 'uint256',
          },
        ],
        internalType: 'struct RewardDistribution.EligiblePool[]',
        name: 'eligiblePools',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRewardsAPY',
    outputs: [
      {
        internalType: 'uint256',
        name: 'apy',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getWhitelistedPools',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastDistributionTime',
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
    name: 'rewardAmountPerSecond',
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
    name: 'rewardToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
