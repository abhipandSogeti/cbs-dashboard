const columns = [
    {
        accessorKey: 'Perioden',
        header: 'Period',
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: 'BrutoProductie_1',
        header: 'Gross Output (M€)',
        cell: (info) => {
            const val = info.getValue();
            return val !== null ? val.toLocaleString('nl-NL') : '-';
        },
    },
    {
        accessorKey: 'ToegegevoedeWaarde_2',
        header: 'Value Added (M€)',
        cell: (info) => {
            const val = info.getValue();
            return val !== null ? val.toLocaleString('nl-NL') : '-';
        },
    },
];
export const economyConfig = {
    datasetId: '84410NED',
    columns,
};
