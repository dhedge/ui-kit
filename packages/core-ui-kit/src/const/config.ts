import {
  AaveLendingPoolAbi,
  DHedgeStakingV2Abi,
  DhedgeEasySwapperAbi,
  PoolFactoryAbi,
  PoolLogicAbi,
  PoolManagerLogicAbi,
  RewardDistributionAbi,
  erc20ABI,
} from 'abi'
import type { Address, ChainId } from 'types/web3.types'
import { arbitrum, optimism, polygon } from 'wagmi/chains'

import {
  AAVE_LENDING_POOL_V2_ADDRESS_POLYGON,
  AAVE_LENDING_POOL_V3_ADDRESS_OPTIMISM,
  AAVE_LENDING_POOL_V3_ADDRESS_POLYGON,
  EASY_SWAPPER_ADDRESS_ARBITRUM,
  EASY_SWAPPER_ADDRESS_OPTIMISM,
  EASY_SWAPPER_ADDRESS_POLYGON,
  FACTORY_ADDRESS_ARBITRUM,
  FACTORY_ADDRESS_OPTIMISM,
  FACTORY_ADDRESS_POLYGON,
  REWARD_DISTRIBUTION_ADDRESS_OPTIMISM,
  STAKING_V2_ADDRESS_OPTIMISM,
} from './contract'

export type ContractId =
  | 'factory'
  | 'easySwapper'
  | 'rewardDistribution'
  | 'aaveLendingPoolV2'
  | 'aaveLendingPoolV3'
  | 'stakingV2'
  | 'poolManagerLogic'
  | 'erc20'
  | 'poolLogic'

type ContractsAddressesMap = Readonly<
  Record<ChainId, { [id in ContractId]?: Address }>
>

export const contractsAddressesMap: ContractsAddressesMap = {
  [polygon.id]: {
    factory: FACTORY_ADDRESS_POLYGON,
    easySwapper: EASY_SWAPPER_ADDRESS_POLYGON,
    aaveLendingPoolV2: AAVE_LENDING_POOL_V2_ADDRESS_POLYGON,
    aaveLendingPoolV3: AAVE_LENDING_POOL_V3_ADDRESS_POLYGON,
  },
  [optimism.id]: {
    factory: FACTORY_ADDRESS_OPTIMISM,
    easySwapper: EASY_SWAPPER_ADDRESS_OPTIMISM,
    rewardDistribution: REWARD_DISTRIBUTION_ADDRESS_OPTIMISM,
    stakingV2: STAKING_V2_ADDRESS_OPTIMISM,
    aaveLendingPoolV3: AAVE_LENDING_POOL_V3_ADDRESS_OPTIMISM,
  },
  [arbitrum.id]: {
    factory: FACTORY_ADDRESS_ARBITRUM,
    easySwapper: EASY_SWAPPER_ADDRESS_ARBITRUM,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const contractsAbisMap: { [id in ContractId]: any } = {
  factory: PoolFactoryAbi,
  easySwapper: DhedgeEasySwapperAbi,
  aaveLendingPoolV2: AaveLendingPoolAbi,
  aaveLendingPoolV3: AaveLendingPoolAbi,
  rewardDistribution: RewardDistributionAbi,
  stakingV2: DHedgeStakingV2Abi,
  poolManagerLogic: PoolManagerLogicAbi,
  erc20: erc20ABI,
  poolLogic: PoolLogicAbi,
}
