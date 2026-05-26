type ViewHeaderProps = {
  title: string
  subtitle?: string
  updatedAt?: string
}

export const ViewHeader = ({
  title,
  subtitle = 'Central Bureau of Statistics · Netherlands',
  updatedAt,
}: ViewHeaderProps) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
    </div>
    {updatedAt !== undefined && (
      <span className="text-xs text-slate-400 mt-1">Last updated: {updatedAt}</span>
    )}
  </div>
)
