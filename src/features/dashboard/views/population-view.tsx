import { useCallback, useMemo, useState } from "react";
import { Users, TrendingUp } from "lucide-react";
import { useDashboardStore } from "../store/dashboard.store";
import { usePopulation } from "../hooks/use-population";
import { StatsBar } from "../components/stats-bar";
import { CategoryBreakdownFlow } from "../components/flows/category-breakdown-flow";
import { ViewHeader } from "@/shared/components/view-header";
import type { Stat } from "../components/stats-bar";
import type { DimensionItem } from "../components/flows/category-breakdown-flow";

export const PopulationView = () => {
  const { tableStates } = useDashboardStore();
  const state = tableStates.population;
  const { data, isLoading, error } = usePopulation(state);

  const rows = data?.rows ?? [];
  const firstRow = rows[0];

  const periods = useMemo(
    () =>
      [...new Set(rows.map((r) => r.Perioden))].sort((a, b) =>
        b.localeCompare(a),
      ),
    [rows],
  );

  const sparkData = useMemo(
    () => rows.slice(0, 8).map((r) => r.TotaleBevolking_1 ?? 0),
    [rows],
  );

  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const activePeriod =
    selectedPeriod !== "" ? selectedPeriod : (periods[0] ?? "");
  const activeRow = rows.find((r) => r.Perioden === activePeriod) ?? firstRow;

  const handlePeriodChange = useCallback(
    (period: string) => setSelectedPeriod(period),
    [],
  );

  const stats: Stat[] =
    firstRow !== undefined
      ? [
          {
            label: "Total Population",
            value: (firstRow.TotaleBevolking_1 ?? 0).toLocaleString("nl-NL"),
            sub: "persons",
            icon: <Users className="h-5 w-5" />,
            sparkData: rows.slice(0, 8).map((r) => r.TotaleBevolking_1 ?? 0),
          },
          {
            label: "Annual Growth",
            value: (firstRow.TotaleBevolkingsgroei_67 ?? 0).toLocaleString(
              "nl-NL",
            ),
            sub: "persons",
            icon: <TrendingUp className="h-5 w-5" />,
            sparkData: rows
              .slice(0, 8)
              .map((r) => r.TotaleBevolkingsgroei_67 ?? 0),
          },
        ]
      : [];

  const dimensions: DimensionItem[] =
    activeRow !== undefined
      ? [
          {
            id: "men",
            label: "Men",
            value: (activeRow.Mannen_2 ?? 0).toLocaleString("nl-NL"),
            isNegative: false,
          },
          {
            id: "women",
            label: "Women",
            value: (activeRow.Vrouwen_3 ?? 0).toLocaleString("nl-NL"),
            isNegative: false,
          },
          {
            id: "growth",
            label: "Population Growth",
            value: (activeRow.TotaleBevolkingsgroei_67 ?? 0).toLocaleString(
              "nl-NL",
            ),
            isNegative: (activeRow.TotaleBevolkingsgroei_67 ?? 0) < 0,
          },
        ]
      : [];

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Population" updatedAt="May 2026" />
      <StatsBar stats={stats} loading={isLoading} />
      <CategoryBreakdownFlow
        periods={periods}
        selectedPeriod={activePeriod}
        onPeriodChange={handlePeriodChange}
        primaryLabel="Total Population"
        primaryValue={
          activeRow !== undefined
            ? (activeRow.TotaleBevolking_1 ?? 0).toLocaleString("nl-NL")
            : "—"
        }
        primaryUnit="persons"
        sparkData={sparkData}
        dimensions={dimensions}
        loading={isLoading}
        error={error ?? null}
      />
    </div>
  );
};
