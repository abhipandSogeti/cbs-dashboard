import { Sparkline } from '@/shared/components/sparkline'

export type Stat = {
  label: string
  value: string
  sub?: string
  icon?: React.ReactNode
  trend?: number
  sparkData?: number[]
}

type StatsBarProps = {
  stats: Stat[]
  loading: boolean
}

const TrendBadge = ({ trend }: { trend: number }) => {
  const isUp = trend >= 0
  return (
    <span
      className={
        isUp
          ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'
          : 'rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600'
      }
    >
      {isUp ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
    </span>
  )
}

export const StatsBar = ({ stats, loading }: StatsBarProps) => (
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
    {stats.map(({ label, value, sub, icon, trend, sparkData }) => (
      <div
        key={label}
        className="flex flex-col rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
      >
        {/* Top row: icon + trend badge */}
        <div className="flex items-center justify-between">
          {icon !== undefined ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
              {icon}
            </span>
          ) : (
            <span className="h-9 w-9" />
          )}
          {trend !== undefined && !loading && <TrendBadge trend={trend} />}
        </div>

        {/* Label */}
        <p className="mt-3 text-xs text-slate-500">{label}</p>

        {/* Value / skeleton */}
        {loading ? (
          <div
            role="status"
            aria-label="Loading"
            className="mt-1 h-9 w-28 animate-pulse rounded-lg bg-slate-100"
          />
        ) : (
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        )}

        {/* Sub-unit */}
        {sub !== undefined && (
          <p className="mt-0.5 text-xs text-slate-400">{sub}</p>
        )}

        {/* Sparkline */}
        {sparkData !== undefined && sparkData.length >= 2 && !loading && (
          <Sparkline data={sparkData} className="mt-3 h-10 w-full" />
        )}
      </div>
    ))}
  </div>
)
