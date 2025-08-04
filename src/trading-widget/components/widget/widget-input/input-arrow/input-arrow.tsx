import { ArrowDownIcon } from '@heroicons/react/24/solid'
import type { FC } from 'react'

import { useInputArrow } from './input-arrow.hooks'

export const InputArrow: FC = () => {
  const { handleClick } = useInputArrow()
  return (
    <div
      onClick={handleClick}
      className="dtw-cursor-pointer dtw-group dtw-absolute dtw-left-1/2 -dtw-top-[calc(var(--panel-inputs-group-gap)*0.5)] -dtw-translate-y-1/2 -dtw-translate-x-1/2 dtw-flex dtw-items-center dtw-justify-center dtw-rounded-[var(--panel-inputs-arrow-radius)] dtw-border-2 dtw-border-[color:var(--panel-background-color)]"
    >
      <button className="!dtw-bg-[var(--panel-inputs-arrow-bg)] dtw-rounded-[var(--panel-inputs-arrow-radius)] dtw-px-[var(--panel-inputs-group-px-arrow)] dtw-py-[var(--panel-inputs-group-py-arrow)]">
        <ArrowDownIcon className="dtw-h-[var(--panel-inputs-group-arrow-size)] dtw-w-[var(--panel-inputs-group-arrow-size)] dtw-text-[color:var(--panel-inputs-arrow-color)] group-hover:dtw-opacity-[var(--panel-action-hover-opacity)] group-hover:dtw-rotate-180 dtw-transition-transform" />
      </button>
    </div>
  )
}
