// src/features/dashboard/components/sidebar.tsx
import { clsx } from 'clsx'
import { useDashboardStore, type ViewId } from '../store/dashboard.store'

const views: { id: ViewId; label: string }[] = [
  { id: 'population', label: 'Population' },
  { id: 'labour',     label: 'Labour' },
  { id: 'economy',    label: 'Economy' },
  { id: 'energy',     label: 'Energy' },
]

export const Sidebar = () => {
  const { activeView, setActiveView } = useDashboardStore()

  return (
    <aside className="flex w-52 shrink-0 flex-col border-r border-neutral-200 px-3 py-6">
      <span className="mb-6 px-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
        CBS Netherlands
      </span>
      <nav className="flex flex-col gap-1">
        {views.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={clsx(
              'rounded-md px-3 py-2 text-left text-sm transition-colors',
              activeView === id
                ? 'bg-neutral-900 font-medium text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            )}
          >
            {label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
