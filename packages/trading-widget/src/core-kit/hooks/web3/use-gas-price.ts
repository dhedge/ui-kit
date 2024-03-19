import { useEstimateFeesPerGas } from 'wagmi'

export const useGasPrice: typeof useEstimateFeesPerGas = (args) =>
  useEstimateFeesPerGas({
    ...args,
    query: {
      ...args?.query,
      staleTime: 30_000,
    },
  })
