import { renderHook } from 'test-utils'
import * as w from 'wagmi'

import { useBlockNumber } from './use-block-number'

vi.mock('wagmi', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('wagmi')

  return {
    ...actual,
    useBlockNumber: vi.fn(),
  }
})

describe('useBlockNumber', () => {
  it('should call block number hook', () => {
    const spy = vi
      .spyOn(w, 'useBlockNumber')
      .mockImplementationOnce(() => ({}) as ReturnType<typeof w.useBlockNumber>)

    renderHook(() => useBlockNumber())

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
