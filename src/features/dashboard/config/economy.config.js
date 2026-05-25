export const economyConfig = {
    datasetId: '70076ned',
    columns: [
        { accessorKey: 'Perioden', header: 'Period', cell: (info) => info.getValue() },
        { accessorKey: 'GoederenEnDiensten', header: 'Goods & Services', cell: (info) => info.getValue().trim() },
        { accessorKey: 'Volumemutaties_1', header: 'Volume Change %', cell: (info) => { const val = info.getValue(); return val !== null ? `${val.toFixed(1)}%` : '-'; } },
        { accessorKey: 'Indexcijfers2000100_3', header: 'Index (2000=100)', cell: (info) => { const val = info.getValue(); return val !== null ? val.toFixed(1) : '-'; } },
    ],
};
