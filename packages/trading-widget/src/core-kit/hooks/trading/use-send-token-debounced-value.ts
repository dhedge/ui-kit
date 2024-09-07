import { DEFAULT_DEBOUNCE_TIME, EXTENDED_DEBOUNCE_TIME } from 'core-kit/const'
import { useSendTokenInput } from 'core-kit/hooks/state'
import { useDebounce } from 'core-kit/hooks/utils'

export const useSendTokenDebouncedValue = () => {
  const [sendToken] = useSendTokenInput()

  const debouncedSendTokenValue = useDebounce(
    sendToken.value,
    DEFAULT_DEBOUNCE_TIME,
  )
  // use extended debounce time to calculate isDebouncing to prevent UI blinking
  const extendedDebouncedSendTokenValue = useDebounce(
    sendToken.value,
    EXTENDED_DEBOUNCE_TIME,
  )

  return {
    debouncedSendTokenValue,
    isDebouncing: sendToken.value !== extendedDebouncedSendTokenValue,
  }
}
