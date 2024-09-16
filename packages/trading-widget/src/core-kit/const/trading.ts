import type { DepositMethodName } from 'core-kit/types'

export const EASY_SWAPPER_V2_DEPOSIT_METHODS = {
  DEPOSIT: 'deposit',
  DEPOSIT_CUSTOM: 'depositWithCustomCooldown',
  NATIVE: 'nativeDeposit',
  NATIVE_CUSTOM: 'nativeDepositWithCustomCooldown',
  ZAP_NATIVE_DEPOSIT: 'zapNativeDeposit',
  ZAP_NATIVE_DEPOSIT_CUSTOM: 'zapNativeDepositWithCustomCooldown',
  ZAP_DEPOSIT: 'zapDeposit',
  ZAP_DEPOSIT_CUSTOM: 'zapDepositWithCustomCooldown',
} satisfies Record<string, DepositMethodName>
