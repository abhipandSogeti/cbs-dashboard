import type { ColumnDef } from '@tanstack/react-table'
import type { LabourRow } from '../types/labour.schema'

const columns: ColumnDef<LabourRow>[] = [
  {
    accessorKey: 'Perioden',
    header: 'Period',
    cell: (info) => info.getValue<string>(),
  },
  {
    accessorKey: 'Geslacht',
    header: 'Gender',
    cell: (info) => info.getValue<string>().trim(),
  },
  {
    accessorKey: 'Leeftijd',
    header: 'Age Group',
    cell: (info) => info.getValue<string>().trim(),
  },
  {
    accessorKey: 'NietSeizoengecorrigeerd_1',
    header: 'Labour Force (x1000)',
    cell: (info) => {
      const val = info.getValue<number | null>()
      return val !== null ? val.toLocaleString('nl-NL') : '-'
    },
  },
  {
    accessorKey: 'Seizoengecorrigeerd_2',
    header: 'Seasonally Adjusted (x1000)',
    cell: (info) => {
      const val = info.getValue<number | null>()
      return val !== null ? val.toLocaleString('nl-NL') : '-'
    },
  },
]

export const labourConfig = {
  datasetId: '80590ned',
  columns,
}
