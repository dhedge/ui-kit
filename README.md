# dHEDGE Trading Widget API Docs

## Get started

Requirements:

Widget library has some vital `peerDependencies` as a core tool stack. Make sure having all those dependencies installed in app before starting the integration:

```bash
"@tanstack/react-query": "^5.28.4",
"react": ">=18.2.0",
"viem": "^2.8.14",
"wagmi": "^2.5.11"
```

1. Installation:

```bash
npm i @dhedge/trading-widget
```

2. Providers hierarchy

```typescript jsx
import { WagmiProvider } from 'wagmi'
import { TradingPanelProvider, TradingWidget } from '@dhedge/trading-widget'
```

- Setup [Wagmi Provider](https://wagmi.sh/react/api/WagmiProvider) on top level or use existing one in your app
- Setup [TradingPanelProvider](#tradingpanelprovider)
  #### Providing a `getSwapData` callback is mandatory for depositing with off-chain swaps.
- Setup [TradingWidget](#tradingwidget)

3. Minimum required config

See bare minimum setup example: `packages/trading-widget/src/examples/simple-example.tsx`

4. Styling

```typescript jsx
import '@dhedge/trading-widget/style.css'
```

Initially widget takes full parent width

See [TradingWidget](#tradingwidget) -> `theme` config to manage customization

## API

### TradingPanelProvider

Top level provider component. Headless part of trading logic. API handles params to setup `initialState` and `actions`. See below for more details

<details>
<summary><code>actions</code> <code><b>/</b></code> <code>Optional General callbacks to interact with 3rd party services</code></summary>

> | name                           | type                                                                                                                                                                                                                                                                                                                                                     | default value | description                                                                       |
> | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------------------- |
> | `onUpdateSendTokenInput`       | (payload: Partial\<{ address: `Address`; symbol: `string`; value: `string`; decimals: `number`; isLoading?: `boolean` }\>) => void                                                                                                                                                                                                                       | undefined     | triggers on send token change                                                     |
> | `onUpdateTradingSettings`      | (payload: Partial\<{ slippage: `number \| 'auto'`; minSlippage?: `number` isInfiniteAllowance: `boolean`; isMultiAssetWithdrawalEnabled: `boolean`; isMaxSlippageLoading: `boolean` }\>) => void                                                                                                                                                         | undefined     | triggers on trading settings change                                               |
> | `onSetTradingType`             | (payload: `'deposit' \| 'withdraw'`) => void                                                                                                                                                                                                                                                                                                             | undefined     | triggers on trading type change                                                   |
> | `onUpdateTradingMeta`          | (payload: Partial\<{ approvingStatus: `'pending' \| 'success'` }\>) => void                                                                                                                                                                                                                                                                              | undefined     | triggers on trading meta change                                                   |
> | `onUpdateTradingModal`         | (payload: Partial\<{ isOpen: `boolean`; status: `'Success' \| 'None' \| 'Mining' \|  'Wallet'` }\>) => void                                                                                                                                                                                                                                              | undefined     | triggers on trading modal change                                                  |
> | `onUpdateTransactions`         | (payload: AddTransaction \| UpdateTransaction \| RemoveTransaction) => void                                                                                                                                                                                                                                                                              | undefined     | triggers on transaction action change                                             |
> | `onTradingSettleError`         | (error: `Error`) => void                                                                                                                                                                                                                                                                                                                                 | undefined     | triggers on trading settle error                                                  |
> | `onTransactionError`           | (error: `Error`, action: `TransactionAction` \| `undefined`, chainId?: `ChainId`, txHash?: `Address`) => void                                                                                                                                                                                                                                            | undefined     | triggers on transaction error                                                     |
> | `onTransactionSuccess`         | (data: `WaitForTransactionReceiptReturnType`, action: `TransactionAction` \| `undefined`, link?: `string`) => void                                                                                                                                                                                                                                       | undefined     | triggers on transaction success                                                   |
> | `onTransactionEstimationError` | (error: `EstimationError`, address: `Address`, chainId?: `ChainId`, account?: `Address`) => void                                                                                                                                                                                                                                                         | undefined     | triggers on transaction estimation error                                          |
> | `onTokenSelector`              | (payload: { isOpen: `boolean`; entity: `'token' \| 'pool'` }) => void                                                                                                                                                                                                                                                                                    | undefined     | triggers on token selector change                                                 |
> | `onLog`                        | (eventName: `string`, payload?: `Record<string, unknown>`) => void                                                                                                                                                                                                                                                                                       | undefined     | triggers on log event                                                             |
> | `onSimulateTransaction`        | (payload: { chainId: `ChainId`; from: `Address`: to: `Address`; input: `string`; gas: `number`; value?: `string` }) => Promise<{ link?: `string`; simulation: { status: `boolean`; error_message: `string` } } \| null>                                                                                                                                  | undefined     | triggers to simulate transaction and get error details after failed tx estimation |
> | `getSwapData`                  | ({ signal: `AbortSignal`, variables: { chainId: `number`; sourceAddress: `Address`; destinationAddress: `Address`; walletAddress: `Address`; fromAddress: `Address`; amount: `string`; slippage: `string` } }) => Promise<{ destinationAmount: `string`; txData: `string` ; routerKey: `'ONE_INCH' / 'ONE_INCH_V5' / 'ZERO_X' / 'PARASWAP'` } } \| null> | undefined     | provides off chain swap data based on send token value                            |

###### Source: `packages/trading-widget/src/core-kit/providers/index.tsx`

###### Default values: `undefined`

</details>

---

<details>
<summary><code>initialState</code> <code><b>/</b></code> <code>Optional initial state of trading panel</code></summary>

> | name               | type                                                                                                                                                                                                                                    | default value                                                                                                              | description                                                                                     |
> | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
> | `poolAddress`      | Address                                                                                                                                                                                                                                 | `AddressZero`                                                                                                              | Current active pool address                                                                     |
> | `poolConfigMap`    | Record<Address, PoolConfig>                                                                                                                                                                                                             | `{}`                                                                                                                       | Map of pool configs available for trading                                                       |
> | `settings`         | { slippage: `number \| 'auto'`; minSlippage?: `number`; isInfiniteAllowance: `boolean`; isMultiAssetWithdrawalEnabled: `boolean`; isMaxSlippageLoading: `boolean` }                                                                     | { slippage: `'auto'`; isInfiniteAllowance: `false`; isMultiAssetWithdrawalEnabled: `true`; isMaxSlippageLoading: `false` } | Panel settings                                                                                  |
> | `type`             | 'deposit' \| 'withdraw'                                                                                                                                                                                                                 | `'deposit'`                                                                                                                | Trading type                                                                                    |
> | `input`            | { sendToken: { address: `Address`; symbol: `string`; value: `string`; decimals: `number`; isLoading?: `boolean` }; receiveToken: { address: `Address`; symbol: `string`; value: `string`; decimals: `number`; isLoading?: `boolean` } } | `poolConfigMap[poolAddress]`                                                                                               | Send/receive tokens pair                                                                        |
> | `entryFee`         | { deposit: `number`; depositWithCustomCooldown: `number`; }                                                                                                                                                                             | { deposit: `0`; depositWithCustomCooldown: `0.1` }                                                                         | Entry fee config map                                                                            |
> | `meta`             | { approvingStatus?: `'pending' \| 'success'` }                                                                                                                                                                                          | `{}`                                                                                                                       | Trading meta info                                                                               |
> | `modal`            | { isOpen: `boolean`; status: `'Success' \| 'None' \| 'Mining' \|  'Wallet'`; action: `'deposit' \| 'withdraw' \| 'approve  \| 'oraclesUpdate'`; link?: `string`; sendToken: TradingToken \| null; receiveToken: TradingToken \| null }  | `{ isOpen: `false`,status: `'None'`, receiveToken: `null`, sendToken: `null` }`                                            | Trading modal state                                                                             |
> | `transactions`     | { action: `'deposit' \| 'withdraw' \| 'approve'`; symbol: `string`; chainId: `ChainId`; txHash?: `Address` }[]                                                                                                                          | `[]`                                                                                                                       | Pending transactions                                                                            |
> | `poolFallbackData` | { address: `Address`; managerLogicAddress?: `Address`; poolCompositions: `PoolComposition[]`; tokenPrice?: `string`; apy?: { value: `number`; currency: `'USD' \| 'ETH'` } }                                                            | { address: `AddressZero` }                                                                                                 | Current active pool fallback data to override or extend contract's response                     |
> | `defaultChainId`   | number (optional)                                                                                                                                                                                                                       | undefined                                                                                                                  | Chain id that will be returned from useNetwork wagmi hook when connected to unsupported network |

###### Source: `packages/trading-widget/src/core-kit/providers/index.tsx`

###### Default values: `packages/trading-widget/src/core-kit/providers/index.tsx`

</details>

### TradingWidget

UI configuration provider. Manages params to configure custom styling, components, translations and basic trading params. Decomposed into `config`, `components`, `theme` and `translation` params. See below for more details

<details>
<summary><code>config</code> <code><b>/</b></code> <code>General feature configuration params</code></summary>

##### params

> | name                               | type                                                           | default value                | description                                                                                                                                        |
> | ---------------------------------- | -------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `isGeoBlocked`                     | `boolean`                                                      | `false`                      | Restricts depositing action button and conditionally renders GeoBlockAlert component                                                               |
> | `isSanctioned`                     | `boolean`                                                      | `false`                      | Restricts depositing action button and conditionally renders SanctionedAlert component                                                             |
> | `depositQuoteDiffWarningThreshold` | `number`                                                       | `1`                          | Deposit slippage absolute percent value warning threshold, Affects styling to warn user                                                            |
> | `depositQuoteDiffErrorThreshold`   | `number`                                                       | `3`                          | Deposit slippage absolute percent value error threshold, Affects styling to warn user                                                              |
> | `defaultWithdrawSlippage`          | `number`                                                       | `[0.1, 0.3, 0.5, 1, 1.5, 3]` | Initial withdraw slippage absolute percent. Further adjustments are available in panel settings                                                    |
> | `defaultSwapTransactionSlippage`   | `number`                                                       | `0.3`                        | Default slippage (%) applied to swap transaction.                                                                                                  |
> | `defaultNoSwapMinDepositAmountGap` | `number`                                                       | `0.1`                        | Default gap (%) for min received vault tokens during no swap deposits.                                                                             |
> | `defaultLockTime`                  | `string`                                                       | `'24 hours'`                 | Formatted default deposit lock time to be displayed in panel (Long lockup period is used to bypass entry fee and can be managed in panel settings) |
> | `customLockTime`                   | `string`                                                       | `'15 minutes'`               | Formatted custom deposit lock time alternative to be displayed in panel                                                                            |
> | `stablePrecision`                  | `number`                                                       | `3`                          | Number of decimals to be displayed in stables (e.g USDC balance)                                                                                   |
> | `defaultPrecision`                 | `number`                                                       | `6`                          | Number of decimals to be displayed in token values                                                                                                 |
> | `stakingChainId`                   | `number`                                                       | `10` (Optimism)              | ChainId to be used in staking logic                                                                                                                |
> | `termsOfUseAccepted`               | `boolean`                                                      | `true`                       | Requires user to confirm terms of use by rendering DepositTermsOfUse component before deposit action                                               |
> | `standalone`                       | `boolean`                                                      | `true`                       | Handles token selection in SPA mode                                                                                                                |
> | `isAllAssetsWithdrawOptionDefault` | `boolean`                                                      | `false`                      | Sets "All Assets" withdraw option by default                                                                                                       |
> | `chainConfig`                      | `Partial<Record<ChainId, { name: string; iconPath: string }>>` | `{}`                         | Sets map of chain `name` and `iconPath`                                                                                                            |

##### actions

> | name                 | type                     | default value                 | description                                                                                                                                                                                                                                                                   |
> | -------------------- | ------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `onConnect`          | `() => void`             | `() => {}`                    | Widget has built-in `Connect Wallet` action button that triggers `onConnect` callback assuming starting of abstract wallet connection process. After all the only requirement is to get connected wallet inside wagmi's `useAccount` hook to make trading operations possible |
> | `onAcceptTermsOfUse` | `() => Promise<boolean>` | `() => Promise.resolve(true)` | Callback is triggered after user's approval of Terms of Use statements assuming switching of external `config.termsOfUseAccepted` param to `true` state                                                                                                                       |

###### Source: `packages/trading-widget/src/trading-widget/providers/config-provider`

###### Default values: `packages/trading-widget/src/trading-widget/providers/config-provider/config-provider.defaults.ts`

</details>

<details>
<summary>
<code>components</code>
<code><b>/</b></code>
<code>Custom components to be injected into widget layout</code>
</summary>

> | name                | type                                | default value       | description                                                                                                     |
> | ------------------- | ----------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------- |
> | `GeoBlockAlert`     | ComponentType                       | `<GeoBlockAlert>`   | Component replaces deposit button while `isGeoBlocked` config param is set to `true`                            |
> | `SanctionedAlert`   | ComponentType                       | `<SanctionedAlert>` | Component replaces deposit button while `isSanctioned` config param is set to `true`                            |
> | `DepositMetaInfo`   | ComponentType                       | `undefined`         | Component is injected into deposit meta part of widget layout nearby TransactionOverviewDisclosure              |
> | `WithdrawMetaInfo`  | ComponentType                       | `undefined`         | Component is injected into withdraw meta part of widget layout nearby WithdrawTransactionOverviewDisclosure     |
> | `ExtraActionButton` | ComponentType                       | `undefined`         | Component is injected below deposit action button and rendered if `isGeoBlocked` config param is set to `false` |
> | `Image`             | ComponentType<ImageProps>           | `<img>`             | Component optionally can be used to pass `nextjs` Image component to be used for assets rendering               |
> | `LogoSpinner`       | ComponentType<SVGProps<SVGElement>> | `<Spinner>`         | Component is injected into widget pending transaction overlay. Assume using of spinning animation               |
> | `DepositTermsOfUse` | ComponentType                       | `undefined`         | Component is injected into `TermsOfUseOverlay` to extend default terms of use statement points                  |
> | `ActionButton`      | ComponentType                       | `<ActionButton>`    | Component overrides default `ActionButton` and has `ButtonProps` API                                            |

###### Source: `packages/trading-widget/src/trading-widget/providers/component-provider/component-provider.tsx`

###### Default values: `undefined`

</details>

---

<details>
<summary>
<code>theme</code>
<code><b>/</b></code>
<code>Widget styling variables config</code>
</summary>

##### global

###### color

path: `global.color[name]`

> | name                     | type   | default value                                | description                           |
> | ------------------------ | ------ | -------------------------------------------- | ------------------------------------- |
> | `colorTextPrimary`       | string | `#ffffff`                                    | Primary text color                    |
> | `colorTextPrimaryHover`  | string | `#ffffffCC`                                  | Primary hover text color              |
> | `colorBorderPrimary`     | string | `global?.color?.colorTextPrimary ?? #ffffff` | Primary border color                  |
> | `colorTextSecondary`     | string | `#9DA2AD`                                    | Secondary text color                  |
> | `colorBgPrimary`         | string | `#1B2432`                                    | Primary bg color                      |
> | `colorBgSecondary`       | string | `#2B313E`                                    | Secondary bg color                    |
> | `colorTextAccent`        | string | `#ffffff`                                    | Accent text color                     |
> | `colorTextAccentHover`   | string | `#ffffffCC`                                  | Accent hover text color               |
> | `colorBgAccentFrom`      | string | `#73D393`                                    | Accent bg gradient `from` color       |
> | `colorBgAccentTo`        | string | `#34855E`                                    | Accent bg gradient `to` color         |
> | `colorBgAccentFromHover` | string | `#73D393CC`                                  | Accent hover bg gradient `from` color |
> | `colorBgAccentToHover`   | string | `#162435`                                    | Accent hover bg gradient `to` color   |
> | `colorTextNeutral`       | string | `#9DA2AD80`                                  | Neutral text color                    |
> | `colorBgNeutral`         | string | `#9DA2AD33`                                  | Neutral bg color                      |
> | `colorTextLoading`       | string | `#ffffff99`                                  | Loading text color                    |
> | `colorTextError`         | string | `#EF4444`                                    | Error text color                      |
> | `colorTextWarning`       | string | `#AFA58D`                                    | Warning text color                    |
> | `colorIcon`              | string | `global?.color?.colorTextPrimary ?? #ffffff` | Warning text color                    |

###### size

path: `global.size[name]`

> | name                  | type   | default value                                | description            |
> | --------------------- | ------ | -------------------------------------------- | ---------------------- |
> | `gap`                 | string | `0.25rem`                                    | General flex gap       |
> | `spacer`              | string | `4px`                                        | General spacer         |
> | `fontSizeBase`        | string | `16px`                                       | Font size base         |
> | `lineHeightBase`      | string | `24px`                                       | Line height base       |
> | `fontSizeXs`          | string | `12px`                                       | Font size xs           |
> | `lineHeightXs`        | string | `16px`                                       | Line height xs         |
> | `fontSizeSm`          | string | `14px`                                       | Font size sm           |
> | `lineHeightSm`        | string | `20px`                                       | Line height sm         |
> | `fontSizeLg`          | string | `18px`                                       | Font size lg           |
> | `lineHeightLg`        | string | `28px`                                       | Line height lg         |
> | `iconSize`            | string | `20px`                                       | Icon size base         |
> | `iconSizeSm`          | string | `24px`                                       | Icon size sm           |
> | `iconSecondarySize`   | string | `16px`                                       | Icon secondary size    |
> | `iconSecondarySizeSm` | string | `16px`                                       | Icon secondary size sm |
> | `labelFontSize`       | string | `config?.global?.size?.fontSizeXs ?? 12px`   | Label font size        |
> | `labelLineHeight`     | string | `config?.global?.size?.lineHeightXs ?? 16px` | Label font size        |
> | `labelLineHeight`     | string | `config?.global?.size?.lineHeightXs ?? 16px` | Label font size        |

###### style

path: `global.style[name]`

> | name                 | type   | default value | description                  |
> | -------------------- | ------ | ------------- | ---------------------------- |
> | `radiusPrimary`      | string | `1rem`        | General border radius        |
> | `radiusSecondary`    | string | `1rem`        | Secondary border radius      |
> | `fontWeightLight`    | string | `300`         | Font weight light            |
> | `fontWeightMedium`   | string | `500`         | Font weight medium           |
> | `fontWeightBold`     | string | `700`         | Font weight bold             |
> | `actionOpacity`      | string | `1`           | Action element opacity       |
> | `actionOpacityHover` | string | `0.8`         | Action hover element opacity |

##### component

###### popup

path: `component.popup[name]`

> | name                | type   | default value                                          | description      |
> | ------------------- | ------ | ------------------------------------------------------ | ---------------- |
> | `color.colorText`   | string | `config?.global?.color?.colorTextSecondary ?? #9DA2AD` | Popup text color |
> | `color.colorBg`     | string | `config?.global?.color?.colorBgSecondary ?? #2B313E`   | Popup bg color   |
> | `color.colorBorder` | string | `config?.global?.color?.colorTextSecondary ?? #9DA2AD` | Popup bg color   |
> | `size.fontSize`     | string | `config?.global?.size?.fontSizeXs ?? 12px`             | Popup font size  |

###### popupList

path: `component.popupList[name]`

> | name               | type   | default value | description                   |
> | ------------------ | ------ | ------------- | ----------------------------- |
> | `color.itemBgEven` | string | `transparent` | Popup list even item bg color |
> | `color.itemBgOdd`  | string | `#2A3648`     | Popup list odd item bg color  |
> | `color.headerBg`   | string | `#1B2432`     | Popup list header bg color    |

###### tabGroup

path: `component.tabGroup[name]`

> | name      | type   | default value            | description              |
> | --------- | ------ | ------------------------ | ------------------------ |
> | `size.px` | string | `global.size.spacer * 3` | Tab group padding inline |

###### tabContent

path: `component.tabContent[name]`

> | name       | type   | default value            | description                |
> | ---------- | ------ | ------------------------ | -------------------------- |
> | `size.pt`  | string | `global.size.spacer * 3` | Tab content padding top    |
> | `size.px`  | string | `0px`                    | Tab content padding inline |
> | `size.pb`  | string | `global.size.spacer * 9` | Tab content padding bottom |
> | `size.gap` | string | `global.size.spacer * 2` | Tab content flex gap       |

###### tab

path: `component.tab[name]`

> | name                    | type   | default value                        | description           |
> | ----------------------- | ------ | ------------------------------------ | --------------------- |
> | `size.px`               | string | `global.size.spacer * 9`             | Tab padding inline    |
> | `size.py`               | string | `global.size.spacer * 3`             | Tab padding block     |
> | `size.fontSize`         | string | `global.size.fontSizeSm`             | Tab font size         |
> | `color.colorBg`         | string | `global.color.colorBgNeutral`        | Tab bg color          |
> | `color.colorText`       | string | `global.color.colorTextNeutral`      | Tab text color        |
> | `color.selectColorText` | string | `global.color.colorTextPrimary`      | Tab select text color |
> | `color.colorTextHover`  | string | `global.color.colorTextPrimaryHover` | Tab hover text color  |
> | `style.fontWeight`      | string | `global.style.fontWeightBold`        | Tab font weight       |
> | `style.lineHeight`      | string | `global.size.lineHeightSm`           | Tab line height       |

###### balance

path: `component.balance[name]`

> | name                   | type   | default value                     | description               |
> | ---------------------- | ------ | --------------------------------- | ------------------------- |
> | `size.px`              | string | `global.size.spacer * 3`          | Balance padding inline    |
> | `size.gap`             | string | `global.size.gap`                 | Balance flex gap          |
> | `size.fontSize`        | string | `global.size.fontSizeLg`          | Balance font size         |
> | `size.lineHeight`      | string | `global.size.lineHeightLg`        | Balance line height       |
> | `size.priceFontSize`   | string | `global.size.fontSizeBase`        | Balance price font size   |
> | `size.priceLineHeight` | string | `global.size.lineHeightBase`      | Balance price line height |
> | `color.colorText`      | string | `global.color.colorTextPrimary`   | Balance text color        |
> | `color.priceColorText` | string | `global.color.colorTextSecondary` | Balance price text color  |

###### inputGroup

path: `component.inputGroup[name]`

> | name       | type   | default value            | description                |
> | ---------- | ------ | ------------------------ | -------------------------- |
> | `size.px`  | string | `global.size.spacer * 3` | Input group padding inline |
> | `size.gap` | string | `global.size.gap`        | Input group flex gap       |

###### input

path: `component.input[name]`

> | name                      | type   | default value                     | description                 |
> | ------------------------- | ------ | --------------------------------- | --------------------------- |
> | `size.px`                 | string | `global.size.spacer * 3`          | Input padding inline        |
> | `size.py`                 | string | `global.size.spacer * 2`          | Input padding block         |
> | `size.gap`                | string | `global.size.gap * 2`             | Input flex gap              |
> | `size.priceGap`           | string | `global.size.gap * 2`             | Input flex gap              |
> | `size.iconSize`           | string | `global.size.iconSize`            | Input icon size             |
> | `size.iconSizeSm`         | string | `global.size.iconSizeSm`          | Input icon size sm          |
> | `size.labelFontSize`      | string | `global.size.fontSizeSm`          | Input label line height     |
> | `size.labelLineHeight`    | string | `global.size.lineHeightSm`        | Input label font size       |
> | `size.fontSize`           | string | `global.size.fontSizeSm`          | Input font size             |
> | `size.lineHeight`         | string | `global.size.lineHeightSm`        | Input line height           |
> | `size.fontSizeLg`         | string | `global.size.fontSizeLg`          | Input font size lg          |
> | `size.lineHeightLg`       | string | `global.size.lineHeightLg`        | Input line height lg        |
> | `size.tokenFontSize`      | string | `global.size.fontSizeXs`          | Input token font size       |
> | `size.tokenLineHeight`    | string | `global.size.lineHeightXs`        | Input token line height     |
> | `size.tokenFontSizeSm`    | string | `global.size.fontSizeBase`        | Input token font size sm    |
> | `size.tokenLineHeightSm`  | string | `global.size.lineHeightBase`      | Input token line height sm  |
> | `size.buttonPx`           | string | `global.size.spacer * 2`          | Input button padding inline |
> | `size.buttonPy`           | string | `global.size.spacer`              | Input button padding block  |
> | `size.buttonFontSize`     | string | `global?.size?.fontSizeXs`        | Input button font size      |
> | `size.buttonLineHeight`   | string | `global?.size?.lineHeightXs`      | Input button line height    |
> | `color.textColor`         | string | `global.color.colorTextPrimary`   | Input text color            |
> | `color.loadingTextColor`  | string | `global.color.colorTextLoading`   | Input loading text color    |
> | `color.bgColor`           | string | `global.color.colorBgNeutral`     | Input bg color              |
> | `color.bgColorFocus`      | string | `transparent`                     | Input bg color              |
> | `color.borderColor`       | string | `#4C505B`                         | Input border color          |
> | `color.borderColorFocus`  | string | `global.color.colorTextPrimary`   | Input border focus color    |
> | `color.placeholderColor`  | string | `global.color.colorTextSecondary` | Input placeholder color     |
> | `color.buttonBgColor`     | string | `global.color.colorBgSecondary`   | Input button bg color       |
> | `color.buttonBorderColor` | string | `global.color.colorBgAccentTo`    | Input button border color   |
> | `color.buttonTextColor`   | string | `global.color.colorTextPrimary`   | Input button text color     |
> | `style.radius`            | string | `global.style.radiusPrimary`      | Input border radius         |
> | `style.labelFontWeight`   | string | `global.style.fontWeightLight`    | Input label font weight     |
> | `style.fontWeight`        | string | `global.style.fontWeightLight`    | Input font weight           |
> | `style.tokenFontWeight`   | string | `global.style.fontWeightLight`    | Input token font weight     |
> | `style.buttonRadius`      | string | `30px`                            | Input button border radius  |

###### tooltip

path: `component.tooltip[name]`

> | name              | type   | default value | description      |
> | ----------------- | ------ | ------------- | ---------------- |
> | `color.colorBg`   | string | `#12171F`     | Tooltip bg color |
> | `color.colorText` | string | `#ffffff`     | Tooltip bg color |

###### switch

path: `component.switch[name]`

> | name                   | type   | default value | description               |
> | ---------------------- | ------ | ------------- | ------------------------- |
> | `color.colorBgChecked` | string | `#152E4D`     | Switch checked bg color   |
> | `color.colorBg`        | string | `#4C505B`     | Switch unchecked bg color |

###### actionButton

path: `component.actionButton[name]`

> | name                            | type   | default value                         | description                                |
> | ------------------------------- | ------ | ------------------------------------- | ------------------------------------------ |
> | `size.borderWidth`              | string | `1px`                                 | Action button border width                 |
> | `color.colorBgFrom`             | string | `global.color.colorBgAccentFrom`      | Action button bg gradient color from       |
> | `color.colorBgTo`               | string | `global.color.colorBgAccentTo`        | Action button bg gradient color to         |
> | `color.colorBgFromHover`        | string | `global.color.colorBgAccentFromHover` | Action button hover bg gradient color from |
> | `color.colorBgToHover`          | string | `global.color.colorBgAccentTo`        | Action button hover bg gradient color to   |
> | `color.colorBorder`             | string | `global.color.colorBgAccentFrom`      | Action button border color                 |
> | `color.colorText`               | string | `global.color.colorTextAccent`        | Action button text color                   |
> | `color.colorText`               | string | `global.color.colorTextAccent`        | Action button text color                   |
> | `color.outlineColorBorder`      | string | `#ffffff33`                           | Action outline button border color         |
> | `color.outlineColorBorderHover` | string | `#ffffffCC`                           | Action outline button hover border color   |
> | `color.outlineColorText`        | string | `global.color.colorTextPrimary`       | Action outline button text color           |

###### meta

path: `component.meta[name]`

> | name                  | type   | default value                        | description          |
> | --------------------- | ------ | ------------------------------------ | -------------------- |
> | `size.gap`            | string | `global.size.gap`                    | Meta flex gap        |
> | `size.px`             | string | `global.size.spacer * 3`             | Meta padding inline  |
> | `color.linkTextColor` | string | `global.color.colorBgAccentFrom`     | Meta link text color |
> | `color.panelBgHover`  | string | `config.global.color.colorBgNeutral` | Meta panel hover bg  |

###### Source: `packages/trading-widget/src/trading-widget/providers/theme-provider/theme-provider.tsx`

###### Default values: `undefined`

</details>

---

<details>
<summary>
<code>translation</code>
<code><b>/</b></code>
<code>Translation keys</code>
</summary>|

> | name                             | type   | default value                                                                                                                                                                         | description |
> | -------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
> | `depositSlippageWarning`         | string | Excludes entry fee. Slippage may be amplified by the leverage. See the docs for more info.                                                                                            |             |
> | `withdrawSlippageWarning`        | string | Slippage only applies to single asset withdrawals and withdrawals from vaults with debt positions in Aave.                                                                            |             |
> | `minSlippageWarning`             | string | Flexible min slippage value that is likely enough to process the transaction.                                                                                                         |             |
> | `highSlippageWarning`            | string | We recommend using another asset to trade with lower slippage.                                                                                                                        |             |
> | `recommendedMinSlippage`         | string | Recommended Min Slippage                                                                                                                                                              |             |
> | `projectedDailyEarningsTooltip`  | string | Projected daily earnings are based on the current APY and may differ from actual earnings.                                                                                            |             |
> | `dailyEarnings`                  | string | Daily Earnings                                                                                                                                                                        |             |
> | `projectedYearlyEarningsTooltip` | string | Projected yearly earnings are based on the current APY and may differ from actual earnings.                                                                                           |             |
> | `yearlyEarnings`                 | string | Yearly Earnings                                                                                                                                                                       |             |
> | `fullReceiveDetails`             | string | See full details influencing what you will receive.                                                                                                                                   |             |
> | `tradeDetails`                   | string | Trade details                                                                                                                                                                         |             |
> | `maxSlippage`                    | string | Max slippage                                                                                                                                                                          |             |
> | `minReceiveAmount`               | string | You will receive no less than this amount.                                                                                                                                            |             |
> | `minReceived`                    | string | Minimum Received                                                                                                                                                                      |             |
> | `estimatedMultiAssetFractions`   | string | Estimated multi asset fractions                                                                                                                                                       |             |
> | `infinite`                       | string | Infinite                                                                                                                                                                              |             |
> | `tokenAllowance`                 | string | Token Allowance                                                                                                                                                                       |             |
> | `entryFee`                       | string | Entry Fee                                                                                                                                                                             |             |
> | `entryFeeExplanation`            | string | When you deposit, the token takes a small entry fee. This fee helps cover the costs when we rebalance the underlying funds, and it's shared among all token holders.                  |             |
> | `amountToBeApproved`             | string | Amount of {symbol} tokens to be approved. Can be customized in settings.                                                                                                              |             |
> | `minDepositUsd`                  | string | Minimum deposit in USD.                                                                                                                                                               |             |
> | `minDeposit`                     | string | Minimum Deposit                                                                                                                                                                       |             |
> | `tokensLockTime`                 | string | Purchased tokens will have a {lockTime} lock.                                                                                                                                         |             |
> | `slippageTolerance`              | string | Slippage tolerance                                                                                                                                                                    |             |
> | `bypassEntryFee`                 | string | Bypass Entry Fee                                                                                                                                                                      |             |
> | `tokenAmountToApprove`           | string | Amount of tokens to be approved.                                                                                                                                                      |             |
> | `auto`                           | string | Auto                                                                                                                                                                                  |             |
> | `lengthenLockup`                 | string | Lengthen lockup to remove entry fee                                                                                                                                                   |             |
> | `deposit`                        | string | Buy                                                                                                                                                                                   |             |
> | `withdraw`                       | string | Sell                                                                                                                                                                                  |             |
> | `yourBalance`                    | string | Your Balance                                                                                                                                                                          |             |
> | `max`                            | string | Max                                                                                                                                                                                   |             |
> | `allAssets`                      | string | All Assets                                                                                                                                                                            |             |
> | `all`                            | string | All                                                                                                                                                                                   |             |
> | `payWith`                        | string | Pay with                                                                                                                                                                              |             |
> | `buyEstimated`                   | string | Buy (estimated)                                                                                                                                                                       |             |
> | `sell`                           | string | Sell                                                                                                                                                                                  |             |
> | `receiveEstimated`               | string | Receive (estimated)                                                                                                                                                                   |             |
> | `confirmInWallet`                | string | Please confirm in wallet                                                                                                                                                              |             |
> | `pending`                        | string | Pending...                                                                                                                                                                            |             |
> | `approve`                        | string | Approve                                                                                                                                                                               |             |
> | `connectWallet`                  | string | Connect Wallet                                                                                                                                                                        |             |
> | `minimumPurchase`                | string | Minimum purchase is ${value}                                                                                                                                                          |             |
> | `poolIsInactive`                 | string | {poolSymbol} token is no longer active. Please withdraw from them.                                                                                                                    |             |
> | `poolIsPrivate`                  | string | This vault is currently private                                                                                                                                                       |             |
> | `updateOracles`                  | string | Update Oracles                                                                                                                                                                        |             |
> | `checkingOracles`                | string | Checking Oracles                                                                                                                                                                      |             |
> | `confirmMaxSlippage`             | string | Confirm {slippagePercentage}% max slippage                                                                                                                                            |             |
> | `withdrawalWindowDisabled`       | string | You can sell your {tokenSymbol} tokens during withdrawal window period starting from {startTime}                                                                                      |             |
> | `withdrawalLiquidityDisabled`    | string | Intended withdraw value is greater than available liquidity ({symbol} {value})                                                                                                        |             |
> | `withdrawCooldown`               | string | You can sell your {tokenSymbol} tokens in {cooldownEndTime}                                                                                                                           |             |
> | `termsOfUse`                     | string | Terms Of Use                                                                                                                                                                          |             |
> | `termOfUseDepositListTitle`      | string | Please know the following before depositing                                                                                                                                           |             |
> | `termOfUseDepositAssetSlippage`  | string | When exiting, investors receive single asset or the underlying vault assets. Withdraw slippage can be customized in withdraw settings                                                 |             |
> | `termOfUseDepositBugs`           | string | There may be interface bugs on the platform                                                                                                                                           |             |
> | `termOfUseDepositDowntime`       | string | There may be interface downtime (planned and unplanned)                                                                                                                               |             |
> | `termOfUseDepositAuditRisk`      | string | Smart contracts are audited but a risk is still present                                                                                                                               |             |
> | `termOfUseDepositAccept`         | string | Accept & Deposit                                                                                                                                                                      |             |
> | `back`                           | string | Back                                                                                                                                                                                  |             |
> | `highSlippage`                   | string | High Slippage Alert                                                                                                                                                                   |             |
> | `responsibleHighSlippage`        | string | By proceeding with this trade, you acknowledge and accept the possibility of experiencing high slippage, resulting in a potential difference between the expected and executed price. |             |
> | `highSlippageListTitle`          | string | Please consider the following before confirming                                                                                                                                       |             |
> | `highSlippageQuoteDiff`          | string | Be aware that the final amount of assets you receive may be different from the initially quoted value.                                                                                |             |
> | `highSlippageRisk`               | string | Ensure that you understand the risks associated with high slippage and are comfortable proceeding with the trade.                                                                     |             |
> | `confirm`                        | string | Confirm                                                                                                                                                                               |             |
> | `selectToken`                    | string | Select Token                                                                                                                                                                          |             |
> | `sendingOrderToWallet`           | string | Sending order to your wallet                                                                                                                                                          |             |
> | `settingUpTx`                    | string | Setting up transaction                                                                                                                                                                |             |
> | `updateSynthetixOracles`         | string | Updating Synthetix Oracles                                                                                                                                                            |             |
> | `approveSpending`                | string | Approve {symbol} spending                                                                                                                                                             |             |
> | `pay`                            | string | Pay                                                                                                                                                                                   |             |
> | `multiAssetFractions`            | string | multi asset fractions                                                                                                                                                                 |             |
> | `swappableAssets`                | string | swappable assets                                                                                                                                                                      |             |
> | `explorer`                       | string | Explorer                                                                                                                                                                              |             |
> | `as`                             | string | As                                                                                                                                                                                    |             |
> | `switchNetwork`                  | string | Switch Network                                                                                                                                                                        |             |
> | `depositAction`                  | string | Buy                                                                                                                                                                                   |             |
> | `withdrawAction`                 | string | Sell                                                                                                                                                                                  |             |
> | `swapAction`                     | string | Swap                                                                                                                                                                                  |             |
> | `unrollAction`                   | string | Unroll                                                                                                                                                                                |             |
> | `unrollAndClaimAction`           | string | Claim                                                                                                                                                                                 |             |
> | `claimAction`                    | string | Claim Without Swap                                                                                                                                                                    |             |
> | `claimLabel`                     | string | Claim                                                                                                                                                                                 |             |
> | `swapAndClaimTo`                 | string | Swap and claim assets to                                                                                                                                                              |             |
> | `initWithdrawDescription`        | string | Unroll                                                                                                                                                                                |             |
> | `initWithdrawTooltip`            | string | Unroll prepares assets for single asset withdrawal                                                                                                                                    |             |
> | `completeWithdrawDescription`    | string | Claim                                                                                                                                                                                 |             |
> | `completeWithdrawTooltip`        | string | This final step swaps all assets to a single asset and sends it to your wallet                                                                                                        |             |
> | `unrollAndClaimDescription`      | string | Claim                                                                                                                                                                                 |             |
> | `total`                          | string | Total:                                                                                                                                                                                |             |
> | `showAll`                        | string | Show All                                                                                                                                                                              |             |
> | `hide`                           | string | Hide                                                                                                                                                                                  |             |
> | `refreshSwapQuoteTooltip`        | string | Refresh swap quote                                                                                                                                                                    |             |

###### Source: `packages/trading-widget/src/trading-widget/providers/translation-provider/translation-provider.tsx`

###### Default values: `packages/trading-widget/src/trading-widget/providers/translation-provider/translation-provider.defaults.ts`

</details>
