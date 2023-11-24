import { renderHook } from 'test-utils'
import { vi } from 'vitest'

import { useContractReadErrorLogging } from './use-contract-read-error-logging'

const stub = () => null

describe('useContractReadErrorLogging', () => {
  it('should should log error message when status is failure', () => {
    const mockData = { error: new Error('Sample error 1'), status: 'failure' }

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementationOnce(stub)

    renderHook(() => useContractReadErrorLogging(mockData))

    expect(consoleWarnSpy).toHaveBeenCalledOnce()
    expect(consoleWarnSpy).toHaveBeenCalledWith('Sample error 1')

    consoleWarnSpy.mockRestore()
  })

  it('should not log error message when status is not "failure"', () => {
    const mockData = { error: new Error('Sample error 1'), status: 'success' }

    // Create a console.warn spy
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementationOnce(stub)

    renderHook(() => useContractReadErrorLogging(mockData))

    expect(consoleWarnSpy).not.toHaveBeenCalled()

    consoleWarnSpy.mockRestore()
  })
})
