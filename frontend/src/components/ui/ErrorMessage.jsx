import { AlertCircle, RefreshCw } from 'lucide-react'
import Button from './Button'

export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center" role="alert">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-red-400" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-surface-primary mb-1">Oops!</h3>
      <p className="text-sm text-surface-muted max-w-xs mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw size={14} aria-hidden="true" />
          Try again
        </Button>
      )}
    </div>
  )
}
