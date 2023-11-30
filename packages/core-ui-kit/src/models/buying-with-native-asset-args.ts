import type { Address, ContractCallArgs } from 'types/web3.types'

interface BuyingWithNativeAssetArgsProps {
  receiveAssetAddress: Address
  poolDepositAddress: Address
  fromTokenAmount: string
  receiveAssetInputValue: string
}

export class BuyingWithNativeAssetArgs implements ContractCallArgs<string> {
  readonly receiveAssetAddress: Address
  readonly fromTokenAmount: string
  readonly poolDepositAddress: Address
  readonly receiveAssetInputValue: string

  constructor(props: BuyingWithNativeAssetArgsProps) {
    this.receiveAssetAddress = props.receiveAssetAddress
    this.fromTokenAmount = props.fromTokenAmount
    this.poolDepositAddress = props.poolDepositAddress
    this.receiveAssetInputValue = props.receiveAssetInputValue
  }

  getOrderedArgs(minReturnAmount: string) {
    return [this.receiveAssetAddress, this.poolDepositAddress, minReturnAmount]
  }
}
