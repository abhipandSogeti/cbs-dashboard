import { Sidebar } from './sidebar'

type DashboardLayoutProps = {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <div className="flex h-screen bg-slate-50">
    <Sidebar />
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </div>
    </main>
  </div>
)
