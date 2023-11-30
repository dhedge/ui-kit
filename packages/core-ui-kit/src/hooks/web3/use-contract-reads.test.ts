import * as w from 'wagmi'

import { renderHook } from 'test-utils'

import { useContractReads } from './use-contract-reads'

vi.mock('wagmi', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('wagmi')

  return {
    ...actual,
    useContractReads: vi.fn(),
  }
})

describe('useContractReads', () => {
  it('should call contract reads hook', () => {
    const spy = vi
      .spyOn(w, 'useContractReads')
      .mockImplementationOnce(
        () => ({}) as ReturnType<typeof w.useContractReads>,
      )

    renderHook(() => useContractReads())

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
