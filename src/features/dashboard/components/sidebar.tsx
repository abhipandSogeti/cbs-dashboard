import { clsx } from "clsx";
import { LayoutDashboard, Globe, Map, Building2, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useDashboardStore, type ViewId } from "../store/dashboard.store";

const views: { id: ViewId; label: string; Icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "population", label: "Europe", Icon: Globe },
  { id: "labour", label: "Americas", Icon: Map },
  { id: "economy", label: "Asia", Icon: Building2 },
  { id: "energy", label: "Africa", Icon: Sun },
];

export const Sidebar = () => {
  const { activeView, setActiveView } = useDashboardStore();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-6">
      {/* Brand */}
      <div className="mb-6 flex items-center gap-2 px-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-xs font-bold text-white">
          🌍
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-slate-900">World</span>
          <span className="text-xs text-slate-400">Population Explorer</span>
        </div>
      </div>

      {/* Nav section */}
      <p className="mb-1 px-3 text-xs font-medium uppercase tracking-widest text-slate-400">
        REGIONS
      </p>
      <nav aria-label="Dashboard navigation" className="flex flex-col gap-0.5">
        {views.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            aria-current={activeView === id ? "page" : undefined}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
              activeView === id
                ? "border-l-2 border-teal-600 bg-teal-50 font-medium text-teal-700"
                : "border-l-2 border-transparent text-slate-600 hover:bg-slate-50",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
};
