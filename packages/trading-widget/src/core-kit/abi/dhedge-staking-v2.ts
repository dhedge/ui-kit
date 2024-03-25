export const DHedgeStakingV2Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'dhedgePoolAddress',
        type: 'address',
      },
    ],
    name: 'getPoolConfiguration',
    outputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'configured',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'stakeCap',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakedSoFar',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDhedgeStakingV2Storage.PoolConfiguration',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
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
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: 'stakeId',
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
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getStake',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'dhtAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'dhtStakeStartTime',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'dhedgePoolAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'dhedgePoolAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'dhedgePoolStakeStartTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeStartTokenPrice',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'unstaked',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'unstakeTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'claimedReward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rewardParamsEmissionsRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeFinishTokenPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'vdhtAccruedAtUnstake',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDhedgeStakingV2Storage.Stake',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
