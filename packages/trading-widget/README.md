# dHEDGE Trading Widget API Docs

## Configuration

### widget

------------------------------------------------------------------------------------------

<details>
<summary><code>config</code> <code><b>/</b></code> <code>General feature configuration params</code></summary>

##### Params

> | name                                         | type     | default value              | description                                                                                                                                        |
> |----------------------------------------------|----------|----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
> | `isGeoBlocked`                               | boolean  | false                      | Restricts depositing action button and conditionally renders GeoBlockAlert component                                                               |
> | `depositQuoteDiffWarningThreshold`           | number   | 1                          | Deposit slippage absolute percent value warning threshold, Affects styling to warn user                                                            |
> | `depositQuoteDiffErrorThreshold`             | number   | 3                          | Deposit slippage absolute percent value error threshold, Affects styling to warn user                                                              |
> | `defaultDepositSlippage`                     | number   | 0                          | Initial deposit slippage absolute percent. Further adjustments are available in panel settings                                                     |
> | `defaultDepositSlippageScale`                | number[] | [0]                        | Initial deposit slippage absolute percent. Further adjustments are available in panel settings                                                     |
> | `defaultWithdrawSlippageScale`               | number[] | [0.1, 0.3, 0.5, 1, 1.5, 3] | Initial withdraw slippage absolute percent. Further adjustments are available in panel settings                                                    |
> | `defaultLockTime`                            | string   | 24 hours                   | Formatted default deposit lock time to be displayed in panel (Long lockup period is used to bypass entry fee and can be managed in panel settings) |
> | `customLockTime`                             | string   | 15 minutes                 | Formatted custom deposit lock time alternative to be displayed in panel                                                                            |
> | `stablePrecision`                            | number   | 3                          | Number of decimals to be displayed in stables (e.g USDC balance)                                                                                   |
> | `defaultPrecision`                           | number   | 6                          | Number of decimals to be displayed in token values                                                                                                 |
> | `stakingChainId`                             | number   | 10 (Optimism)              | ChainId to be used in staking logic                                                                                                                |
> | `termsOfUseAccepted`                         | boolean  | true                       | Requires user to confirm terms of use by rendering DepositTermsOfUse component before deposit action                                               |


###### Source: `packages/trading-widget/src/trading-widget/providers/config-provider`
###### Default values: `packages/trading-widget/src/trading-widget/providers/config-provider/config-provider.defaults.ts`
</details>

------------------------------------------------------------------------------------------

<details>
<summary>
<code>components</code>
<code><b>/</b></code>
<code>Custom components to be injected into widget layout</code>
</summary>

##### Params

> | name                                          | type                                | default value | description                                                                                                     |
> |-----------------------------------------------|-------------------------------------|---------------|-----------------------------------------------------------------------------------------------------------------|
> | `GeoBlockAlert`                               | ComponentType                       | `undefined`   | Component replaces deposit button while `isGeoBlocked` config param is set to `true`                            |
> | `DepositMetaInfo`                             | ComponentType                       | `undefined`   | Component is injected into deposit meta part of widget layout nearby TransactionOverviewDisclosure              |
> | `WithdrawMetaInfo`                            | ComponentType                       | `undefined`   | Component is injected into withdraw meta part of widget layout nearby WithdrawTransactionOverviewDisclosure     |
> | `ExtraActionButton`                           | ComponentType                       | `undefined`   | Component is injected below deposit action button and rendered if `isGeoBlocked` config param is set to `false` |
> | `Image`                                       | ComponentType<ImageProps>           | `<img>`       | Component optinally can be used to pass `nextjs` Image component to be used for assets rendering                |
> | `LogoSpinner`                                 | ComponentType<SVGProps<SVGElement>> | `<Spinner>`   | Component is injected into widget pending transaction overlay. Assume using of spinning animation               |
> | `DepositTermsOfUse`                           | ComponentType                       | `undefined`   | Component is injected into `TermsOfUseOverlay` to extend default terms of use statement points                  |


###### Source: `packages/trading-widget/src/trading-widget/providers/component-provider/component-provider.tsx`
###### Default values: `undefined`
</details>
