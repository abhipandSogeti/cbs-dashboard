import type { ColumnDef } from '@tanstack/react-table'
import type { EconomyRow } from '../types/economy.schema'

const columns: ColumnDef<EconomyRow>[] = [
  {
    accessorKey: 'Perioden',
    header: 'Period',
    cell: (info) => info.getValue<string>(),
  },
  {
    accessorKey: 'BrutoProductie_1',
    header: 'Gross Output (M€)',
    cell: (info) => {
      const val = info.getValue<number | null>()
      return val !== null ? val.toLocaleString('nl-NL') : '-'
    },
  },
  {
    accessorKey: 'ToegegevoedeWaarde_2',
    header: 'Value Added (M€)',
    cell: (info) => {
      const val = info.getValue<number | null>()
      return val !== null ? val.toLocaleString('nl-NL') : '-'
    },
  },
]

export const economyConfig = {
  datasetId: '84410NED',
  columns,
}
