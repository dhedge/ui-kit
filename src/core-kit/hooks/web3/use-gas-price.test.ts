import { useGasPrice } from 'core-kit/hooks/web3/use-gas-price'
import { renderHook } from 'tests/test-utils'

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
