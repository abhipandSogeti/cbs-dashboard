import { useMemo } from "react";
import { Globe, Map, Building2, Sun } from "lucide-react";
import { ViewHeader } from "@/shared/components/view-header";
import { CbsOverviewFlow } from "../components/flows/cbs-overview-flow";
import { InteractiveDemoFlow } from "../components/flows/interactive-demo-flow";
import { useAllCountries, formatPop } from "../hooks/use-countries";

export const OverviewView = () => {
  const { data: countries = [], isLoading } = useAllCountries();

  const categories = useMemo(() => {
    const sum = (region: string) =>
      countries
        .filter((c) => c.region.toLowerCase() === region)
        .reduce((s, c) => s + c.population, 0);

    return [
      {
        id: "population" as const,
        label: "Europe",
        Icon: Globe,
        value: formatPop(sum("europe")),
      },
      {
        id: "labour" as const,
        label: "Americas",
        Icon: Map,
        value: formatPop(sum("americas")),
      },
      {
        id: "economy" as const,
        label: "Asia",
        Icon: Building2,
        value: formatPop(sum("asia")),
      },
      {
        id: "energy" as const,
        label: "Africa",
        Icon: Sun,
        value: formatPop(sum("africa")),
      },
    ];
  }, [countries]);

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader
        title="World Population"
        subtitle="REST Countries — Live Open Data"
        updatedAt="2024"
      />
      <p className="text-sm text-slate-500 -mt-2">
        Click a region to explore countries and sub-regions.
      </p>
      <CbsOverviewFlow categories={categories} loading={isLoading} />
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 -mb-2">
        Interactive Demo
      </p>
      <InteractiveDemoFlow />
    </div>
  );
};
