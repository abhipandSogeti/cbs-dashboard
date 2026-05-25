export const labourConfig = {
    datasetId: '80590ned',
    columns: [
        { accessorKey: 'Perioden', header: 'Period', cell: (info) => info.getValue() },
        { accessorKey: 'Geslacht', header: 'Gender', cell: (info) => info.getValue().trim() },
        { accessorKey: 'Leeftijd', header: 'Age Group', cell: (info) => info.getValue().trim() },
        { accessorKey: 'NietSeizoengecorrigeerd_1', header: 'Labour Force (x1000)', cell: (info) => { const val = info.getValue(); return val !== null ? val.toLocaleString('nl-NL') : '-'; } },
        { accessorKey: 'Seizoengecorrigeerd_2', header: 'Seasonally Adjusted (x1000)', cell: (info) => { const val = info.getValue(); return val !== null ? val.toLocaleString('nl-NL') : '-'; } },
    ],
};
