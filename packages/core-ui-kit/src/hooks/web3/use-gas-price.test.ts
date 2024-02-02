import { renderHook } from 'test-utils'

import { useGasPrice } from './use-gas-price'

const mocks = vi.hoisted(() => {
  return {
    useEstimateFeesPerGas: vi.fn(),
  }
})

vi.mock('wagmi', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('wagmi')

  return {
    ...actual,
    useEstimateFeesPerGas: mocks.useEstimateFeesPerGas,
  }
})

describe('useGasPrice', () => {
  it('should call fee data hook', () => {
    renderHook(() => useGasPrice())

    expect(mocks.useEstimateFeesPerGas).toHaveBeenCalledTimes(1)
  })
})
