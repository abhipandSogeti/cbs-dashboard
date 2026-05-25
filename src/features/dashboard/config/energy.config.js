export const energyConfig = {
    datasetId: '83140ned',
    columns: [
        { accessorKey: 'Perioden', header: 'Period', cell: (info) => info.getValue() },
        { accessorKey: 'Energiedragers', header: 'Energy Source', cell: (info) => info.getValue().trim() },
        { accessorKey: 'TotaalAanbodTPES_1', header: 'Total Supply (PJ)', cell: (info) => { const val = info.getValue(); return val !== null ? val.toLocaleString('nl-NL') : '-'; } },
        { accessorKey: 'NettoInvoer_5', header: 'Net Import (PJ)', cell: (info) => { const val = info.getValue(); return val !== null ? val.toLocaleString('nl-NL') : '-'; } },
    ],
};
