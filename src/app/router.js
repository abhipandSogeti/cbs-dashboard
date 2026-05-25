import { jsx as _jsx } from "react/jsx-runtime";
import { useDashboardStore } from '@/features/dashboard/store/dashboard.store';
import { DashboardLayout } from '@/features/dashboard/components/dashboard-layout';
import { PopulationView } from '@/features/dashboard/views/population-view';
import { LabourView } from '@/features/dashboard/views/labour-view';
import { EconomyView } from '@/features/dashboard/views/economy-view';
import { EnergyView } from '@/features/dashboard/views/energy-view';
const viewMap = {
    population: _jsx(PopulationView, {}),
    labour: _jsx(LabourView, {}),
    economy: _jsx(EconomyView, {}),
    energy: _jsx(EnergyView, {}),
};
export const App = () => {
    const { activeView } = useDashboardStore();
    return (_jsx(DashboardLayout, { children: viewMap[activeView] }));
};
