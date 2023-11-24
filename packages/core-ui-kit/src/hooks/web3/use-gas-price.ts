import { useFeeData } from 'wagmi'

export const useGasPrice: typeof useFeeData = (args) =>
  useFeeData({ staleTime: 30_000, ...args })
