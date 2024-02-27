import { useDepositMethodHandler } from '@dhedge/core-ui-kit/hooks/trading/deposit'
import { useTradingPanelLogger } from '@dhedge/core-ui-kit/hooks/state'
import { TRADING_PANEL_LOG_EVENT } from '@dhedge/core-ui-kit/const'

export const useDepositFeeSwitch = () => {
  const [depositMethod, setDepositMethod, hasOptions] =
    useDepositMethodHandler()
  const log = useTradingPanelLogger()

  const handleChange = (enabled: boolean) => {
    setDepositMethod(enabled ? 'deposit' : 'depositWithCustomCooldown')
    log?.(TRADING_PANEL_LOG_EVENT.DEPOSIT_METHOD_CHANGE)
  }

  return {
    defaultEnabled: depositMethod === 'deposit',
    disabled: !hasOptions,
    onChange: handleChange,
  }
}
