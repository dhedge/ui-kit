import { act } from '@testing-library/react'

import { vi } from 'vitest'

import { useDebounce } from 'core-kit/hooks/utils/use-debounce'
import { renderHook } from 'tests/test-utils'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return the initial value', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce the value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      },
    )

    act(() => {
      rerender({ value: 'updated', delay: 500 })
    })

    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })

  it('should cancel the debounce on unmount', () => {
    vi.spyOn(window, 'clearTimeout')
    const { result, unmount } = renderHook(() => useDebounce('initial', 500))

    unmount()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(clearTimeout).toHaveBeenCalled()
    expect(result.current).toBe('initial')
  })
})
