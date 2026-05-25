const columns = [
    {
        accessorKey: 'Perioden',
        header: 'Period',
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: 'EnergiedragerSoorten',
        header: 'Energy Source',
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: 'TotaalBinnenlandsBrutoVerbruik_1',
        header: 'Total Consumption (PJ)',
        cell: (info) => {
            const val = info.getValue();
            return val !== null ? val.toLocaleString('nl-NL') : '-';
        },
    },
];
export const energyConfig = {
    datasetId: '83140ned',
    columns,
};
