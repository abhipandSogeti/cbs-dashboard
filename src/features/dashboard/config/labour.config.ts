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
    cell: (info) => info.getValue<string>(),
  },
  {
    accessorKey: 'Arbeidsdeelname_1',
    header: 'Participation %',
    cell: (info) => {
      const val = info.getValue<number | null>()
      return val !== null ? `${val.toFixed(1)}%` : '-'
    },
  },
]

export const labourConfig = {
  datasetId: '85039NED',
  columns,
}
