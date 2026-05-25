import type { ColumnDef } from '@tanstack/react-table'
import type { PopulationRow } from '../types/population.schema'

const columns: ColumnDef<PopulationRow>[] = [
  {
    accessorKey: 'Perioden',
    header: 'Period',
    cell: (info) => info.getValue<string>(),
  },
  {
    accessorKey: 'RegioS',
    header: 'Region',
    cell: (info) => info.getValue<string>().trim(),
  },
  {
    accessorKey: 'BevolkingAanHetBeginVanDePeriode_1',
    header: 'Population',
    cell: (info) => {
      const val = info.getValue<number | null>()
      return val !== null ? val.toLocaleString('nl-NL') : '-'
    },
  },
  {
    accessorKey: 'TotaleBevolkingsgroei_4',
    header: 'Growth',
    cell: (info) => {
      const val = info.getValue<number | null>()
      return val !== null ? val.toLocaleString('nl-NL') : '-'
    },
  },
]

export const populationConfig = {
  datasetId: '83765NED',
  columns,
}
