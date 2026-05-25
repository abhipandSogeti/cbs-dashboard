// src/features/dashboard/components/dashboard-layout.tsx
import { Sidebar } from './sidebar'

type DashboardLayoutProps = {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <div className="flex h-screen bg-white">
    <Sidebar />
    <main className="flex-1 overflow-auto">
      {children}
    </main>
  </div>
)
