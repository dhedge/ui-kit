import { expect } from 'vitest'

import { optimism } from 'core-kit/const'
import { useCanSpend } from 'core-kit/hooks/trading/allowance/use-can-spend'
import * as webHooks from 'core-kit/hooks/web3'

import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/web3', () => ({
  useTokenAllowance: vi.fn(),
}))

describe('useCanSpend', () => {
  it('should handle skip', () => {
    const remainingAllowance = BigInt(1)
    const rawAmountToSpend = '1'
    const tokenAddress = TEST_ADDRESS
    const ownerAddress = TEST_ADDRESS
    const spenderAddress = TEST_ADDRESS
    const chainId = optimism.id
    const skip = true

    expect(skip).toBe(true)

    vi.mocked(webHooks.useTokenAllowance).mockReturnValue({
      data: remainingAllowance,
    } as ReturnType<typeof webHooks.useTokenAllowance>)

    const { result } = renderHook(() =>
      useCanSpend({
        rawAmountToSpend,
        tokenAddress,
        ownerAddress,
        spenderAddress,
        chainId,
        skip,
      }),
    )

    expect(result.current).toBe(true)
  })

  it('should handle falsy remainingAllowance', () => {
    const remainingAllowance = BigInt(0)
    const rawAmountToSpend = '1'
    const tokenAddress = TEST_ADDRESS
    const ownerAddress = TEST_ADDRESS
    const spenderAddress = TEST_ADDRESS
    const chainId = optimism.id
    const skip = false

    expect(skip).toBe(false)
    expect(remainingAllowance).toEqual(BigInt(0))

    vi.mocked(webHooks.useTokenAllowance).mockReturnValue({
      data: remainingAllowance,
    } as ReturnType<typeof webHooks.useTokenAllowance>)

    const { result } = renderHook(() =>
      useCanSpend({
        rawAmountToSpend,
        tokenAddress,
        ownerAddress,
        spenderAddress,
        chainId,
        skip,
      }),
    )

    expect(result.current).toBe(false)
  })

  it('should handle falsy or zero rawAmountToSpend', () => {
    const remainingAllowance = BigInt(1)
    const rawAmountToSpend = '0'
    const tokenAddress = TEST_ADDRESS
    const ownerAddress = TEST_ADDRESS
    const spenderAddress = TEST_ADDRESS
    const chainId = optimism.id
    const skip = false

    expect(skip).toBe(false)
    expect(remainingAllowance).not.toEqual(BigInt(0))
    expect(rawAmountToSpend === '0').toBe(true)

    vi.mocked(webHooks.useTokenAllowance).mockReturnValue({
      data: remainingAllowance,
    } as ReturnType<typeof webHooks.useTokenAllowance>)

    const { result } = renderHook(() =>
      useCanSpend({
        rawAmountToSpend,
        tokenAddress,
        ownerAddress,
        spenderAddress,
        chainId,
        skip,
      }),
    )

    expect(result.current).toBe(true)
  })

  it('should handle remainingAllowance gte rawAmountToSpend', () => {
    const remainingAllowance = BigInt(1)
    const rawAmountToSpend = '0.5'
    const tokenAddress = TEST_ADDRESS
    const ownerAddress = TEST_ADDRESS
    const spenderAddress = TEST_ADDRESS
    const chainId = optimism.id
    const skip = false

    expect(skip).toBe(false)
    expect(remainingAllowance).toBeGreaterThan(BigInt(0))
    expect(+rawAmountToSpend).toBeGreaterThan(BigInt(0))
    expect(remainingAllowance).toBeGreaterThan(+rawAmountToSpend)

    vi.mocked(webHooks.useTokenAllowance).mockReturnValue({
      data: remainingAllowance,
    } as ReturnType<typeof webHooks.useTokenAllowance>)

    const { result } = renderHook(() =>
      useCanSpend({
        rawAmountToSpend,
        tokenAddress,
        ownerAddress,
        spenderAddress,
        chainId,
        skip,
      }),
    )

    expect(result.current).toBe(true)
  })

  it('should handle remainingAllowance lt rawAmountToSpend', () => {
    const remainingAllowance = BigInt(1)
    const rawAmountToSpend = '2'
    const tokenAddress = TEST_ADDRESS
    const ownerAddress = TEST_ADDRESS
    const spenderAddress = TEST_ADDRESS
    const chainId = optimism.id
    const skip = false

    expect(skip).toBe(false)
    expect(remainingAllowance).toBeGreaterThan(BigInt(0))
    expect(+rawAmountToSpend).toBeGreaterThan(0)
    expect(remainingAllowance).toBeLessThan(+rawAmountToSpend)

    vi.mocked(webHooks.useTokenAllowance).mockReturnValue({
      data: remainingAllowance,
    } as ReturnType<typeof webHooks.useTokenAllowance>)

    const { result } = renderHook(() =>
      useCanSpend({
        rawAmountToSpend,
        tokenAddress,
        ownerAddress,
        spenderAddress,
        chainId,
        skip,
      }),
    )

    expect(result.current).toBe(false)
  })
})
