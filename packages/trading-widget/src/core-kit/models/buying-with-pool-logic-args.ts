import type { Address, ContractCallArgs } from 'core-kit/types/web3.types'

interface BuyingWithPoolLogicArgsProps {
  fromTokenAmount: string
  fromTokenAddress: Address
  receiveAssetInputValue: string
}

export class BuyingWithPoolLogicArgs implements ContractCallArgs<string> {
  readonly fromTokenAddress: Address
  readonly fromTokenAmount: string
  readonly receiveAssetInputValue: string

  constructor(props: BuyingWithPoolLogicArgsProps) {
    this.fromTokenAmount = props.fromTokenAmount
    this.fromTokenAddress = props.fromTokenAddress
    this.receiveAssetInputValue = props.receiveAssetInputValue
  }

  getOrderedArgs() {
    return [this.fromTokenAddress, this.fromTokenAmount]
  }
}
