import { useCallback, useMemo, useState } from "react";
import { TrendingUp, BarChart3 } from "lucide-react";
import { useDashboardStore } from "../store/dashboard.store";
import { useEconomy } from "../hooks/use-economy";
import { StatsBar } from "../components/stats-bar";
import { CategoryBreakdownFlow } from "../components/flows/category-breakdown-flow";
import { ViewHeader } from "@/shared/components/view-header";
import type { Stat } from "../components/stats-bar";
import type { DimensionItem } from "../components/flows/category-breakdown-flow";

export const EconomyView = () => {
  const { tableStates } = useDashboardStore();
  const state = tableStates.economy;
  const { data, isLoading, error } = useEconomy(state);

  const rows = data?.rows ?? [];
  const firstRow = rows[0];

  const periods = useMemo(
    () =>
      [...new Set(rows.map((r) => r.Perioden))].sort((a, b) =>
        b.localeCompare(a),
      ),
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
            label: "Volume Change",
            value: `${firstRow.Volumemutaties_1?.toFixed(1) ?? "-"}%`,
            icon: <TrendingUp className="h-5 w-5" />,
            sparkData: rows.slice(0, 8).map((r) => r.Volumemutaties_1 ?? 0),
          },
          {
            label: "Index (2000=100)",
            value: firstRow.Indexcijfers2000100_3?.toFixed(1) ?? "-",
            icon: <BarChart3 className="h-5 w-5" />,
            sparkData: rows
              .slice(0, 8)
              .map((r) => r.Indexcijfers2000100_3 ?? 0),
          },
        ]
      : [];

  const dimensions: DimensionItem[] =
    activeRow !== undefined
      ? [
          {
            id: "volume-change",
            label: "Volume Change",
            value: `${activeRow.Volumemutaties_1?.toFixed(1) ?? "—"}%`,
            isNegative: (activeRow.Volumemutaties_1 ?? 0) < 0,
          },
          {
            id: "index",
            label: "Index (2000=100)",
            value: activeRow.Indexcijfers2000100_3?.toFixed(1) ?? "—",
            isNegative: false,
          },
        ]
      : [];

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Economy" updatedAt="May 2026" />
      <StatsBar stats={stats} loading={isLoading} />
      <CategoryBreakdownFlow
        periods={periods}
        selectedPeriod={activePeriod}
        onPeriodChange={handlePeriodChange}
        primaryLabel="Volume Change"
        primaryValue={
          activeRow !== undefined
            ? `${activeRow.Volumemutaties_1?.toFixed(1) ?? "—"}%`
            : "—"
        }
        sparkData={rows.slice(0, 8).map((r) => r.Volumemutaties_1 ?? 0)}
        dimensions={dimensions}
        loading={isLoading}
        error={error ?? null}
      />
    </div>
  );
};
