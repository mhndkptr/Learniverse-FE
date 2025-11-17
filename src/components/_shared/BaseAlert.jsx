import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleAlert, CircleCheckBig, TriangleAlert } from 'lucide-react'

export default function BaseAlert({
  type = 'base', // "none", "warning", "info", "danger", "success"
  title = null,
  icon = null,
  showIcon = true,
  descriptionPoints = [],
  containerClassName = '',
}) {
  return (
    <Alert
      className={`w-full [&>svg]:row-span-2 [&>svg]:size-4 [&>svg]:md:size-5 ${containerClassName} ${
        type === 'base' &&
        'border-muted-foreground text-foreground bg-transparent'
      } ${type === 'warning' && 'border-[#BF6A02] bg-[#FFFBEB] text-[#BF6A02]'} ${
        type === 'info' && 'bg-sky-100 text-sky-500'
      } ${type === 'danger' && 'bg-red-50 text-red-600'} ${type === 'success' && 'bg-green-50 text-[#009951]'}`}
    >
      {showIcon && icon && icon}
      {showIcon && icon === null && type === 'warning' && <CircleAlert />}
      {showIcon && icon === null && type === 'info' && <CircleAlert />}
      {showIcon && icon === null && type === 'danger' && <TriangleAlert />}
      {showIcon && icon === null && type === 'success' && <CircleCheckBig />}

      <AlertTitle
        className={`flex gap-1 ${descriptionPoints.length === 1 ? 'text-sm font-semibold md:text-base' : 'text-sm font-medium md:text-base'} items-center`}
      >
        {descriptionPoints.length > 1 && (
          <p
            className={`${type === 'warning' && 'text-[#682D03]'} ${type === 'info' && 'text-sky-500'} ${
              type === 'danger' && 'text-red-600'
            } ${type === 'success' && 'text-[#008245]'}`}
          >
            Perhatian:{' '}
          </p>
        )}{' '}
        <p
          className={`${descriptionPoints.length === 1 ? 'text-sm font-semibold md:text-base' : 'text-sm font-medium md:text-base'} items-center`}
        >
          {title}
        </p>
      </AlertTitle>
      <AlertDescription
        className={`${descriptionPoints.length === 1 ? 'mt-0' : 'mt-2'}`}
      >
        {descriptionPoints.length === 1 ? (
          <p
            className={`${type === 'warning' && 'text-[#BF6A02]'} ${type === 'info' && 'text-sky-500'} ${
              type === 'danger' && 'text-red-600'
            } ${type === 'success' && 'text-[#14AE5C]'} text-sm`}
          >
            {descriptionPoints[0]}
          </p>
        ) : (
          <ul className="list-disc space-y-1 pl-5">
            {descriptionPoints.map((point, index) => (
              <li
                key={index}
                className={`${type === 'warning' && 'text-[#BF6A02]'} ${
                  type === 'info' && 'text-sky-500'
                } ${type === 'danger' && 'text-red-600'} ${
                  type === 'success' && 'text-[#14AE5C]'
                } text-sm`}
              >
                {point}
              </li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  )
}
