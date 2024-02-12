import { act } from '@testing-library/react'

import { renderHook } from 'test-utils'

import { useBrowserStorage } from './use-browser-storage'

vi.mock('utils', () => ({ clientSide: true }))

describe('useBrowserStorage', () => {
  const getItemSpy = vi.spyOn(Storage.prototype, 'getItem')
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

  it('should return the initial value from sessionStorage', () => {
    const key = 'testKey'
    const initialValue = 'initialValue'

    getItemSpy.mockReturnValueOnce(null)

    const { result } = renderHook(() =>
      useBrowserStorage('sessionStorage', key, initialValue),
    )

    expect(result.current[0]).toBe(initialValue)
    expect(getItemSpy).toHaveBeenCalledWith(key)
  })

  it('should set the value in sessionStorage', () => {
    const key = 'testKey'
    const initialValue = 'initialValue'
    const updatedValue = 'updatedValue'

    const { result } = renderHook(() =>
      useBrowserStorage('sessionStorage', key, initialValue),
    )

    act(() => {
      result.current[1](updatedValue)
    })

    expect(result.current[0]).toBe(updatedValue)
    expect(setItemSpy).toHaveBeenCalledTimes(1)
    expect(setItemSpy).toHaveBeenCalledWith(key, JSON.stringify(updatedValue))
  })

  it('should return the initial value from localStorage', () => {
    const key = 'testKey'
    const initialValue = 'initialValue'

    getItemSpy.mockReturnValueOnce(null)

    const { result } = renderHook(() =>
      useBrowserStorage('localStorage', key, initialValue),
    )

    expect(result.current[0]).toBe(initialValue)
    expect(getItemSpy).toHaveBeenCalledWith(key)
  })

  it('should set the value in localStorage', () => {
    const key = 'testKey'
    const initialValue = 'initialValue'
    const updatedValue = 'updatedValue'

    const { result } = renderHook(() =>
      useBrowserStorage('localStorage', key, initialValue),
    )

    act(() => {
      result.current[1](updatedValue)
    })

    expect(result.current[0]).toBe(updatedValue)
    expect(setItemSpy).toHaveBeenCalledTimes(1)
    expect(setItemSpy).toHaveBeenCalledWith(key, JSON.stringify(updatedValue))
  })
})
