import type { Address, ContractCallArgs } from 'types/web3.types'

interface DefaultSellingParamsProps {
  sendAssetAddress: Address
  fromTokenAmount: string
  receiveAssetAddress: Address
  receiveAssetInputValue: string
  decimalsReceiveToken: number
}

export class DefaultSellingParams implements ContractCallArgs<string> {
  readonly sendAssetAddress: Address
  readonly fromTokenAmount: string
  readonly receiveAssetAddress: Address
  readonly receiveAssetInputValue: string
  readonly decimalsReceiveToken: number

  constructor(props: DefaultSellingParamsProps) {
    this.sendAssetAddress = props.sendAssetAddress
    this.fromTokenAmount = props.fromTokenAmount
    this.receiveAssetAddress = props.receiveAssetAddress
    this.receiveAssetInputValue = props.receiveAssetInputValue
    this.decimalsReceiveToken = props.decimalsReceiveToken
  }

  getOrderedArgs(minReturnAmount: string) {
    return [
      this.sendAssetAddress,
      this.fromTokenAmount,
      this.receiveAssetAddress,
      minReturnAmount,
    ]
  }
}
