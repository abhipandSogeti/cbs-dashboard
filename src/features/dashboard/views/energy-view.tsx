import { useCallback, useMemo, useState } from "react";
import { Sun } from "lucide-react";
import { useCountriesByRegion, formatPop } from "../hooks/use-countries";
import { StatsBar } from "../components/stats-bar";
import { CategoryBreakdownFlow } from "../components/flows/category-breakdown-flow";
import { ViewHeader } from "@/shared/components/view-header";
import type { Stat } from "../components/stats-bar";
import type { DimensionItem } from "../components/flows/category-breakdown-flow";

export const EnergyView = () => {
  const {
    data: countries = [],
    isLoading,
    error,
  } = useCountriesByRegion("africa");

  const sorted = useMemo(
    () => [...countries].sort((a, b) => b.population - a.population),
    [countries],
  );

  const subregions = useMemo(
    () => [...new Set(sorted.map((c) => c.subregion).filter(Boolean))].sort(),
    [sorted],
  );

  const [selected, setSelected] = useState("");
  const activeSub = (selected || subregions[0]) ?? "";

  const activeCountries = useMemo(
    () =>
      activeSub
        ? sorted.filter((c) => c.subregion === activeSub)
        : sorted.slice(0, 6),
    [sorted, activeSub],
  );

  const regionTotal = useMemo(
    () => sorted.reduce((s, c) => s + c.population, 0),
    [sorted],
  );

  const subTotal = useMemo(
    () => activeCountries.reduce((s, c) => s + c.population, 0),
    [activeCountries],
  );

  const sparkData = useMemo(
    () => sorted.slice(0, 8).map((c) => c.population),
    [sorted],
  );

  const stats: Stat[] =
    sorted.length > 0
      ? [
          {
            label: "Total Population",
            value: formatPop(regionTotal),
            sub: `${sorted.length} countries`,
            icon: <Sun className="h-5 w-5" />,
            sparkData,
          },
        ]
      : [];

  const dimensions: DimensionItem[] = activeCountries.slice(0, 6).map((c) => ({
    id: c.cca3,
    label: c.name.common,
    value: formatPop(c.population),
    isNegative: false,
  }));

  const handleChange = useCallback((s: string) => setSelected(s), []);

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Africa" updatedAt="2024" />
      <StatsBar stats={stats} loading={isLoading} />
      <CategoryBreakdownFlow
        periods={subregions}
        selectedPeriod={activeSub}
        onPeriodChange={handleChange}
        primaryLabel="Population"
        primaryValue={formatPop(subTotal)}
        primaryUnit="people"
        sparkData={sparkData}
        dimensions={dimensions}
        loading={isLoading}
        error={error ?? null}
      />
    </div>
  );
};
