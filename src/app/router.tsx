import { useDashboardStore } from "@/features/dashboard/store/dashboard.store";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { OverviewView } from "@/features/dashboard/views/overview-view";
import { PopulationView } from "@/features/dashboard/views/population-view";
import { LabourView } from "@/features/dashboard/views/labour-view";
import { EconomyView } from "@/features/dashboard/views/economy-view";
import { EnergyView } from "@/features/dashboard/views/energy-view";
import type { ViewId } from "@/features/dashboard/store/dashboard.store";

const viewMap: Record<ViewId, React.ReactNode> = {
  overview: <OverviewView />,
  population: <PopulationView />,
  labour: <LabourView />,
  economy: <EconomyView />,
  energy: <EnergyView />,
};

export const App = () => {
  const { activeView } = useDashboardStore();

  return <DashboardLayout>{viewMap[activeView]}</DashboardLayout>;
};
