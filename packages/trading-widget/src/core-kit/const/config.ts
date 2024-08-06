import { arbitrum, base, optimism, polygon } from 'wagmi/chains'

import {
  AaveLendingPoolAbi,
  DHedgeStakingV2Abi,
  DhedgeEasySwapperAbi,
  EasySwapperV2Abi,
  FlatcoinPointsModuleAbi,
  PoolFactoryAbi,
  PoolLogicAbi,
  PoolManagerLogicAbi,
  RewardDistributionAbi,
  SynthetixV3AssetGuard,
  SynthetixV3CoreAbi,
  erc20Abi,
} from 'core-kit/abi'
import type { Address, ChainId } from 'core-kit/types/web3.types'

import {
  AAVE_LENDING_POOL_V2_ADDRESS_POLYGON,
  AAVE_LENDING_POOL_V3_ADDRESS_ARBITRUM,
  AAVE_LENDING_POOL_V3_ADDRESS_OPTIMISM,
  AAVE_LENDING_POOL_V3_ADDRESS_POLYGON,
  EASY_SWAPPER_ADDRESS_ARBITRUM,
  EASY_SWAPPER_ADDRESS_BASE,
  EASY_SWAPPER_ADDRESS_OPTIMISM,
  EASY_SWAPPER_ADDRESS_POLYGON,
  EASY_SWAPPER_V2_ADDRESS_BASE,
  FACTORY_ADDRESS_ARBITRUM,
  FACTORY_ADDRESS_BASE,
  FACTORY_ADDRESS_OPTIMISM,
  FACTORY_ADDRESS_POLYGON,
  FLATCOIN_POINTS_MODULE_ADDRESS_BASE,
  REWARD_DISTRIBUTION_ADDRESS_OPTIMISM,
  STAKING_V2_ADDRESS_OPTIMISM,
  SYNTHETIX_V3_CORE_ADDRESS_ARBITRUM,
  SYNTHETIX_V3_CORE_ADDRESS_BASE,
} from './contracts'

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
  | 'synthetixV3AssetGuard'
  | 'synthetixV3Core'
  | 'flatcoinPointsModule'
  | 'easySwapperV2'

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
    aaveLendingPoolV3: AAVE_LENDING_POOL_V3_ADDRESS_ARBITRUM,
    synthetixV3Core: SYNTHETIX_V3_CORE_ADDRESS_ARBITRUM,
  },
  [base.id]: {
    factory: FACTORY_ADDRESS_BASE,
    synthetixV3Core: SYNTHETIX_V3_CORE_ADDRESS_BASE,
    flatcoinPointsModule: FLATCOIN_POINTS_MODULE_ADDRESS_BASE,
    easySwapper: EASY_SWAPPER_ADDRESS_BASE,
    easySwapperV2: EASY_SWAPPER_V2_ADDRESS_BASE,
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
  erc20: erc20Abi,
  poolLogic: PoolLogicAbi,
  synthetixV3AssetGuard: SynthetixV3AssetGuard,
  synthetixV3Core: SynthetixV3CoreAbi,
  flatcoinPointsModule: FlatcoinPointsModuleAbi,
  easySwapperV2: EasySwapperV2Abi,
}

export const QUERY_KEYS = {
  SYNTHETIX_ORACLES_UPDATE: 'useOraclesUpdateTransactionData',
}
