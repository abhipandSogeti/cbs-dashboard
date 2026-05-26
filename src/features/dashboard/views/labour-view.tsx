import { useCallback, useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import { useDashboardStore } from "../store/dashboard.store";
import { useLabour } from "../hooks/use-labour";
import { StatsBar } from "../components/stats-bar";
import { CategoryBreakdownFlow } from "../components/flows/category-breakdown-flow";
import { ViewHeader } from "@/shared/components/view-header";
import type { Stat } from "../components/stats-bar";
import type { DimensionItem } from "../components/flows/category-breakdown-flow";

export const LabourView = () => {
  const { tableStates } = useDashboardStore();
  const state = tableStates.labour;
  const { data, isLoading, error } = useLabour(state);

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
    () => rows.slice(0, 8).map((r) => r.NietSeizoengecorrigeerd_1 ?? 0),
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
            label: "Labour Force",
            value: `${(firstRow.NietSeizoengecorrigeerd_1 ?? 0).toLocaleString("nl-NL")}k`,
            sub: "x1000 persons",
            icon: <Briefcase className="h-5 w-5" />,
            sparkData: rows
              .slice(0, 8)
              .map((r) => r.NietSeizoengecorrigeerd_1 ?? 0),
          },
        ]
      : [];

  const dimensions: DimensionItem[] =
    activeRow !== undefined
      ? [
          {
            id: "labour-force",
            label: "Labour Force",
            value: `${(activeRow.NietSeizoengecorrigeerd_1 ?? 0).toLocaleString("nl-NL")}k`,
            isNegative: false,
          },
          {
            id: "seasonally-adjusted",
            label: "Seasonally Adjusted",
            value: `${(activeRow.Seizoengecorrigeerd_2 ?? 0).toLocaleString("nl-NL")}k`,
            isNegative: false,
          },
        ]
      : [];

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Labour Market" updatedAt="May 2026" />
      <StatsBar stats={stats} loading={isLoading} />
      <CategoryBreakdownFlow
        periods={periods}
        selectedPeriod={activePeriod}
        onPeriodChange={handlePeriodChange}
        primaryLabel="Labour Force"
        primaryValue={
          activeRow !== undefined
            ? `${(activeRow.NietSeizoengecorrigeerd_1 ?? 0).toLocaleString("nl-NL")}k`
            : "—"
        }
        primaryUnit="x1000 persons"
        sparkData={sparkData}
        dimensions={dimensions}
        loading={isLoading}
        error={error ?? null}
      />
    </div>
  );
};
