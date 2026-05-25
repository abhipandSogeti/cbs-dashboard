export const populationConfig = {
    datasetId: '37296ned',
    columns: [
        { accessorKey: 'Perioden', header: 'Period', cell: (info) => info.getValue() },
        { accessorKey: 'TotaleBevolking_1', header: 'Total Population', cell: (info) => { const val = info.getValue(); return val !== null ? val.toLocaleString('nl-NL') : '-'; } },
        { accessorKey: 'Mannen_2', header: 'Men', cell: (info) => { const val = info.getValue(); return val !== null ? val.toLocaleString('nl-NL') : '-'; } },
        { accessorKey: 'Vrouwen_3', header: 'Women', cell: (info) => { const val = info.getValue(); return val !== null ? val.toLocaleString('nl-NL') : '-'; } },
        { accessorKey: 'TotaleBevolkingsgroei_67', header: 'Population Growth', cell: (info) => { const val = info.getValue(); return val !== null ? val.toLocaleString('nl-NL') : '-'; } },
    ],
};
