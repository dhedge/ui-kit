import { useInitWithdrawQuote } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-init-withdraw-quote'
import { Layout } from 'trading-widget/components/common'
import {
  LimitOrderButton,
  ValidNetworkButton,
} from 'trading-widget/components/widget/widget-buttons'
import { InitWithdrawButton } from 'trading-widget/components/withdraw/init-step/button/init-withdraw-button/init-withdraw-button'
import { ValidInitWithdrawButton } from 'trading-widget/components/withdraw/init-step/button/valid-init-withdraw-button/valid-init-withdraw-button'
import { InitWithdrawInputGroup } from 'trading-widget/components/withdraw/init-step/input-group/init-withdraw-input-group'
import { InitWithdrawMeta } from 'trading-widget/components/withdraw/init-step/meta/meta'
import { WithdrawStepper } from 'trading-widget/components/withdraw/stepper/withdraw-stepper'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const InitStep = () => {
  const t = useTranslationContext()
  useInitWithdrawQuote()

  return (
    <>
      <Layout.InputGroup>
        <InitWithdrawInputGroup />
      </Layout.InputGroup>
      <InitWithdrawMeta>
        <WithdrawStepper>
          <ValidNetworkButton>
            <ValidInitWithdrawButton>
              <div className="dtw-flex dtw-flex-col dtw-gap-2 dtw-w-full">
                <InitWithdrawButton />
                <LimitOrderButton highlighted={false}>
                  {t.stopOrder}
                </LimitOrderButton>
              </div>
            </ValidInitWithdrawButton>
          </ValidNetworkButton>
        </WithdrawStepper>
      </InitWithdrawMeta>
    </>
  )
}
