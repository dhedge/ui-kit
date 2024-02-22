import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

export const GeoBlockAlert = () => (
  <div className="dtw-bg-error/30 dtw-rounded-xl dtw-p-2">
    <p className="dtw-text-error dtw-text-sm">
      Trading is not available for people or entities in restricted
      jurisdictions.
    </p>
    <a
      href="#"
      target="_blank"
      rel="noreferrer"
      className="dtw-text-error dtw-text-sm"
    >
      Learn more in the Terms of Use{' '}
      <ArrowTopRightOnSquareIcon className="dtw-h-3 dtw-w-3 dtw-inline dtw-mb-0.5" />
    </a>
  </div>
)
