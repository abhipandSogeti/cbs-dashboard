import { useMemo } from "react";
import { Users, Briefcase, TrendingUp, Zap } from "lucide-react";
import { ViewHeader } from "@/shared/components/view-header";
import { CbsOverviewFlow } from "../components/flows/cbs-overview-flow";
import { usePopulation } from "../hooks/use-population";
import { useLabour } from "../hooks/use-labour";
import { useEconomy } from "../hooks/use-economy";
import { useEnergy } from "../hooks/use-energy";
import type { TableState } from "../store/dashboard.store";

// Fetch just the most-recent row for each category (overview doesn't need history)
const OVERVIEW_STATE: TableState = {
  pagination: { pageIndex: 0, pageSize: 1 },
  sorting: [],
  columnVisibility: {},
  globalFilter: "",
};

export const OverviewView = () => {
  const population = usePopulation(OVERVIEW_STATE);
  const labour = useLabour(OVERVIEW_STATE);
  const economy = useEconomy(OVERVIEW_STATE);
  const energy = useEnergy(OVERVIEW_STATE);

  const isLoading =
    population.isLoading ||
    labour.isLoading ||
    economy.isLoading ||
    energy.isLoading;

  const popRow = population.data?.rows[0];
  const labRow = labour.data?.rows[0];
  const ecoRow = economy.data?.rows[0];
  const engRow = energy.data?.rows[0];

  const categories = useMemo(
    () => [
      {
        id: "population" as const,
        label: "Population",
        Icon: Users,
        value:
          popRow !== undefined
            ? (popRow.TotaleBevolking_1 ?? 0).toLocaleString("nl-NL")
            : "—",
      },
      {
        id: "labour" as const,
        label: "Labour",
        Icon: Briefcase,
        value:
          labRow !== undefined
            ? `${(labRow.NietSeizoengecorrigeerd_1 ?? 0).toLocaleString("nl-NL")}k`
            : "—",
      },
      {
        id: "economy" as const,
        label: "Economy",
        Icon: TrendingUp,
        value:
          ecoRow !== undefined
            ? `${ecoRow.Volumemutaties_1?.toFixed(1) ?? "—"}%`
            : "—",
      },
      {
        id: "energy" as const,
        label: "Energy",
        Icon: Zap,
        value:
          engRow !== undefined
            ? `${(engRow.TotaalAanbodTPES_1 ?? 0).toLocaleString("nl-NL")} PJ`
            : "—",
      },
    ],
    [popRow, labRow, ecoRow, engRow],
  );

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader
        title="CBS Netherlands"
        subtitle="Statistics Netherlands — Open Data Dashboard"
        updatedAt="May 2026"
      />
      <p className="text-sm text-slate-500 -mt-2">
        Click a category to explore detailed statistics.
      </p>
      <CbsOverviewFlow categories={categories} loading={isLoading} />
    </div>
  );
};
