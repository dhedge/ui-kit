import { renderHook } from 'test-utils'
import { vi } from 'vitest'

import { useContractReadsErrorLogging } from './use-contract-reads-error-logging'

const stub = () => null

describe('useContractReadsErrorLogging', () => {
  it('should should log error message when status is "failure"', () => {
    const mockData = [
      { error: new Error('Sample error 1'), status: 'failure' },
      { status: 'success' },
    ]

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementationOnce(stub)

    renderHook(() => useContractReadsErrorLogging(mockData))

    expect(consoleWarnSpy).toHaveBeenCalledOnce()
    expect(consoleWarnSpy).toHaveBeenCalledWith('Sample error 1')

    consoleWarnSpy.mockRestore()
  })

  it('should not log error message when status is not "failure"', () => {
    const mockData = [
      { error: new Error('Sample error 1'), status: 'success' },
      { error: new Error('Sample error 2'), status: 'success' },
    ]

    // Create a console.warn spy
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementationOnce(stub)

    renderHook(() => useContractReadsErrorLogging(mockData))

    expect(consoleWarnSpy).not.toHaveBeenCalled()

    consoleWarnSpy.mockRestore()
  })
})
