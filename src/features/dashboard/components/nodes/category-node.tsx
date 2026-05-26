import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import type { LucideIcon } from 'lucide-react'
import { clsx } from 'clsx'

type CategoryNodeData = {
  label: string
  value: string
  trend?: number
  Icon: LucideIcon
}
type CategoryNodeType = Node<CategoryNodeData, 'category'>

export const CategoryNode = ({ data }: NodeProps<CategoryNodeType>) => {
  const { label, value, trend, Icon } = data
  const isPositive = trend === undefined || trend >= 0

  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-2 rounded-2xl border bg-white px-5 py-4 shadow-md',
        'w-40 cursor-pointer transition-transform hover:scale-105 hover:shadow-xl',
        'border-slate-200'
      )}
      role="button"
      aria-label={`Navigate to ${label} view`}
    >
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left}   style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right}  style={{ opacity: 0 }} />

      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-lg font-bold text-slate-900 text-center leading-tight">{value}</p>
      {trend !== undefined && (
        <span
          className={clsx(
            'rounded-full px-2 py-0.5 text-xs font-medium',
            isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          )}
          aria-label={`${isPositive ? 'Up' : 'Down'} ${Math.abs(trend).toFixed(1)} percent`}
        >
          {isPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
        </span>
      )}
    </div>
  )
}
