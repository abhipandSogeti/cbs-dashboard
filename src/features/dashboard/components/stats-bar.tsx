type Stat = {
  label: string
  value: string
  sub?: string
}

type StatsBarProps = {
  stats: Stat[]
  loading: boolean
}

export const StatsBar = ({ stats, loading }: StatsBarProps) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
    {stats.map(({ label, value, sub }) => (
      <div
        key={label}
        className="rounded-lg border border-neutral-200 bg-white px-5 py-4"
      >
        <p className="text-xs text-neutral-500 mb-1">{label}</p>
        {loading ? (
          <div
            role="status"
            aria-label="Loading"
            className="h-7 w-24 animate-pulse rounded bg-neutral-100"
          />
        ) : (
          <p className="text-2xl font-semibold text-neutral-900">{value}</p>
        )}
        {sub !== undefined && (
          <p className="mt-1 text-xs text-neutral-400">{sub}</p>
        )}
      </div>
    ))}
  </div>
)
