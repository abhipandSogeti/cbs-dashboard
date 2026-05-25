import type { ColumnDef } from '@tanstack/react-table'
import type { EconomyRow } from '../types/economy.schema'

const columns: ColumnDef<EconomyRow>[] = [
  {
    accessorKey: 'Perioden',
    header: 'Period',
    cell: (info) => info.getValue<string>(),
  },
  {
    accessorKey: 'GoederenEnDiensten',
    header: 'Goods & Services',
    cell: (info) => info.getValue<string>().trim(),
  },
  {
    accessorKey: 'Volumemutaties_1',
    header: 'Volume Change %',
    cell: (info) => {
      const val = info.getValue<number | null>()
      return val !== null ? `${val.toFixed(1)}%` : '-'
    },
  },
  {
    accessorKey: 'Indexcijfers2000100_3',
    header: 'Index (2000=100)',
    cell: (info) => {
      const val = info.getValue<number | null>()
      return val !== null ? val.toFixed(1) : '-'
    },
  },
]

export const economyConfig = {
  datasetId: '70076ned',
  columns,
}
