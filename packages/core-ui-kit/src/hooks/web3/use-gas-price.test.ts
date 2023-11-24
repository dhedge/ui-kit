import { renderHook } from 'test-utils'

import { useGasPrice } from './use-gas-price'

const mocks = vi.hoisted(() => {
  return {
    useFeeData: vi.fn(),
  }
})

vi.mock('wagmi', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('wagmi')

  return {
    ...actual,
    useFeeData: mocks.useFeeData,
  }
})

describe('useGasPrice', () => {
  it('should call fee data hook', () => {
    renderHook(() => useGasPrice())

    expect(mocks.useFeeData).toHaveBeenCalledTimes(1)
  })
})
