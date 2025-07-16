import * as w from 'wagmi'

import { DEFAULT_PRECISION } from 'core-kit/const'
import { useBalance } from 'core-kit/hooks/web3/use-balance'
import { renderHook } from 'tests/test-utils'

vi.mock('wagmi', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('wagmi')

  return {
    ...actual,
    useBalance: vi.fn(),
  }
})

describe('useBalance', () => {
  it('should return balance data', () => {
    const data = {
      decimals: DEFAULT_PRECISION,
      formatted: '0',
      symbol: 'symbol',
      value: BigInt(0),
    }

    vi.mocked(w.useBalance).mockImplementationOnce(
      () => ({ data }) as ReturnType<typeof w.useBalance>,
    )

    const { result } = renderHook(() => useBalance())

    expect(result.current.data).toEqual(data)
  })

  it('should call balance hook', () => {
    const spy = vi
      .spyOn(w, 'useBalance')
      .mockImplementationOnce(() => ({}) as ReturnType<typeof w.useBalance>)

    renderHook(() => useBalance())

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
