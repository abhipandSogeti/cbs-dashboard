import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/features/dashboard/components/dashboard-layout.tsx
import { Sidebar } from './sidebar';
export const DashboardLayout = ({ children }) => (_jsxs("div", { className: "flex h-screen bg-white", children: [_jsx(Sidebar, {}), _jsx("main", { className: "flex-1 overflow-auto", children: children })] }));
