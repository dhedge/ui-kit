import {
  BRIDGED_USDC_OPTIMISM,
  SUSD_OPTIMISM,
  WETH_OPTIMISM,
  optimism,
} from 'const'
import type { Address, CallbackConfig, PoolConfig } from 'types'

export const ETHY_OPTIMISM_POOL_MOCK: PoolConfig = {
  chainId: optimism.id,
  symbol: 'ETHy',
  address: '0xb2cfb909e8657c0ec44d3dd898c1053b87804755',
  depositParams: {
    method: 'depositWithCustomCooldown',
    customTokens: [SUSD_OPTIMISM],
  },
  withdrawParams: {
    customTokens: [
      WETH_OPTIMISM,
      {
        ...SUSD_OPTIMISM,
        intermediateToken: BRIDGED_USDC_OPTIMISM,
        method: 'withdrawSUSD',
      },
    ],
  },
}

export const POOL_CONFIG_MAP_MOCK: Record<PoolConfig['address'], PoolConfig> = {
  [ETHY_OPTIMISM_POOL_MOCK.address]: ETHY_OPTIMISM_POOL_MOCK,
}

export const CALLBACK_CONFIG_MOCK: Partial<CallbackConfig> = {}

export const TEST_ADDRESS: Address = '0xTest'
