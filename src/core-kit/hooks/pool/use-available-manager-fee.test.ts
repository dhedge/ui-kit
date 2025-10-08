import * as wagmi from 'wagmi'

import { DEFAULT_PRECISION, optimism } from 'core-kit/const'
import * as multicallHooks from 'core-kit/hooks/pool/multicall'
import { useAvailableManagerFee } from 'core-kit/hooks/pool/use-available-manager-fee'
import * as stateHooks from 'core-kit/hooks/state'
import { shiftBy } from 'core-kit/utils'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

const toD18String = (value: string | number) =>
  shiftBy(value, DEFAULT_PRECISION)

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolConfig: vi.fn(),
}))

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolManagerStatic: vi.fn(),
  usePoolDynamic: vi.fn(),
}))

vi.mock('wagmi', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('wagmi')
  return {
    ...actual,
    useReadContract: vi.fn(),
  }
})

describe('useAvailableManagerFee', () => {
  beforeEach(() => {
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    } as unknown as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>)
    vi.mocked(wagmi.useReadContract).mockReset()
  })

  it('disables query when no cap or total supply', () => {
    vi.mocked(multicallHooks.usePoolManagerStatic).mockReturnValue({
      data: { maxSupplyCapD18: 0n },
    } as unknown as ReturnType<typeof multicallHooks.usePoolManagerStatic>)
    vi.mocked(multicallHooks.usePoolDynamic).mockReturnValue({
      data: { totalSupplyD18: undefined },
    } as unknown as ReturnType<typeof multicallHooks.usePoolDynamic>)
    vi.mocked(wagmi.useReadContract).mockImplementationOnce((args: any) => {
      expect(args.query?.enabled).toBe(false)
      return {
        data: undefined,
      } as unknown as ReturnType<typeof wagmi.useReadContract>
    })

    const { result } = renderHook(() => useAvailableManagerFee())
    expect(result.current.data).toBeUndefined()
  })

  it('calls with totalSupply and rounds the result up', () => {
    vi.mocked(multicallHooks.usePoolManagerStatic).mockReturnValue({
      data: { maxSupplyCapD18: BigInt(toD18String(1000)) },
    } as unknown as ReturnType<typeof multicallHooks.usePoolManagerStatic>)
    vi.mocked(multicallHooks.usePoolDynamic).mockReturnValue({
      data: { totalSupplyD18: toD18String(123.4567) },
    } as unknown as ReturnType<typeof multicallHooks.usePoolDynamic>)

    let capturedArgs: any
    vi.mocked(wagmi.useReadContract).mockImplementationOnce((args: any) => {
      capturedArgs = args
      const raw = BigInt(toD18String(9.01))
      const selected = args.query?.select ? args.query.select(raw) : raw
      return {
        data: selected,
      } as unknown as ReturnType<typeof wagmi.useReadContract>
    })

    const { result } = renderHook(() => useAvailableManagerFee())
    expect(result.current.data).toBe(10)
    expect(capturedArgs.functionName).toBe('calculateAvailableManagerFee')
    expect(capturedArgs.args?.[0]).toBe(BigInt(toD18String(123.4567)))
    expect(capturedArgs.query?.enabled).toBe(true)
  })
})
