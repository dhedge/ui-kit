import { DEFAULT_DEBOUNCE_TIME, EXTENDED_DEBOUNCE_TIME } from 'core-kit/const'
import { useSendTokenInput } from 'core-kit/hooks/state'
import { useDebounce } from 'core-kit/hooks/utils'

type UseSendTokenDebouncedValueProps =
  | { extendedDebounceTime?: boolean }
  | undefined

export const useSendTokenDebouncedValue = (
  props: UseSendTokenDebouncedValueProps = {},
) => {
  const extendedDebounceTime = props?.extendedDebounceTime ?? false
  const [sendToken] = useSendTokenInput()

  const debouncedSendTokenValue = useDebounce(
    sendToken.value,
    extendedDebounceTime ? EXTENDED_DEBOUNCE_TIME : DEFAULT_DEBOUNCE_TIME,
  )

  return {
    debouncedSendTokenValue,
    isDebouncing: sendToken.value !== debouncedSendTokenValue,
  }
}
