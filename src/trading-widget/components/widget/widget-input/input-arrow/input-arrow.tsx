import { ArrowDownIcon } from '@heroicons/react/24/solid'
import type { FC } from 'react'

export const InputArrow: FC = () => (
  <div className="dtw-absolute dtw-left-1/2 -dtw-top-[calc(var(--panel-inputs-group-gap)*0.5)] -dtw-translate-y-1/2 -dtw-translate-x-1/2 dtw-flex dtw-items-center dtw-justify-center dtw-rounded-[var(--panel-inputs-arrow-radius)] dtw-border dtw-border-[color:var(--panel-inputs-arrow-border-color)] dtw-bg-[var(--panel-inputs-arrow-bg)] dtw-px-[var(--panel-inputs-group-px-arrow)] dtw-py-[var(--panel-inputs-group-py-arrow)]">
    <ArrowDownIcon className="dtw-h-[var(--panel-inputs-group-arrow-size)] dtw-w-[var(--panel-inputs-group-arrow-size)] dtw-text-[color:var(--panel-inputs-arrow-color)]" />
  </div>
)
