import type { Address, ContractCallArgs } from 'types/web3.types'

interface BuyingWithEasyswapperArgsProps {
  receiveAssetAddress: Address
  sendAssetAddress: Address
  fromTokenAmount: string
  poolDepositAddress: Address
  receiveAssetInputValue: string
}

export class BuyingWithEasyswapperArgs implements ContractCallArgs<string> {
  readonly receiveAssetAddress: Address
  readonly sendAssetAddress: Address
  readonly fromTokenAmount: string
  readonly poolDepositAddress: Address
  readonly receiveAssetInputValue: string

  constructor(props: BuyingWithEasyswapperArgsProps) {
    this.receiveAssetAddress = props.receiveAssetAddress
    this.sendAssetAddress = props.sendAssetAddress
    this.fromTokenAmount = props.fromTokenAmount
    this.poolDepositAddress = props.poolDepositAddress
    this.receiveAssetInputValue = props.receiveAssetInputValue
  }

  getOrderedArgs(minReturnAmount: string) {
    return [
      this.receiveAssetAddress,
      this.sendAssetAddress,
      this.fromTokenAmount,
      this.poolDepositAddress,
      minReturnAmount,
    ]
  }
}
