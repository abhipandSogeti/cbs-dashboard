import { useCallback, useMemo, useState } from "react";
import { Zap } from "lucide-react";
import { useDashboardStore } from "../store/dashboard.store";
import { useEnergy } from "../hooks/use-energy";
import { StatsBar } from "../components/stats-bar";
import { CategoryBreakdownFlow } from "../components/flows/category-breakdown-flow";
import { ViewHeader } from "@/shared/components/view-header";
import type { Stat } from "../components/stats-bar";
import type { DimensionItem } from "../components/flows/category-breakdown-flow";

export const EnergyView = () => {
  const { tableStates } = useDashboardStore();
  const state = tableStates.energy;
  const { data, isLoading, error } = useEnergy(state);

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
            label: "Total Supply",
            value: `${(firstRow.TotaalAanbodTPES_1 ?? 0).toLocaleString("nl-NL")} PJ`,
            sub: "TPES",
            icon: <Zap className="h-5 w-5" />,
            sparkData: rows.slice(0, 8).map((r) => r.TotaalAanbodTPES_1 ?? 0),
          },
        ]
      : [];

  const dimensions: DimensionItem[] =
    activeRow !== undefined
      ? [
          {
            id: "total-supply",
            label: "Total Supply",
            value: `${(activeRow.TotaalAanbodTPES_1 ?? 0).toLocaleString("nl-NL")} PJ`,
            isNegative: false,
          },
          {
            id: "net-import",
            label: "Net Import",
            value: `${(activeRow.NettoInvoer_5 ?? 0).toLocaleString("nl-NL")} PJ`,
            isNegative: (activeRow.NettoInvoer_5 ?? 0) < 0,
          },
        ]
      : [];

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Energy" updatedAt="May 2026" />
      <StatsBar stats={stats} loading={isLoading} />
      <CategoryBreakdownFlow
        periods={periods}
        selectedPeriod={activePeriod}
        onPeriodChange={handlePeriodChange}
        primaryLabel="Total Supply (TPES)"
        primaryValue={
          activeRow !== undefined
            ? `${(activeRow.TotaalAanbodTPES_1 ?? 0).toLocaleString("nl-NL")} PJ`
            : "—"
        }
        primaryUnit="petajoules"
        sparkData={rows.slice(0, 8).map((r) => r.TotaalAanbodTPES_1 ?? 0)}
        dimensions={dimensions}
        loading={isLoading}
        error={error ?? null}
      />
    </div>
  );
};
