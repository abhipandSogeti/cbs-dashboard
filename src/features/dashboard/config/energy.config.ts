import type { ColumnDef } from '@tanstack/react-table'
import type { EnergyRow } from '../types/energy.schema'

const columns: ColumnDef<EnergyRow>[] = [
  {
    accessorKey: 'Perioden',
    header: 'Period',
    cell: (info) => info.getValue<string>(),
  },
  {
    accessorKey: 'Energiedragers',
    header: 'Energy Source',
    cell: (info) => info.getValue<string>().trim(),
  },
  {
    accessorKey: 'TotaalAanbodTPES_1',
    header: 'Total Supply (PJ)',
    cell: (info) => {
      const val = info.getValue<number | null>()
      return val !== null ? val.toLocaleString('nl-NL') : '-'
    },
  },
  {
    accessorKey: 'NettoInvoer_5',
    header: 'Net Import (PJ)',
    cell: (info) => {
      const val = info.getValue<number | null>()
      return val !== null ? val.toLocaleString('nl-NL') : '-'
    },
  },
]

export const energyConfig = {
  datasetId: '83140ned',
  columns,
}
