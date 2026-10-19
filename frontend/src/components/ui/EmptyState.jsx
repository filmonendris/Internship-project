export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center" role="status">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-brand-card border border-brand-border flex items-center justify-center mb-4">
          <Icon size={28} className="text-gray-500" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-surface-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-surface-muted max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
