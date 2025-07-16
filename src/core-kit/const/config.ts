import { arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains'

import {
  AaveLendingPoolAbi,
  EasySwapperV2Abi,
  FlatcoinPointsModuleAbi,
  LimitOrderAbi,
  PoolFactoryAbi,
  PoolLogicAbi,
  PoolManagerLogicAbi,
  RewardDistributionAbi,
  erc20Abi,
} from 'core-kit/abi'
import {
  AAVE_LENDING_POOL_V2_ADDRESS_POLYGON,
  AAVE_LENDING_POOL_V3_ADDRESS_ARBITRUM,
  AAVE_LENDING_POOL_V3_ADDRESS_BASE,
  AAVE_LENDING_POOL_V3_ADDRESS_OPTIMISM,
  AAVE_LENDING_POOL_V3_ADDRESS_POLYGON,
  EASY_SWAPPER_V2_ADDRESS_ARBITRUM,
  EASY_SWAPPER_V2_ADDRESS_BASE,
  EASY_SWAPPER_V2_ADDRESS_MAINNET,
  EASY_SWAPPER_V2_ADDRESS_OPTIMISM,
  EASY_SWAPPER_V2_ADDRESS_POLYGON,
  FACTORY_ADDRESS_ARBITRUM,
  FACTORY_ADDRESS_BASE,
  FACTORY_ADDRESS_MAINNET,
  FACTORY_ADDRESS_OPTIMISM,
  FACTORY_ADDRESS_POLYGON,
  FLATCOIN_POINTS_MODULE_ADDRESS_BASE,
  LIMIT_ORDER_ADDRESS_ARBITRUM,
  LIMIT_ORDER_ADDRESS_BASE,
  LIMIT_ORDER_ADDRESS_OPTIMISM,
  LIMIT_ORDER_ADDRESS_POLYGON,
  REWARD_DISTRIBUTION_ADDRESS_OPTIMISM,
} from 'core-kit/const/contracts'
import type { Address, ChainId } from 'core-kit/types/web3.types'

export type ContractId =
  | 'factory'
  | 'rewardDistribution'
  | 'aaveLendingPoolV2'
  | 'aaveLendingPoolV3'
  | 'poolManagerLogic'
  | 'erc20'
  | 'poolLogic'
  | 'flatcoinPointsModule'
  | 'easySwapperV2'
  | 'limitOrder'

type ContractsAddressesMap = Readonly<
  Record<ChainId, { [id in ContractId]?: Address }>
>

export const contractsAddressesMap: ContractsAddressesMap = {
  [mainnet.id]: {
    factory: FACTORY_ADDRESS_MAINNET,
    easySwapperV2: EASY_SWAPPER_V2_ADDRESS_MAINNET,
  },
  [polygon.id]: {
    factory: FACTORY_ADDRESS_POLYGON,
    aaveLendingPoolV2: AAVE_LENDING_POOL_V2_ADDRESS_POLYGON,
    aaveLendingPoolV3: AAVE_LENDING_POOL_V3_ADDRESS_POLYGON,
    easySwapperV2: EASY_SWAPPER_V2_ADDRESS_POLYGON,
    limitOrder: LIMIT_ORDER_ADDRESS_POLYGON,
  },
  [optimism.id]: {
    factory: FACTORY_ADDRESS_OPTIMISM,
    rewardDistribution: REWARD_DISTRIBUTION_ADDRESS_OPTIMISM,
    aaveLendingPoolV3: AAVE_LENDING_POOL_V3_ADDRESS_OPTIMISM,
    easySwapperV2: EASY_SWAPPER_V2_ADDRESS_OPTIMISM,
    limitOrder: LIMIT_ORDER_ADDRESS_OPTIMISM,
  },
  [arbitrum.id]: {
    factory: FACTORY_ADDRESS_ARBITRUM,
    aaveLendingPoolV3: AAVE_LENDING_POOL_V3_ADDRESS_ARBITRUM,
    easySwapperV2: EASY_SWAPPER_V2_ADDRESS_ARBITRUM,
    limitOrder: LIMIT_ORDER_ADDRESS_ARBITRUM,
  },
  [base.id]: {
    factory: FACTORY_ADDRESS_BASE,
    flatcoinPointsModule: FLATCOIN_POINTS_MODULE_ADDRESS_BASE,
    easySwapperV2: EASY_SWAPPER_V2_ADDRESS_BASE,
    aaveLendingPoolV3: AAVE_LENDING_POOL_V3_ADDRESS_BASE,
    limitOrder: LIMIT_ORDER_ADDRESS_BASE,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const contractsAbisMap: { [id in ContractId]: any } = {
  factory: PoolFactoryAbi,
  aaveLendingPoolV2: AaveLendingPoolAbi,
  aaveLendingPoolV3: AaveLendingPoolAbi,
  rewardDistribution: RewardDistributionAbi,
  poolManagerLogic: PoolManagerLogicAbi,
  erc20: erc20Abi,
  poolLogic: PoolLogicAbi,
  flatcoinPointsModule: FlatcoinPointsModuleAbi,
  easySwapperV2: EasySwapperV2Abi,
  limitOrder: LimitOrderAbi,
}
