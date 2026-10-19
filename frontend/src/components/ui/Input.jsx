import { AlertCircle } from 'lucide-react'

export default function Input({
  label,
  error,
  id,
  className = '',
  required = false,
  ...props
}) {
  const errorId = id && error ? `${id}-error` : undefined
  const describedBy = [props['aria-describedby'], errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-surface-secondary mb-1.5">
          {label}
          {required && (
            <>
              <span className="text-primary-500 ml-1 select-none" aria-hidden="true">*</span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </label>
      )}
      <input
        id={id}
        required={required}
        aria-required={required ? 'true' : undefined}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={`input-field ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
          <AlertCircle size={13} className="flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
